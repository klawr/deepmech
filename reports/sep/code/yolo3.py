
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import tensorflow as tf
from os import path
from datetime import datetime

feature_description = {
    'image': tf.io.FixedLenFeature([], tf.string),
}
# 26 is the max number of nodes + constraints in the dataset.
for idx in range(26):
    feature_description['box' + str(idx)] = tf.io.FixedLenFeature(
        [5], tf.int64, default_value=[0,0,0,0,0])

shuffle_buffer_size = 1000
batch_size=32

record_path = path.join('data', 'sep_processed_02', 'train.tfrecord')

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
    d1 = []
    d2 = []
    probability = []
    base = []
    node = []
    rot = []
    trans = []

    for key in feature_description:
        if 'box' not in key:
            continue
        f = feature[key] # label, x, y, b, h OR label x, y, l, w
        # Get the x, y in the image * 36
        cell = tf.divide(tf.stack((f[1], f[2]), axis=-1), 36)
        idx = tf.floor(cell)

        # Add the location of the respecitve cell
        indices.append(tf.cast(idx, tf.int64))

        # Add cell normalized value as coordinates
        _x, _y = tf.split(cell - idx, 2, axis=-1)
        x.append(tf.squeeze(_x))
        y.append(tf.squeeze(_y))

        def is_node():
            f3 = tf.cast(tf.divide(f[3], 36), tf.float64)
            f4 = tf.cast(tf.divide(f[4], 36), tf.float64)
            return f3, f4

        def is_constraint():
            f4 = tf.cast(f[4], tf.float32) * tf.acos(0.) / 90
            b = tf.abs(tf.cast(tf.cast(f[3], tf.float32) * tf.cos(f4) / 36, tf.float64))
            h = tf.abs(tf.cast(tf.cast(f[3], tf.float32) * tf.sin(f4) / 36, tf.float64))
            return b, h

        b, h = tf.cond(f[0] < 2, is_node, is_constraint)
        d1.append(b)
        d2.append(h)

        # Add objectness score
        box1 = tf.concat((cell - (b / 2, h / 2), cell + (b / 2, h / 2)), axis = 0)
        box2 = tf.concat((idx, idx + 1), axis = 0)
        probability.append(IoU(box1, box2))

        c = tf.reshape(tf.sparse.to_dense(tf.SparseTensor([[f[0],0]],[1],[4,1])),[4])
        _base, _node, _rot, _trans = tf.split(tf.cast(c, tf.float64), 4, axis=-1)
        base.append(tf.squeeze(_base))
        node.append(tf.squeeze(_node))
        rot.append(tf.squeeze(_rot))
        trans.append(tf.squeeze(_trans))

    def list_to_conv(l, indices, num):
        l = tf.slice(l, [0], [num])
        l = tf.SparseTensor(indices, l, (10, 10))
        l = tf.sparse.reorder(l)
        std = tf.sparse.to_dense(l, validate_indices=False)
        return std

    num = tf.math.count_nonzero(d2)
    indices = tf.slice(indices, [0,0], [num,2])

    lists = [x, y, d1, d2, probability, base, node, rot, trans]
    conv = []
    for l in lists:
        conv.append(list_to_conv(l, indices, num))
    label = tf.stack(conv, axis=-1)

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
m = tf.keras.layers.Conv2D(16, (4,4), (2, 2), padding='same', activation='relu')(inputs)
m = tf.keras.layers.BatchNormalization(momentum=0.9,epsilon=1e-05)(m)
m = tf.keras.layers.Conv2D(16, (4,4), (2, 2), padding='same', activation='relu')(m)
m = tf.keras.layers.BatchNormalization(momentum=0.9,epsilon=1e-05)(m)
m = tf.keras.layers.Conv2D(16, (4,4), (3, 3), padding='same', activation='relu')(m)
m = tf.keras.layers.BatchNormalization(momentum=0.9,epsilon=1e-05)(m)
m = tf.keras.layers.Conv2D(16, (4,4), (3, 3), padding='same', activation='relu')(m)
m = tf.keras.layers.BatchNormalization(momentum=0.9,epsilon=1e-05)(m)
outputs = tf.keras.layers.Conv2D(9, (10, 10), padding='same', activation='sigmoid')(m)

model = tf.keras.Model(inputs = inputs, outputs = outputs)

log_dir = path.join('logs', 'sep_yolo3', datetime.now().strftime("%Y-%m-%dT%H-%M-%S"))
model_path = path.join('models', 'devel', 'sep_yolo3.h5')

callbacks = [
    tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1, embeddings_freq=1),
    tf.keras.callbacks.ModelCheckpoint(model_path, save_best_only=True) ]

model.compile(loss      = 'mse',
              optimizer = tf.keras.optimizers.Adam(),
              metrics   = ['acc'])
"""
history = model.fit(
    train,
    steps_per_epoch = 100,
    epochs          = 50,
    validation_data = validation,
    validation_steps= 50,
    callbacks = callbacks)
"""
model = tf.keras.models.load_model(model_path)

def get_bounding_boxes(pred):
    pred = tf.cast(tf.squeeze(pred),tf.float64)
    # [x, y, d1, d2, probability, base, node, rot, trans]
    lists = tf.split(pred, 9, axis=-1)
    indices = tf.where(tf.maximum(lists[4] - 0, 0)) # TODO - 0.5
    num = indices.shape[0]
    lists = [tf.gather_nd(l, indices) for l in lists]
    indices = tf.concat((indices, tf.zeros((num,6),dtype=tf.int64)), axis = -1)
    results = tf.cast(indices, tf.float64) + tf.transpose(tf.stack(lists, axis=0))
    resize = tf.broadcast_to([36, 36, 360, 360, 1, 1, 1, 1, 1], [num, 9])
    resize = tf.cast(resize, tf.float64)

    results = results * resize

    def bounding_box(result):
        b, h = result[2] / 2, result[3] / 2
        x1 = result[0] - b
        y1 = result[1] - h
        x2 = result[0] + b
        y2 = result[1] + h

        return tf.stack((y1, x1, y2, x2), axis = 0) / 360

    idx = tf.argmax(tf.slice(results, (0,5), (num,-1)), axis=-1)
    results = tf.gather(results, tf.argsort(idx))
    idx = tf.sort(idx)
    tmp = tf.RaggedTensor.from_value_rowids(results, idx)
    bases, nodes, rot, trans = tf.squeeze(tf.split(tmp.to_tensor(), 4))
    bases = tf.map_fn(bounding_box, bases)
    nodes = tf.map_fn(bounding_box, nodes)
    rot   = tf.map_fn(bounding_box, rot)
    trans = tf.map_fn(bounding_box, trans)

    print(bases * 360)

    return bases, nodes, rot,trans

# a = next(iter(take_data(record_path, 80000)))
# pred = decode(a)

img_path= path.join('data', 'sep_interim_02', '9.png')
img     = tf.io.read_file(img_path)
img     = tf.image.decode_jpeg(img, channels=1)
# img = pred[0]
blob    = tf.image.convert_image_dtype(img, tf.float32)
blob    = tf.image.resize(blob, (360, 360))

import cv2
"""
cv2.imshow('test', blob.numpy())
cv2.waitKey(0)
cv2.destroyAllWindows()
"""
blob = tf.expand_dims(blob, axis = 0)

import time

start = time.time()
pred = model(blob)
end = time.time()
print(end -  start)
bases, nodes, rot, trans = get_bounding_boxes(pred)
blob = tf.image.grayscale_to_rgb(blob)
# print(bases, nodes, rot, trans)
blob = tf.image.draw_bounding_boxes(blob, [bases], [[1.,0.,0.]])
blob = tf.image.draw_bounding_boxes(blob, [nodes], [[0.,1.,0.]])
blob = tf.image.draw_bounding_boxes(blob, [rot],   [[1.,1.,0.]])
blob = tf.image.draw_bounding_boxes(blob, [trans], [[0.,0.,1.]])[0]
blob *= 255

cv2.imshow('test', blob.numpy()[1:])
cv2.waitKey(0)
cv2.destroyAllWindows()
