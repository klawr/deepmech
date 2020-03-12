import json
from numpy.random import shuffle, uniform
from os import listdir, makedirs, rename
from os.path import basename, isdir, join
from PIL import Image
import tensorflow as tf

# TODO replace PIL with cv2

def encode_record(final_data_list, labels, target_dir, name):
    """Encode record using a data list, labels, a target directory and a name.

    The final_data_list is a list of dicts, which contain information about
    the image location, the label and an angle which may be provied.

    The labels are used to determine the index for the label property in the
    respective dict.

    Target directory and name are used to determine the location of the record.
    """

    def image_feature(path):
        blob = tf.io.read_file(path)
        blob = tf.image.decode_jpeg(blob, channels=1)
        blob = tf.image.convert_image_dtype(blob, tf.float32)
        blob = tf.image.resize(blob, blob.shape[:-1])
        blob = tf.io.serialize_tensor(blob).numpy()
        blob = tf.train.BytesList(value=[blob])
        return tf.train.Feature(bytes_list=blob)

    def label_feature(label):
        label_index = labels.index(label)
        blob = tf.train.Int64List(value=[label_index])
        return tf.train.Feature(int64_list=blob)

    def angle_feature(angle):
        blob = tf.train.Int64List(value=[int(angle)])
        return tf.train.Feature(int64_list=blob)

    makedirs(target_dir, exist_ok=True)
    record = join(target_dir, name + '.tfrecord')
    with tf.io.TFRecordWriter(record) as out:
        for entry in final_data_list:
            feature = {
                'image': image_feature(entry['image_path']),
                'label': label_feature(entry['label']),
                'angle': angle_feature(entry['angle'])
            }
            features = tf.train.Features(feature=feature)
            example = tf.train.Example(features=features)
            out.write(example.SerializeToString())

def create_example_decoder(feature_description, shape):
    """
    Create a decoder to be handed over for decoding 
    """
    def decode_example(example):
            features = tf.io.parse_single_example(example, feature_description)
            image = tf.io.parse_tensor(features['image'], tf.float32)
            image.set_shape(shape)
            ls = [image]
            for key in ('label', 'angle'):
                if key in feature_description:
                    ls.append(features[key])
            return ls

    return decode_example

def decode_record(record_path, feature_description, shape,
    batch_size=32, shuffle_buffer_size=1000):

    decoder=create_example_decoder(feature_description, shape)
    autotune = tf.data.experimental.AUTOTUNE

    data = (tf.data.TFRecordDataset(record_path)
            .map(decoder, num_parallel_calls=autotune)
            .cache()
            .shuffle(shuffle_buffer_size)
            .repeat()
            .batch(batch_size)
            .prefetch(buffer_size=autotune))
    return data

def augment_images_by_label(src_dir, target_dir, label, target_size=(None, None),
    repetitions=1, h_flip=False, v_flip=False, rotation_range=0, quantity=None):
    data_list = []
    filenames =  list(filter(lambda x: x[-5:] == '.jpeg', listdir(src_dir)))
    for filename in filenames[:quantity]:
        image_path = join(src_dir, filename)
        data = { 'label': label }
        with Image.open(image_path) as image:
            if h_flip:
                image = image.transpose(method=Image.FLIP_TOP_BOTTOM)
            if v_flip:
                image = image.transpose(method=Image.FLIP_LEFT_RIGHT)
            if None not in target_size:
                image = image.resize(target_size)
            angle = uniform(0.0, rotation_range)
            image = image.rotate(angle)
            makedirs(target_dir, exist_ok=True)
            name = str(len(listdir(target_dir)))
            data_list.append({
                'image_path': join(target_dir, name + '.jpeg'),
                'label': label,
                # the angle should be labeled between [0, 180)
                'angle': abs(h_flip*360-abs(v_flip*180-angle)) % 180
            })
            image.save(data_list[-1]['image_path'])
    return data_list

def augment_images(src_dir, target_dir, repetitions=1, *args, **kwargs):
    makedirs(target_dir, exist_ok=True)
    data_list = []
    for label in listdir(src_dir):
        actual_src_dir = join(src_dir, label)
        actual_target_dir = join(target_dir, label)
        for i in range(repetitions):
            data_list += augment_images_by_label(
                actual_src_dir, actual_target_dir, label, *args, **kwargs)
    shuffle(data_list)
    with open(join(target_dir, 'config.json'), 'w') as config:
        json.dump(data_list, config)
    return data_list

def inline_augment_images(directory, *args, **kwargs):
    tmp = directory + '_tmp'
    rename(directory, tmp)
    data_list = augment_images(tmp, directory, *args, **kwargs)

    try:
        shutil.rmtree(tmp, ignore_errors=True)
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))

    return data_list

def reset_and_augment_images(src_dir, target_dir, *args, **kwargs):
    
    try:
        shutil.rmtree(target_dir, ignore_errors=True)
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))

    data_list = augment_images(src_dir, target_dir, *args, **kwargs)
    return data_list

def read_augmented_images(config_file):
    with open(config_file) as config:
        return json.load(config)
