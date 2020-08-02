from datetime import datetime
from os import path
import tensorflow as tf

processed = path.join('data', 'iftomm_dach_processed_01')

feature_description = {
    'image': tf.io.FixedLenFeature([], tf.string),
    'label': tf.io.FixedLenFeature([], tf.int64),
}
shape = (32, 32, 1)

def decode_record(record_path, feature_description, shape = (32, 32, 1),
    batch_size=32, shuffle_buffer_size=1000):

    def decode_example(example):
        features = tf.io.parse_single_example(example, feature_description)
        image = tf.io.parse_tensor(features['image'], tf.float32)
        image.set_shape(shape)

        return [image, features['label']]

    autotune = tf.data.experimental.AUTOTUNE

    data = (tf.data.TFRecordDataset(record_path)
            .map(decode_example, num_parallel_calls=autotune)
            # .cache()
            .shuffle(shuffle_buffer_size)
            .repeat()
            .batch(batch_size)
            .prefetch(buffer_size=autotune))
    return data

train_dataset = decode_record(path.join(processed, 'train.tfrecord'), feature_description, shape)
validate_dataset = decode_record(path.join(processed, 'validate.tfrecord'), feature_description, shape)
test_dataset = decode_record(path.join(processed, 'test.tfrecord'), feature_description, shape)

model = tf.keras.models.Sequential()
model.add(tf.keras.layers.Conv2D(16, (4,4), activation='relu', padding='same', input_shape=(32, 32, 1)))
model.add(tf.keras.layers.MaxPooling2D(2,2))
model.add(tf.keras.layers.Conv2D(32, (4,4), activation='relu', padding='same'))
model.add(tf.keras.layers.MaxPooling2D(2,2))
model.add(tf.keras.layers.Flatten())
model.add(tf.keras.layers.Dense(3, 'softmax'))

optimizer = tf.keras.optimizers.Adam()
model.compile(loss='sparse_categorical_crossentropy', optimizer=optimizer, metrics=['acc'])

print(model.summary())

log_dir = path.join('logs', 'iftomm_dach_node_detector', datetime.now().strftime("%Y-%m-%dT%H-%M-%S"))
model_path = path.join('models', 'devel', 'iftomm_dach_node_detector.h5')

callbacks = [
    tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1, embeddings_freq=1),
    tf.keras.callbacks.ModelCheckpoint(model_path, save_best_only=True) ]

history = model.fit(
    train_dataset,
    steps_per_epoch=100,
    validation_data=validate_dataset,
    validation_steps=20,
    epochs=60,
    callbacks=callbacks)

print('Saved model to disk (' + model_path + ')')
print(model.evaluate(test_dataset, steps=100))
