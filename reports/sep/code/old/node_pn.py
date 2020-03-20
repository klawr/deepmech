
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import tensorflow as tf
from os import path
from datetime import datetime

feature_description = {
    'image': tf.io.FixedLenFeature([], tf.string),
}
for idx in range(7):
    feature_description['node' + str(idx)] = tf.io.FixedLenFeature(
        [5], tf.int64, default_value=[0,0,0,0,0])

shuffle_buffer_size = 1000
batch_size=32

record_path = path.join('data', 'sep_processed_03', 'train.tfrecord')

def decode(example):
    feature = tf.io.parse_single_example(example, feature_description)
    image = tf.io.parse_tensor(feature['image'], tf.float32)
    image.set_shape((360, 360,1))

    def intersection(box1, box2):
        x1 = tf.maximum(box1[0], box2[0])
        y1 = tf.maximum(box1[1], box2[1])
        x2 = tf.minimum(box1[2], box2[2])
        y2 = tf.minimum(box1[3], box2[3])

        return tf.maximum((x2 - x1) * (y2 - y1), 0)

    def union(box1, box2):
        a1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
        a2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
        return a1 + a2 - intersection(box1, box2)

    def IoU(box1, box2):
        return intersection(box1, box2) / union(box1, box2)

    indices = []
    x = []
    y = []
    width = []
    height = []
    probability = []
    base = []
    node = []

    for key in feature_description:
        if 'node' not in key:
            continue

        f = feature[key] # label, x, y, b, h
        cell = tf.divide(tf.stack((f[1], f[2]), axis=-1), 36)
        idx = tf.floor(cell)

        indices.append(tf.cast(idx, tf.int64))

        _x, _y = tf.split(cell - idx, 2, axis=-1)
        x.append(tf.squeeze(_x))
        y.append(tf.squeeze(_y))

        b, h = tf.split(tf.divide(tf.stack((f[3], f[4]), axis=-1), 360), 2, axis=-1)
        width.append(tf.squeeze(b))
        height.append(tf.squeeze(h))

        box1 = tf.concat((cell-tf.concat((b/2,h/2),0),cell+tf.concat((b/2,h/2),0)),0)
        box2 = tf.concat((idx, idx + 1), axis = 0)
        probability.append(IoU(box1, box2))

        c = tf.reshape(tf.sparse.to_dense(tf.SparseTensor([[f[0], 0]], [1], [2, 1])), [2])
        _base, _node = tf.split(tf.cast(c, tf.float64), 2, axis=-1)
        base.append(tf.squeeze(_base))
        node.append(tf.squeeze(_node))

    def list_to_conv(l, indices, num):
        l = tf.slice(l, [0], [num])
        l = tf.SparseTensor(indices, l, (10, 10))
        l = tf.sparse.reorder(l)
        return tf.sparse.to_dense(l)

    num = tf.math.count_nonzero(width)
    indices = tf.slice(indices, [0,0], [num,2])

    lists = [x, y, width, height, probability, base, node]
    label = tf.stack([list_to_conv(l, indices, num) for l in lists], axis=-1)
    return [image, label]

def take_data(record, num):
    return (tf.data.TFRecordDataset(record)
            .take(num)
            .map(decode, num_parallel_calls=tf.data.experimental.AUTOTUNE)
            #.cache()
            .shuffle(shuffle_buffer_size)
            .repeat()
            .batch(batch_size)
            .prefetch(buffer_size=tf.data.experimental.AUTOTUNE))

train = take_data(record_path, 80000)
validation = take_data(record_path, -20000)

inputs = tf.keras.Input(shape=(360, 360, 1)) # 360 => 180 => 90 => 30 => 10
m = tf.keras.layers.Conv2D(32, (3,3), (1,1), padding='same', activation='relu')(inputs)
m = tf.keras.layers.Conv2D(64, (3,3), (2,2), padding='same', activation='relu')(inputs)
m = tf.keras.layers.BatchNormalization(momentum=0.9,epsilon=1e-05)(m)
m = tf.keras.layers.Conv2D(32, (1,1), (1,1), padding='same', activation='relu')(m)
m = tf.keras.layers.Conv2D(64, (3,3), (1,1), padding='same', activation='relu')(m)
m = tf.keras.layers.Conv2D(128, (3,3), (2,2), padding='same', activation='relu')(m)
m = tf.keras.layers.BatchNormalization(momentum=0.9,epsilon=1e-05)(m)
m = tf.keras.layers.Conv2D(64, (1,1), (1,1), padding='same', activation='relu')(m)
m = tf.keras.layers.Conv2D(128, (3,3), (1,1), padding='same', activation='relu')(m)
m = tf.keras.layers.Conv2D(256, (3,3), (3,3), padding='same', activation='relu')(m)
m = tf.keras.layers.BatchNormalization(momentum=0.9,epsilon=1e-05)(m)
m = tf.keras.layers.Conv2D(128, (1,1), (1,1), padding='same', activation='relu')(m)
m = tf.keras.layers.Conv2D(256, (3,3), (1,1), padding='same', activation='relu')(m)
m = tf.keras.layers.Conv2D(512, (3,3), (3,3), padding='same', activation='relu')(m)
m = tf.keras.layers.BatchNormalization(momentum=0.9,epsilon=1e-05)(m)
m = tf.keras.layers.Conv2D(256, (1,1), (1,1), padding='same', activation='relu')(m)
m = tf.keras.layers.Conv2D(512, (3,3), (1,1), padding='same', activation='relu')(m)
m = tf.keras.layers.Conv2D(1024, (3,3), (1,1), padding='same', activation='relu')(m)
m = tf.keras.layers.BatchNormalization(momentum=0.9,epsilon=1e-05)(m)
outputs = tf.keras.layers.Conv2D(7, (10, 10), padding='same', activation='sigmoid')(m)

model = tf.keras.Model(inputs = inputs, outputs = outputs)

log_dir = path.join('logs', 'sep_nodepn', datetime.now().strftime("%Y-%m-%dT%H-%M-%S"))
model_path = path.join('models', 'devel', 'sep_nodepn.h5')

callbacks = [
    tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1, embeddings_freq=1),
    tf.keras.callbacks.ModelCheckpoint(model_path, save_best_only=True) ]

model.compile(loss      = 'mse',
              optimizer = tf.keras.optimizers.Adam(),
              metrics   = ['acc'])

history = model.fit(
    train,
    steps_per_epoch = 100,
    epochs          = 10,
    validation_data = validation,
    validation_steps= 50,
    callbacks = callbacks)

model = tf.keras.models.load_model(model_path)

def get_bounding_boxes(pred):
    pred = tf.cast(tf.squeeze(pred),tf.float64)
    # [x, y, width, height, probability, base, node]
    lists = tf.split(pred, 7, axis=-1)
    indices = tf.where(tf.maximum(lists[4], 0))
    num = indices.shape[0]
    lists = [tf.gather_nd(l, indices) for l in lists]
    indices = tf.concat((indices, tf.zeros((num,4),dtype=tf.int64)), axis = -1)
    results = tf.cast(indices, tf.float64) + tf.transpose(tf.stack(lists, axis=0))
    resize = tf.broadcast_to([36, 36, 360, 360, 1, 1, 1], [num, 7])
    resize = tf.cast(resize, tf.float64)

    results = results * resize

    def bounding(result):
        y1 = result[1] - (result[3] / 2)
        x1 = result[0] - (result[2] / 2)
        y2 = result[1] + (result[3] / 2)
        x2 = result[0] + (result[2] / 2)

        return tf.stack((y1, x1, y2, x2), axis=0) / 360

    squeeze_where = lambda t: tf.squeeze(tf.where(t))
    map_gather = lambda r, i: tf.map_fn(bounding, tf.gather(r, squeeze_where(i)))

    idx = tf.argmax(tf.slice(results, (0,5), (num,2)), axis=-1)
    bases = map_gather(results, idx)
    idx = tf.abs(idx - 1)
    nodes = map_gather(results, idx)
    return bases, nodes

img_path= path.join('data', 'sep_interim_02', '20.png')
img     = tf.io.read_file(img_path)
img     = tf.image.decode_jpeg(img, channels=1)
blob    = tf.image.convert_image_dtype(img, tf.float32)
blob    = tf.image.resize(blob, (360, 360))

# test = (tf.data.TFRecordDataset(record_path).take(1).map(decode))
# blob, pred = next(iter(test))

import cv2

cv2.imshow('test', blob.numpy())
cv2.waitKey(0)
cv2.destroyAllWindows()

blob = tf.expand_dims(blob, axis = 0)

import time

start = time.time()
pred = model(blob)
end = time.time()
print(end -  start)
bases, nodes = get_bounding_boxes(pred)


blob = tf.image.grayscale_to_rgb(blob)
blob = tf.image.draw_bounding_boxes(blob, [bases], [[1.,0.,0.]])
blob = tf.image.draw_bounding_boxes(blob, [nodes], [[0.,1.,0.]])[0]
blob *= 255
cv2.imshow('test', blob.numpy())
cv2.waitKey(0)
cv2.destroyAllWindows()

