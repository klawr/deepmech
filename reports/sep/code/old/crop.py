import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from datetime import datetime
from os import path
import tensorflow as tf


processed = path.join('data', 'sep_processed_04')

feature_description = {
    'image': tf.io.FixedLenFeature([], tf.string),
    'label': tf.io.FixedLenFeature([], tf.int64)
}

def decode(example):
    feature = tf.io.parse_single_example(example, feature_description)
    image = tf.io.parse_tensor(feature['image'], tf.float32)
    # image = tf.image.resize_with_pad(image, 360, 360)
    image = tf.image.convert_image_dtype(image, tf.float32)
    image = tf.image.resize(image, (360, 360))
    label = feature['label']

    return [image, label]

shuffle_buffer_size = 1000
batch_size=32

def take_data(record_path, num):
    return (tf.data.TFRecordDataset(record_path)
        .shuffle(shuffle_buffer_size)
        .take(num)
        .map(decode, num_parallel_calls=tf.data.experimental.AUTOTUNE)
        #.cache()
        .repeat()
        .batch(32)
        .prefetch(buffer_size=tf.data.experimental.AUTOTUNE))


record_path = path.join(processed, 'train.tfrecord')
train = take_data(record_path, 80000)
validation = take_data(record_path, -20000)
test = take_data(record_path, -10000)

inputs = tf.keras.Input(shape=(360, 360, 1))
m = tf.keras.layers.Conv2D(16, (4,4), activation='relu', padding='same')(inputs)
m = tf.keras.layers.MaxPooling2D(2,2)(m)
m = tf.keras.layers.Conv2D(32, (4,4), activation='relu', padding='same')(m)
m = tf.keras.layers.MaxPooling2D(2,2)(m)
m = tf.keras.layers.Flatten()(m)
outputs = tf.keras.layers.Dense(3, 'softmax')(m)

model = tf.keras.Model(inputs = inputs, outputs = outputs)

log_dir = path.join('logs', 'sep_crop_2', datetime.now().strftime("%Y-%m-%dT%H-%M-%S"))
model_path = path.join('models', 'devel', 'sep_crop_2.h5')

callbacks = [
    tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1, embeddings_freq=1),
    tf.keras.callbacks.ModelCheckpoint(model_path, save_best_only=True) ]

model.compile(loss      = 'sparse_categorical_crossentropy',
              optimizer = tf.keras.optimizers.Adam(),
              metrics   = ['acc'])

history = model.fit(
    train,
    steps_per_epoch=100,
    validation_data=validation,
    validation_steps=30,
    epochs=60,
    callbacks=callbacks)

print(model.evaluate(test, steps=100))
