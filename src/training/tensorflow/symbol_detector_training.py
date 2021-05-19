from os import path

import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.optimizers import Adam

from tqdm import tqdm
from spot import Spot

import json

print("Finished imports...")

root = path.join("tensorflow", "data", "iftomm_dach_interim_01")

x = []
y = []

with open(path.join(root, "config.json")) as file:
    data = json.load(file)
    for example in tqdm(data):
        img = tf.io.read_file(path.join("tensorflow", example["image_path"]))
        img = tf.image.decode_png(img, channels=1)
        x.append(img)
        label = [int(x == example["label"]) for x in ["n", "o", "x"]]
        label = tf.convert_to_tensor(label)
        label = tf.reshape(label, (1, 1, 3))
        y.append(label)

x = tf.convert_to_tensor(x)
y = tf.convert_to_tensor(y)


input = layers.Input(shape=(None, None, 1))

m = layers.Conv2D(16, (4, 4))(input)
# m = layers.Dropout(0.2)(m)
# m = layers.BatchNormalization()(m)
m = layers.ReLU()(m)

m = layers.MaxPooling2D()(m)

m = layers.Conv2D(32, (4, 4))(m)
# m = layers.Dropout(0.2)(m)
# m = layers.BatchNormalization()(m)
m = layers.ReLU()(m)

m = layers.MaxPooling2D()(m)
m = layers.Conv2D(3, (5, 5))(m)

output = layers.Softmax()(m)

model = tf.keras.Model(inputs=input, outputs=output)

model.compile(loss="categorical_crossentropy", optimizer=Adam(), metrics=["acc"])

print(model.summary())

history = model.fit(
    x=x,
    y=y,
    batch_size=32,
    epochs=25,
    steps_per_epoch=100,
    validation_split=0.2,
)

model_path = path.join("tensorflow", "model.h5")
model.save(model_path)

with Spot("tensorflow/spot.json") as spot:
    spot.message("Saved model to disk (" + model_path + ")")
