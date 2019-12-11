import sys
sys.path.append('.')

import tensorflow as tf
from os.path import join
from src.image_handling import decode_record
from src.utils import Spot

features = {
    'image': tf.io.FixedLenFeature([], tf.string),
    'label': tf.io.FixedLenFeature([], tf.int64),
}
shape = (32, 32, 1)
processed = join('data', 'processed')

training_dataset = decode_record(join(processed, 'train.tfrecord'), features, shape)
validation_dataset = decode_record(join(processed, 'validation.tfrecord'), features, shape)
test_dataset = decode_record(join(processed, 'test.tfrecord'), features, shape)

model_path = join('models', 'symbol_classifier', 'model.h5')

model = tf.keras.models.load_model(model_path)

with Spot('auth.json') as spot:
    spot.message(model.evaluate(training_dataset, steps=300, verbose=0))
    spot.message(model.evaluate(validation_dataset, steps=300, verbose=0))
    spot.message(model.evaluate(test_dataset, steps=300, verbose=0))