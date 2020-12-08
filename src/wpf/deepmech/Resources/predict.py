from os import path

import os
import json
import cv2
import tensorflow as tf

srcPath = path.join(os.getcwd(), "..", "..", "..", "Resources");

symbol_detector = tf.keras.models.load_model(
    path.join(srcPath, 'fcn_sym_det.h5'))
crop_detector = tf.keras.models.load_model(
    path.join(srcPath, 'crop_detector.h5'))

image = cv2.imread(path.join(os.environ["TEMP"], 'deepmechCanvas.png'),
    cv2.IMREAD_GRAYSCALE)

image_tensor = tf.convert_to_tensor(image)
image_tensor = tf.cast(image_tensor / 255, tf.float32)
image_tensor = tf.expand_dims(image_tensor, -1)
image_tensor = tf.expand_dims(image_tensor, 0)

def get_bounding_boxes_nms(predictions):
    max_idx = tf.math.argmax(tf.squeeze(predictions), -1)
    node_idx = tf.where(tf.equal(max_idx, 1))
    base_idx = tf.where(tf.equal(max_idx, 2))
    all_idx = tf.concat([node_idx, base_idx], 0)

    max_val = tf.math.reduce_max(tf.squeeze(predictions), -1)

    y, x = tf.split(all_idx * 4, 2, -1)

    coords = tf.squeeze(tf.stack([y, x, y + 32, x + 32], -1))

    all_boxes = tf.cast(coords / 360, tf.float32)

    scores = tf.gather_nd(max_val, all_idx)
    nms_idx = tf.image.non_max_suppression(
        all_boxes, scores, 99, tf.keras.backend.epsilon(), 0.8)

    limit = tf.cast(tf.math.count_nonzero(node_idx, 0)[0], tf.int32)
    mask = tf.less(nms_idx, limit)
    node_mask = tf.boolean_mask(nms_idx, mask)
    base_mask = tf.boolean_mask(nms_idx,~mask)

    node_boxes = tf.gather(all_boxes, node_mask)
    base_boxes = tf.gather(all_boxes, base_mask)
    return node_boxes, base_boxes


[nodes, bases] = get_bounding_boxes_nms(symbol_detector(image_tensor)[0])

elements = {"nodes":[], "constraints":[]}

def appendnode(node, base):
    elements["nodes"].append({
        "x": int((node[0] + node[2]) / 2 * image_tensor.shape[1]),
        "y": int((node[1] + node[3]) / 2 * image_tensor.shape[2]),
        "base": base,
    })


[appendnode(node, False) for node in nodes]
[appendnode(base, True) for base in bases]

print(json.dumps(elements))

# box_coords = []
# for box in [nodes, base_nodes]:
#     blob = tf.concat([box[0], box[1]], 0)
#     blob *= 360
#     blob = tf.cast(blob, tf.int32)
#     box_coords.append(
#         [[int((i[0]+i[2])/2),int((i[1]+i[3])/2)] for i in blob])

# crops = []
# crops_info = []
# for idx, coords in enumerate(box_coords):
#     image_crop = []
#     image_info = []
#     for node1 in coords:
#         for node2 in coords:
#             x1 = min(node1[1], node2[1])
#             y1 = min(node1[0], node2[0])
#             x2 = max(node1[1], node2[1])
#             y2 = max(node1[0], node2[0])
#             # Remove images with area 0
#             if x1 == x2 or y1 == y2:
#                 continue

#             crop = image[y1:y2, x1:x2]
#             crop = cv2.resize(crop, (96, 96))

#             if x1 == node2[1]:
#                 x1 = node1[1]
#                 x2 = node2[1]
#                 crop = cv2.flip(crop, 1)
#             if y1 == node2[0]:
#                 y1 = node1[0]
#                 y2 = node2[0]
#                 crop = cv2.flip(crop, 0)

#             crop = tf.expand_dims(crop, -1)
#             crop = tf.cast(crop / 255, tf.float32)

#             image_crop.append(crop)
#             image_info.append([x1, y1, x2, y2])

#     crops.append(image_crop)
#     crops_info.append(image_info)

# crop_pred = [crop_detector(tf.convert_to_tensor(crop)) for crop in crops]
# constraints = tf.math.argmax(crop_pred, -1)

# print(constraints)
