"""
Add a variable input layer to the beginning.
The first four layers of the old model are convolutional layers and do not need
to be altered in any way.
After they are appended the shape of the flattened layer is determined,
which is then used to determine the shape of the only hidden dense layer.
The output layer is then a 3 dimensional tensor with "x" and "y" coordinates
of the predictions containing an array with the scores for the classes.

Then another layer is added. It takes these predictions as input, uses
non max suppression to remove overlaps and returns the coordinates of
all "nodes" and "bases" as bounding boxes.

The node size of the nodes has to be approx 32x32 to be detected!
"""

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from os import path
import tensorflow as tf

image_path = path.join('1.png')
blob = tf.io.read_file(image_path)
blob = tf.image.decode_jpeg(blob, channels=1)
blob = tf.image.convert_image_dtype(blob, tf.float32)
blob = tf.image.resize(blob, (231, 180))
blob = tf.expand_dims(blob, axis=0)

old_model_path = path.join('models', 'devel', 'iftomm_dach_node_detector.h5')
old_model = tf.keras.models.load_model(old_model_path)

inputs = tf.keras.Input(shape=(None, None, 1))
for index, layer in enumerate(old_model.layers[:4]):
    if index == 0:
        m = layer(inputs)
    else:
        m = layer(m)

# Get the input dimensions of the flattened layer:
f_dim = old_model.layers[4].input_shape
# And use it to convert the next dense layer:
dense = old_model.layers[5]
out_dim = dense.get_weights()[1].shape[0]
W, b = dense.get_weights()
new_W = W.reshape((f_dim[1], f_dim[2], f_dim[3], out_dim))
m = tf.keras.layers.Conv2D(out_dim,
                           (f_dim[1], f_dim[2]),
                           name = dense.name,
                           strides = (1, 1),
                           activation = dense.activation,
                           padding = 'valid',
                           weights = [new_W, b])(m)

def get_bounding_boxes(pred):
    # Only accept batch_size = 1 for now...
    squeeze = tf.squeeze(pred)
    # Transform arrays into values corresponding to max value
    max_idx = tf.math.argmax(squeeze, 2)
    # Get corresponding max value for scoring later on
    max_val = tf.math.reduce_max(squeeze, 2)


    idx = tf.where(max_idx)                 # Get all index values which do not correspond to 'n' ('n' has index 0)
    scores  = tf.gather_nd(max_val, idx)    # Get corresponding max value for scores
    print(scores)
    idx = tf.multiply(idx, 4)               # The model has a stride of 4

    # 32 is the trained image size (has to match in sketches later too!)
    boxes   = tf.concat((idx, tf.add(idx, 32)), 1)
    boxes   = tf.dtypes.cast(boxes, tf.float32)

    # Remove all indices of overlapping images (with ~0 tolerance)
    winner = tf.image.non_max_suppression(boxes, scores, 99, iou_threshold = tf.keras.backend.epsilon())
    winner_idx = tf.gather(idx, winner)

    def get_coords(label):
        _idx = tf.where(tf.math.equal(max_idx, label))  # Get indices of all 'nodes' and 'bases' (index 1 and 2 repsectively)
        _idx    = tf.multiply(_idx, 4)                  # The model has a stride of 4

        # Tensorflow has no intersection for 2-dimensional tensors... hacky solution:
        # https://stackoverflow.com/questions/50848323/intersection-between-two-tensors-of-different-lengths
        _match  = tf.reduce_sum(tf.abs(tf.expand_dims(_idx,0) - tf.expand_dims(winner_idx,1)),2)
        _idx    = tf.transpose(tf.where(tf.equal(_match, tf.zeros_like(_match))))[0]
        
        _winner = tf.gather(winner, _idx)
        _boxes  = tf.gather(boxes, _winner)

        a, b = tf.split(_boxes, 2, -1)
        coords = tf.divide(tf.add(a, b), 2)

        return coords

    o_coords = tf.cast(get_coords(1), tf.int32) # Coordinates of non_max_supped nodes (label == 1)
    x_coords = tf.cast(get_coords(2), tf.int32) # Coordinates of non_max_supped bases (label == 2)

    return o_coords, x_coords

prediction = tf.keras.layers.Lambda(get_bounding_boxes)(m)
model = tf.keras.Model(inputs = inputs, outputs = prediction)

print(model.summary())

model(blob)

# new_model_path = path.join('models', 'devel', 'iftomm_dach_node_detector_fcn.h5')
# model.save(new_model_path)
