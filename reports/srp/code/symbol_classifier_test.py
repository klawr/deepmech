from os.path import join

import cv2
import numpy as np
from numpy.random import uniform
from sys import exit
import tensorflow as tf

model_path = join('models', 'symbol_classifier.h5')
model = tf.keras.models.load_model(model_path)

path = join('data', 'raw', 'n', '1.jpeg')

image_name = "data"
drawing = False
pt1_x , pt1_y = None , None
img = None
color = None
thickness = None

def draw(event, x, y, r1, r2):
    global pt1_x, pt1_y, drawing, img, color
    if event==cv2.EVENT_LBUTTONDOWN:
        drawing=True
        pt1_x,pt1_y=x,y
    elif event==cv2.EVENT_LBUTTONUP:
        drawing=False
        cv2.line(img,(pt1_x,pt1_y),(x,y),color=color,thickness=thickness)
    elif event==cv2.EVENT_MOUSEMOVE:
        if drawing==True:
            cv2.line(img,(pt1_x,pt1_y),(x,y),color=color,thickness=thickness)
            pt1_x,pt1_y=x,y
    elif event==cv2.EVENT_RBUTTONUP:
        image =  tf.convert_to_tensor(np.asarray(img, np.uint8), np.uint8)
        tensor = tf.io.encode_jpeg(image)
        print(predict(tensor))
        new_image()
    elif event==cv2.EVENT_MBUTTONUP:
        new_image()

def new_image():
    global img, color, thickness
    w_on_b = round(uniform())
    thickness = 5 + round(uniform(0, 255))
    img = np.ones((512,512,3), np.uint8)
    img *= round(uniform(0, 255))
    color = (255,255,255) if w_on_b else (0,0,0)

def predict(image):
    label = ['n', 'o', 'x']
    blob = tf.io.decode_jpeg(image, channels=1)
    blob = tf.image.convert_image_dtype(blob, tf.float32)
    blob = tf.image.resize(blob, (32, 32))
    blob = tf.reshape(blob, (1, 32, 32, 1))
    pred = list(model.predict(blob, steps = 1)[0])
    index = pred.index(max(pred))

    return label[index]

new_image()
cv2.namedWindow(image_name)
cv2.setMouseCallback(image_name, draw)

while(1):
    cv2.imshow(image_name, img)
    if cv2.waitKey(1)&0xFF==27:
        break
cv2.destroyAllWindows()
