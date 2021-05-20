import tensorflow as tf

from os import path
import cv2

model = tf.keras.models.load_model("model.h5")


img = tf.io.read_file("image.png")
img = tf.image.decode_png(img, 1)
img = tf.reshape(img, (1, img.shape[0], img.shape[1], 1))

i = model.predict(img)
i = tf.image.resize(i, (480, 480))
i = tf.squeeze(i)

cv2.imshow("tensor", i.numpy())
cv2.waitKey(0)

print("Closing...")
cv2.destroyAllWindows()
