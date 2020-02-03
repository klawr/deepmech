"""
In this script raw data is used to create images with randomly placed nodes.
The nodes have a minimum gap between them and a config.json is generated storing
their x and y coordinates (and label + b, h for possible yolo trials...).

This is an interim step. The next step is to connect randomly selected nodes
with constraints.
"""

import cv2
import json
import numpy as np
from os import path, listdir
from tqdm import tqdm

raw = path.join('data', 'iftomm_dach_raw_02')
interim = path.join('data', 'iftomm_dach_interim_021')

# TODO change this
image_width = 360
image_height = 360

data_list = []

num_examples = 10000

for image_idx in tqdm(range(num_examples)):
    name = str(image_idx) + '.png'
    image_data = {
        'image_path': path.join(interim, name),
        'nodes': []
    }
    image = np.zeros((image_height, image_width), np.uint8)
    # Pick random nodes and assign coordinates:
    num_nodes = int(np.random.uniform(3, 6))
    for node_idx in range(num_nodes):
        label = np.random.choice(['o', 'x'])

        node_dir = path.join(raw, label)
        node_path = path.join(node_dir, np.random.choice(listdir(node_dir)))

        # Give the noed a 50/50 chance to be a "mec" symbol
        if np.random.choice([True, False]):
            node_dir = path.join(raw, 'mec')
            if label == 'o':
                node_path = path.join(node_dir, np.random.choice(['0.png', '1.png']))
            else: # label == 'x'
                node_path = path.join(node_dir, np.random.choice(['2.png', '3.png']))

        # Set x and y so that they do not collide with other nodes:
        x = None
        y = None
        def check_collision(x, y, node_list):
            for node in node_list:
                if abs(x - node['x']) <= 60 and abs(y - node['y']) <= 60:
                    return False
            return True

        while True:
            x = int(np.random.uniform(16, image_width-16))
            y = int(np.random.uniform(16, image_height-16))
            if check_collision(x, y, image_data['nodes']):
                break

        node_image = cv2.imread(node_path, cv2.IMREAD_GRAYSCALE)
        node_image = cv2.resize(node_image, (32, 32))
    
        # Scale the image to be smaller if we work with 'mec'
        if node_dir == path.join(raw, 'mec'):
            scale = np.random.uniform(0.5, 1)
            M = np.float32([[scale, 0, 0],[0, scale, 0]])
            node_image = cv2.warpAffine(node_image, M, node_image.shape)

        # Flip and rotate images pseudo randomly:
        if np.random.choice([True, False]):
            node_image = cv2.flip(node_image, 0)
        if np.random.choice([True, False]):
            node_image = cv2.flip(node_image, 1)
        M = cv2.getRotationMatrix2D((16, 16), np.random.uniform(0, 360), 1)
        node_image = cv2.warpAffine(node_image, M, node_image.shape)

        image[y-16:y+16, x-16:x+16] = node_image

        cv2.imwrite(image_data['image_path'], image)

        image_data['nodes'].append({
            'node_path': node_path,
            'label': label,
            'x': x,
            'y': y,
            'b': 32,
            'h': 32
        })
    data_list.append(image_data)

with open(path.join(interim, 'config.json'), 'w') as config:
    json.dump(data_list, config)
