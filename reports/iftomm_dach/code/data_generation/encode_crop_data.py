
import tensorflow as tf
import json
from tqdm import tqdm
from os import mkdir, path

config_file = path.join('data', 'iftomm_dach_interim_023', 'config.json')
target_dir = path.join('data', 'iftomm_dach_processed_02')

train = path.join(target_dir, 'train.tfrecord')
validate = path.join(target_dir, 'validate.tfrecord')
test = path.join(target_dir, 'test.tfrecord')

labels = ['n', 'r', 't']

def read_config_file(config_file):
    with open(config_file) as config:
        return json.load(config)

final_data_list = read_config_file(config_file)

def image_feature(path):
    blob = tf.io.read_file(path)
    blob = tf.image.decode_png(blob, channels=1)
    blob = tf.image.convert_image_dtype(blob, tf.float32)
    blob = tf.image.resize(blob, blob.shape[:-1])
    blob = tf.io.serialize_tensor(blob).numpy()
    blob = tf.train.BytesList(value=[blob])

    return tf.train.Feature(bytes_list=blob)

def label_feature(label):
    if not label: # Bad hack... smh
        label = 'n'
    blob = [labels.index(label)]
    blob = tf.train.Int64List(value=blob)

    return tf.train.Feature(int64_list=blob)

def encode_config(data_list, record):
    with tf.io.TFRecordWriter(record) as out:
        for entry in tqdm(data_list):
            feature = {
                'image': image_feature(entry['crop_path']),
                'label': label_feature(entry['label']),
            }

            features = tf.train.Features(feature=feature)
            example = tf.train.Example(features=features)
            out.write(example.SerializeToString())

encode_config(final_data_list[:60000], train)
encode_config(final_data_list[60000:][:20000], validate)
encode_config(final_data_list[-20000:], test)
