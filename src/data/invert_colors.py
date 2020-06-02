
import cv2
from os import path

directory = path.join('processed', 'x')
# rename o/1201.png to o/1004.png (bad data...)
# rename x/1204.png to x/647.png (bad data...)
def invert_image(basename):
    image_path = path.join(directory, basename) + '.png'
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    image = 255 - image
    cv2.imwrite(image_path, image)

while True:
    basename = input('Imagename: ')
    if basename == '':
        break
    invert_image(basename)


