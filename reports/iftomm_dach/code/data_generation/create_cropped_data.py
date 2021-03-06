"""
In this script interim data generated 'add_constaints_to_cd.py' is used
to create images with, or without a constraint between them.

For this the x1, y1, x2, y2 coordinates of the previous step are used.
The images are flipped to always go from the top left to the bottom right,
so the resulting model will be trained to detect those.
"""

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from datetime import datetime
import json
from os import path

import tensorflow as tf
from tqdm import tqdm

import cv2

data_list = []

raw = path.join('data', 'iftomm_dach_interim_022')
interim = path.join('data', 'iftomm_dach_interim_023')

with open(path.join(raw, 'config.json')) as config:
    config = json.load(config)
    for idx, image in enumerate(tqdm(config)):
        src = tf.io.read_file(image['image_path'])
        src = tf.image.decode_jpeg(src, channels=1)
        src = tf.image.convert_image_dtype(src, tf.float32)
        src = tf.image.resize(src, (360, 360))

        constraints = [[c['x1'], c['y1'], c['x2'], c['y2']] for c in image['constraints']]
        rspct_label = [c['label'] for c in image['constraints']]

        for jdx, node1 in enumerate(image['nodes']):
            for kdx, node2 in enumerate(image['nodes']):
                x1 = tf.minimum(node1['x'], node2['x'])
                y1 = tf.minimum(node1['y'], node2['y'])
                x2 = tf.maximum(node1['x'], node2['x'])
                y2 = tf.maximum(node1['y'], node2['y'])
                
                if abs(x2-x1) < 20 or abs(y2-y1) < 20:
                    continue

                crop = tf.image.crop_to_bounding_box(
                    src, y1, x1, y2-y1, x2-x1)


                # Let constraints always point from top-left => bot-right
                if x2 == node2['x']:
                    crop = tf.image.flip_left_right(crop)
                if y2 == node2['y']:
                    crop = tf.image.flip_up_down(crop)

                label = None
                comp = [node1['x'],node1['y'],node2['x'],node2['y']]
                if comp in constraints:
                    label = rspct_label[constraints.index(comp)]

                name = str(idx) + '_' + str(jdx) + '_' + str(kdx) + '.png'
                crop_path = path.join(interim, name)

                data_list.append({
                    'crop_path': crop_path,
                    'label': label
                })

                crop = tf.image.resize(crop, (96, 96))
                crop *= 255

                cv2.imwrite(crop_path, crop.numpy())

with open(path.join(interim, 'config.json'), 'w') as config:
    json.dump(data_list, config)
