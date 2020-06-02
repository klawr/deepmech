from os.path import join

import tensorflow as tf
import cv2

path = join('data', 'sep_interim_04', '0_0_3.png')
blob = tf.io.read_file(path)
blob = tf.image.decode_jpeg(blob, channels=1)
blob = tf.image.convert_image_dtype(blob, tf.float32)
blob = tf.image.resize_with_pad(blob, 360, 360)
blob = tf.expand_dims(blob, axis=0)

model_path = join('models', 'devel', 'sep_crop.h5')
model = tf.keras.models.load_model(model_path)

pred = model.predict(blob, steps=1)
print(pred)
cv2.imshow('test', tf.squeeze(blob).numpy())
cv2.waitKey(0)

