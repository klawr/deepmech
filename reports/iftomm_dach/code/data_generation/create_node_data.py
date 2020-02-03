
"""
raw data consists of symbols of "nothing", nodes or bases (n, o, x).
mec is added through mec2 images which should be classified as "n",
because they are obviously detected already.
"""

import cv2
import json
import numpy as np
from os import path, listdir
from tqdm import tqdm

raw = path.join('data', 'iftomm_dach_raw_01')
interim = path.join('data', 'iftomm_dach_interim_01')

data_list = []
num_examples = 100000
output_shape = (32, 32)

for image_idx in tqdm(range(num_examples)):
    pre_label = np.random.choice(['n', 'mec', 'o', 'x'])
    src_dir = path.join(raw, pre_label)
    node_path = path.join(src_dir, np.random.choice(listdir(src_dir)))
    node_image = cv2.imread(node_path, cv2.IMREAD_GRAYSCALE)
    node_image = cv2.resize(node_image, (output_shape), interpolation=cv2.INTER_AREA)

    # Flip and rotate image randomly
    if np.random.choice([True, False]):
        node_image = cv2.flip(node_image, 0)
    if np.random.choice([True, False]):
        node_image = cv2.flip(node_image, 1)
    M = cv2.getRotationMatrix2D((16, 16), np.random.uniform(0, 360), 1)
    node_image = cv2.warpAffine(node_image, M, node_image.shape)

    """
    The mec raw data consists of very few images.
    Therefore the image is a bit scaled and translated.
    """
    if pre_label == 'mec':
        scale = np.random.uniform(0.75, 1.5)
        x_shift = round(np.random.uniform(-16, 16))
        y_shift = round(np.random.uniform(-16, 16))
        M = np.float32([[scale, 0, x_shift],[0, scale, y_shift]])
        node_image = cv2.warpAffine(node_image, M, node_image.shape)
    
    label = pre_label
    if pre_label == 'mec':
        label = 'n'

    image_path = path.join(interim, str(image_idx) + '.png')

    node_data = {
        'image_path': image_path,
        'label': label
    }
    cv2.imwrite(node_data['image_path'], node_image)
    data_list.append(node_data)

with open(path.join(interim, 'config.json'), 'w') as config:
    json.dump(data_list, config)
