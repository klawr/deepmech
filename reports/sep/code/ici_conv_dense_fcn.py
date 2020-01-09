
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'    # stop a lot of printing...

from os import path
import tensorflow as tf
import cv2

img_path = path.join('data', 'sep_interim_01', '20.png')
img = tf.io.read_file(img_path)
img = tf.image.decode_jpeg(img, channels=1)
blob = tf.image.convert_image_dtype(img, tf.float32)
blob = tf.image.resize(blob, (360, 360))
blob = tf.expand_dims(blob, axis = 0)

old_model_path = path.join('models', 'symbol_classifier', 'model.h5')
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
new_shape = (f_dim[1], f_dim[2], f_dim[3], out_dim)
new_W = W.reshape(new_shape)
m = tf.keras.layers.Conv2D(out_dim,
                           (f_dim[1], f_dim[2]),
                           name = dense.name,
                           strides = (1, 1),
                           activation = dense.activation,
                           padding = 'valid',
                           weights = [new_W, b])(m)

def get_bounding_boxes(pred):
    max_index = tf.math.argmax(pred, 3)
    max_value = tf.math.reduce_max(pred, 3)
    shape = (pred.shape[1] or 0, pred.shape[2] or 0)
    max_index = tf.reshape(max_index, shape)

    x_indices = tf.subtract(max_index, 1)
    x_indices = tf.math.maximum(x_indices, 0)

    o_indices = tf.subtract(max_index, tf.multiply(x_indices, 2))

    # TODO check if batchwise is cool
    max_value = tf.reshape(max_value, shape)

    def non_max_sup(indices):
        indices = tf.where(indices)
        scores = tf.gather_nd(max_value, indices)
        indices = tf.multiply(indices, 4)
        boxes = tf.concat((indices, tf.add(indices, 32)), 1)
        boxes = tf.divide(boxes, 360)
        boxes = tf.dtypes.cast(boxes, tf.float32)
        final_indices = tf.image.non_max_suppression(boxes, scores, 99, iou_threshold = 0.01)
        boxes = tf.gather(boxes, final_indices)

        return tf.expand_dims(boxes, axis = 0)

    o_boxes = non_max_sup(o_indices)
    x_boxes = non_max_sup(x_indices)

    return o_boxes, x_boxes

prediction = tf.keras.layers.Lambda(get_bounding_boxes)(m)
model = tf.keras.Model(inputs = inputs, outputs = prediction)

o_boxes, x_boxes = model(blob)

o_color = tf.convert_to_tensor([[0, 0, 1]], dtype=tf.float32)
x_color = tf.convert_to_tensor([[0, 1, 0]], dtype=tf.float32)

blob = tf.image.grayscale_to_rgb(blob)
blob = tf.image.draw_bounding_boxes(blob, o_boxes, o_color)
blob = tf.image.draw_bounding_boxes(blob, x_boxes, x_color)[0]
blob *= 255

cv2.imwrite('/home/me/safehaven/synced/input.png', img.numpy())
cv2.imwrite('/home/me/safehaven/synced/boxed.png', blob.numpy())

