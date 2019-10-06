import cv2
import numpy as np
from numpy.random import rand
from sys import exit
from os import listdir, mkdir
from os.path import join, exists, dirname, abspath

target = input('Select target ("x" for base, "o" for link, "n" for non hits)   ').lower()
if target != "x" and target != "o" and target != "n":
    exit("Bad input")
src_path = abspath(dirname(__file__))
dir = join(src_path, '..', '..', 'data', 'raw', target)
if not exists(dir):
    mkdir(dir)

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
        itr = str(len(listdir(dir)))
        cv2.imwrite(join(dir, itr + '.jpeg'), img)
        print(itr)
        new_image()
    elif event==cv2.EVENT_MBUTTONUP:
        new_image()

def new_image():
    global img, color, thickness
    w_on_b = round(np.random.rand())
    thickness = 5 + (round(rand() * 95))
    img = np.ones((512,512,3), np.uint8)
    img *= round(rand() * 255)
    color = (255,255,255) if w_on_b else (0,0,0)

new_image()
cv2.namedWindow(image_name)
cv2.setMouseCallback(image_name, draw)

while(1):
    cv2.imshow(image_name, img)
    if cv2.waitKey(1)&0xFF==27:
        break
cv2.destroyAllWindows()