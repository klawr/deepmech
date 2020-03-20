
import cv2
import json
import numpy as np
from os import path, listdir
from tqdm import tqdm

raw = path.join('data', 'sep_raw_02')
interim = path.join('data', 'sep_interim_03')
processed = path.join('data', 'sep_processed_03')

image_width = 360
image_height = 360

data_list = []

with open(path.join(raw, 'config.json')) as data_list:
    data_list = json.load(data_list)

    for image_idx, image_data in enumerate(tqdm(data_list)):
        nodes = image_data['nodes']
        image = cv2.imread(image_data['image_path'], cv2.IMREAD_GRAYSCALE)

        image_data['constraints'] = []

        dilemma = np.random.choice
        for i in range(len(nodes)):
           for j in range(i+1, len(nodes)):
                a = sum(range(len(nodes)))
                b = a / (len(nodes) - 1) * 2
                a = np.repeat(True, a - b)
                b = np.repeat(False, b)
                a = np.concatenate((a,b))
                if dilemma(a):
                    continue
                n1, n2 = nodes[i], nodes[j]

                dx = n1['x'] - n2['x']
                dy = n1['y'] - n2['y']
                w  = np.arctan2(dy,dx) * 180 / np.pi
                l  = np.hypot(dx, dy) - 50
                if l < 50 or l > 350:
                    continue

                x  = int(np.mean((n1['x'], n2['x'])))
                y  = int(np.mean((n1['y'], n2['y'])))

                label = dilemma(['r', 't'])
                directory = path.join(raw, label)

                # tmp = 2 if l >= 350 else 1 if l >= 250 else 0
                tmp = 2
                directory = path.join(directory, np.sort(listdir(directory))[tmp])

                constraint_path = path.join(directory, dilemma(listdir(directory)))
                c_img = cv2.imread(constraint_path, cv2.IMREAD_GRAYSCALE)
                shape = np.multiply(c_img.shape, l / c_img.shape[1])
                shape = tuple(map(int, np.divide(shape, 2)))
                shape = tuple(np.multiply(shape, 2))
                c_img = cv2.resize(c_img, shape[::-1])

                tmp = image.shape
                background = np.zeros(tmp, np.uint8)

                background[int((tmp[0]-shape[0])/2):int((tmp[0]+shape[0])/2),
                           int((tmp[1]-shape[1])/2):int((tmp[1]+shape[1])/2)] = c_img

                M = cv2.getRotationMatrix2D((int(tmp[0] / 2), int(tmp[1] / 2)), w, 1)
                c_img = cv2.warpAffine(background, M, background.shape)

                c_img = np.roll(c_img, int(x - tmp[0] / 2))
                c_img = np.roll(c_img, int(y - tmp[1] / 2), 0)

                image += c_img

                image_data['constraints'].append({
                    'constraint_path': constraint_path,
                    'label': label,
                    'x1': n1['x'],
                    'y1': n1['y'],
                    'x2': n2['x'],
                    'y2': n2['y']
                })

        name = str(image_idx) + '.png'
        image_data['image_path'] = path.join(interim, name)
        cv2.imwrite(image_data['image_path'], image)

with open(path.join(interim, 'config.json'), 'w') as config:
    json.dump(data_list, config)
