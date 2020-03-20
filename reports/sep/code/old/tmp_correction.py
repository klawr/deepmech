import cv2
import json
import numpy as np
from os import path, listdir
from tqdm import tqdm

interim = path.join('data', 'sep_interim_03')

image_width = 360
image_height = 360

data_list = []

with open(path.join(interim, 'config.json')) as config:
    data_list = json.load(config)

    for image in tqdm(data_list):
        for c in image['constraints']:
            a = c['x1']
            b = c['y1']
            c['x1'] = c['x2']
            c['y1'] = c['y2']
            c['x2'] = a
            c['y2'] = b
        
with open(path.join(interim, 'config.json'), 'w') as config:
    json.dump(data_list, config)