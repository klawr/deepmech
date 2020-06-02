import cv2
import numpy as np
from numpy.random import uniform
from sys import exit
from os import listdir, mkdir
from os.path import join, exists, dirname, abspath

target = input('Select target ("r" for rotating, "t" for translating): ').lower()
if target != "r" and target != "t":
    exit("Bad input")
interval = input('Select one of the following ranges: (1: 150-249, 2: 250-349, 3: 350-449): ')
if interval != "1" and interval != "2" and interval != "3":
    exit("Bad input")
src_path = abspath(dirname(__file__))
directory = join(src_path, '..', '..', 'data', 'raw', target)
try:
    mkdir(directory)
except:
    pass

minimum = int(interval) * 100 + 50
maximum = int(interval) * 100 + 149

directory = join(directory, str(minimum) + '-' + str(maximum))
try:
    mkdir(directory)
except:
    pass

image_name = "data"
drawing = False
pt1_x , pt1_y = None , None
img = None
thickness = None

def draw(event, x, y, r1, r2):
    global pt1_x, pt1_y, drawing, img
    color = (255, 255, 255)
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
        itr = str(len(listdir(directory)))
        cv2.imwrite(join(directory, itr + '.png'), img)
        print(itr)
        new_image()
    elif event==cv2.EVENT_MBUTTONUP:
        new_image()

# draw white arrows on black background. ALWAYS

def new_image():
    global img, color, thickness
    thickness = 5 + round(uniform(0, 20))
    width = round(uniform(minimum, maximum))
    height = 100
    img = np.zeros((height,width,3), np.uint8)

new_image()
cv2.namedWindow(image_name)
cv2.setMouseCallback(image_name, draw)

while(1):
    cv2.imshow(image_name, img)
    if cv2.waitKey(1)&0xFF==27:
        break
cv2.destroyAllWindows()
