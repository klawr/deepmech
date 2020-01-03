from os.path import join

import tensorflow as tf
from tensorflow.keras import layers

path = join('reports', 'sep', 'code', 'reversed.jpg')
blob = tf.io.read_file(path)
blob = tf.image.decode_jpeg(blob, channels=1)
blob = tf.image.convert_image_dtype(blob, tf.float32)
print(blob.shape)
blob = tf.image.resize(blob, (231, 180))
blob = tf.expand_dims(blob, axis=0)

model_path = join('models', 'symbol_classifier', 'model.h5')
old_model = tf.keras.models.load_model(model_path)

input_shape = (231, 180, 1)

model = tf.keras.models.Sequential()
model.add(layers.Conv2D(1, (32, 32),
    padding='same',
    input_shape=input_shape,
    kernel_initializer='ones',
    trainable=False,
    use_bias=False))
# at this point the kernel segments the input image in our 32 by 32 images...
model.add(layers.Conv2D(16, (4,4), activation='relu', padding='same'))
model.add(layers.MaxPooling2D(2,2))
model.add(layers.Conv2D(32, (4,4), activation='relu', padding='same'))
model.add(layers.MaxPooling2D(2,2))
# here i should not flatten this thing...
model.add(layers.Flatten())
# model.add(layers.Reshape((-1, 1)))
# model.add(layers.Conv1D(1, 2048,
#     use_bias=False, kernel_initializer='ones'))
model.add(layers.Dense(3, 'softmax'))

model.summary()

# for idx in range(len(old_model.layers)):
    # old_weights = old_model.layers[idx].get_weights()
    # model.layers[idx+1].set_weights(old_weights)

# print(old_model.layers[0].get_weights())

model.layers[1].set_weights(old_model.layers[0].get_weights())
model.layers[2].set_weights(old_model.layers[1].get_weights())
model.layers[3].set_weights(old_model.layers[2].get_weights())
model.layers[4].set_weights(old_model.layers[3].get_weights())
model.layers[6].set_weights(old_model.layers[5].get_weights())

# print(list(model.predict(blob, steps=1)[0]))
