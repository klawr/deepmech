import sys
sys.path.append('.')

from datetime import datetime
from os.path import join
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import ModelCheckpoint, TensorBoard
from tensorflow.keras.optimizers import Adam, RMSprop

from src.image_handling import decode_record
from src.utils import Spot

processed = join('data', 'processed')

features = {
    'image': tf.io.FixedLenFeature([], tf.string),
    'label': tf.io.FixedLenFeature([], tf.int64),
}
shape = (32, 32, 1)

train_dataset = decode_record(join(processed, 'train.tfrecord'), features, shape)
validation_dataset = decode_record(join(processed, 'validation.tfrecord'), features, shape)
test_dataset = decode_record(join(processed, 'test.tfrecord'), features, shape)

model = models.Sequential()
model.add(layers.Conv2D(32, (2,2), activation='relu', padding='same', input_shape=(32, 32, 1)))
model.add(layers.Conv2D(64, (4,4), activation='relu', padding='same'))
model.add(layers.MaxPooling2D(4,4))
model.add(layers.Flatten())
model.add(layers.Dense(3, 'softmax'))

optimizer = Adam()# RMSprop(lr=0.001)
model.compile(loss='sparse_categorical_crossentropy', optimizer=optimizer, metrics=['acc'])

print(model.summary())

log_dir=join('logs', 'srp_symbol_detector', datetime.now().strftime("%Y-%m-%dT%H-%M-%S"))
model_path = join('models', 'symbol_classifier','symbol_classifier.h5')

callbacks = [
    TensorBoard(log_dir=log_dir, histogram_freq=1, embeddings_freq=1),
    ModelCheckpoint(model_path, save_best_only=True) ]

history = model.fit_generator(
    train_dataset,
    steps_per_epoch=100,
    validation_data=validation_dataset,
    validation_steps=30,
    epochs=60,
    callbacks=callbacks)

with Spot('auth.json') as spot:
    spot.message('Saved model to disk (' + model_path + ')')

# 0.963
# model = models.Sequential()
# model.add(layers.Conv2D(32, (4,4), activation='relu', input_shape=(32, 32, 1)))
# model.add(layers.Dropout(0.5))
# model.add(layers.Conv2D(32, (4,4), activation='relu'))
# model.add(layers.MaxPooling2D(2, 2))
# model.add(layers.Flatten())
# model.add(layers.Dense(64, activation='relu'))
# model.add(layers.Dropout(0.3))
# model.add(layers.Dense(3, 'softmax'))
