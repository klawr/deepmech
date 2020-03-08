"""
This script is used to create training data for the student research project.
On starting it the user is presented with a prompt, asking whether to draw
base-nodes, nodes or neither of them (random stuff).

The user can then start to draw images onto the canvas, which are saved to
the respective directory in "data/raw/{n, o, x}".

This script has to be started from the root folder of the deepmech-project
for the script to detect the respective target directories correctly.

Cancel the script by pressing "escape" in the drawing context
or "ctrl+c" in the terminal.
"""

import cv2
import numpy as np
import os

target = input('Select target ("x" for base, "o" for node, "n" for non hits)   ').lower()
if target != "x" and target != "o" and target != "n":
    from sys import exit
    exit("Bad input")

target_dir = os.path.join('data', 'raw', target)
os.makedirs(target_dir, exist_ok=True)


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
        itr = str(len(os.listdir(target_dir)))
        cv2.imwrite(os.path.join(target_dir, itr + '.jpeg'), img)
        print(itr)
        new_image()
    elif event==cv2.EVENT_MBUTTONUP:
        new_image()

def new_image():
    global img, color, thickness
    w_on_b = round(np.random.uniform())
    thickness = 5 + round(np.random.uniform(0, 255))
    img = np.ones((512,512,3), np.uint8)
    img *= round(np.random.uniform(0, 255))
    color = (255,255,255) if w_on_b else (0,0,0)

new_image()
cv2.namedWindow(image_name)
cv2.setMouseCallback(image_name, draw)

while(1):
    cv2.imshow(image_name, img)
    if cv2.waitKey(1)&0xFF==27:
        break
cv2.destroyAllWindows()