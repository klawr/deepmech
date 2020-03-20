 
import tensorflow as tf
import json
from tqdm import tqdm
from os import mkdir, path


def read_config_file(config_file):
    with open(config_file) as config:
        return json.load(config)

def encode_record(config, labels, target_dir, name):
    try:
        mkdir(target_dir)
    except:
        pass

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

    record = path.join(target_dir, name + '.tfrecord')
    final_data_list = read_config_file(config_file)


    with tf.io.TFRecordWriter(record) as out:
        for entry in tqdm(final_data_list[:100000]):
            feature = {
                'image': image_feature(entry['crop_path']),
                'label': label_feature(entry['label']),
            }

            features = tf.train.Features(feature=feature)
            example = tf.train.Example(features=features)
            out.write(example.SerializeToString())

config_file = path.join('data', 'sep_interim_04', 'config.json')
target_dir = path.join('data', 'sep_processed_04')
encode_record(config_file, ['n', 'r', 't'], target_dir, 'train')
