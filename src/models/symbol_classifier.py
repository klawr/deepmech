import sys
sys.path.append('.')

from datetime import datetime
from os.path import join
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import ModelCheckpoint, TensorBoard
from tensorflow.keras.optimizers import Adam

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
model.add(layers.Conv2D(16, (4,4), activation='relu', padding='same', input_shape=(32, 32, 1)))
model.add(layers.MaxPooling2D(2,2))
model.add(layers.Conv2D(32, (4,4), activation='relu', padding='same'))
model.add(layers.MaxPooling2D(2,2))
model.add(layers.Flatten())
model.add(layers.Dense(3, 'softmax'))

optimizer = Adam()
model.compile(loss='sparse_categorical_crossentropy', optimizer=optimizer, metrics=['acc'])

print(model.summary())

log_dir=join('logs', 'srp_symbol_detector', datetime.now().strftime("%Y-%m-%dT%H-%M-%S"))
model_path = join('models', 'symbol_classifier', 'model.h5')

callbacks = [
    # TensorBoard(log_dir=log_dir, histogram_freq=1, embeddings_freq=1),
    ModelCheckpoint(model_path, save_best_only=True) ]

history = model.fit(
    train_dataset,
    steps_per_epoch=100,
    validation_data=validation_dataset,
    validation_steps=30,
    epochs=60,
    callbacks=callbacks)

with Spot('auth.json') as spot:
    spot.message('Saved model to disk (' + model_path + ')')
    spot.message(model.evaluate(test_dataset, steps=100))

# summary:
# _________________________________________________________________
# Layer (type)                 Output Shape              Param #
# =================================================================
# conv2d (Conv2D)              (None, 32, 32, 16)        272
# _________________________________________________________________
# max_pooling2d (MaxPooling2D) (None, 16, 16, 16)        0
# _________________________________________________________________
# conv2d_1 (Conv2D)            (None, 16, 16, 32)        8224
# _________________________________________________________________
# max_pooling2d_1 (MaxPooling2 (None, 8, 8, 32)          0
# _________________________________________________________________
# flatten (Flatten)            (None, 2048)              0
# _________________________________________________________________
# dense (Dense)                (None, 3)                 6147
# =================================================================
# Total params: 14,643
# Trainable params: 14,643
# Non-trainable params: 0
# _________________________________________________________________

# Messages sent by spot:
# Saved model to disk (models\symbol_classifier\model.h5)
# [0.04019339963328093, 0.9934375]
