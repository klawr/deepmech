
import os # TensorFlow prints a lot...
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

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
# TODO This is ugly
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
    max_idx = tf.math.argmax(squeeze, 2)
    max_val = tf.math.reduce_max(squeeze, 2)

    x_idx = tf.subtract(max_idx, 1)
    x_idx = tf.math.maximum(x_idx, 1)
    o_idx = tf.subtract(max_idx, tf.multiply(x_idx, 2))

    def non_max_sup(idx):
        idx     = tf.where(idx)
        scores  = tf.gather_nd(max_val, idx)
        idx     = tf.multiply(idx, 4)
        boxes   = tf.concat((idx, tf.add(idx, 32)), 1)
        boxes   = tf.divide(boxes, 360)
        boxes   = tf.dtypes.cast(boxes, tf.float32)
        idx     = tf.image.non_max_suppression(boxes, scores, 99, iou_threshold = 0.01)
        boxes   = tf.gather(boxes, idx)

        return tf.expand_dims(boxes, axis = 0)

    o_boxes = non_max_sup(o_idx)
    x_boxes = non_max_sup(x_idx)

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

