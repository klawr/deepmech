import tensorflowjs as tfjs
import tensorflow as tf

from os import path

model = tf.keras.models.load_model(path.join("tensorflow", "model.h5"))
tfjs.converters.save_keras_model(model, path.join("tensorflow", "tfjs"))
