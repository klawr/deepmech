
from os import path
import tensorflow as tf
import cv2

# TODO maybe this image to tensor thing should be a util...

img_path = path.join('data', 'sep_interim_01', '1.png')
blob = tf.io.read_file(img_path)
blob = tf.image.decode_jpeg(blob, channels=1)
blob = tf.image.convert_image_dtype(blob, tf.float32)
blob = tf.image.resize(blob, (360, 360))
blob = tf.expand_dims(blob, axis = 0)

# Load old model
old_model_path = path.join('models', 'symbol_classifier', 'model.h5')
old_model = tf.keras.models.load_model(old_model_path)

# Create new model to build on...
model = tf.keras.models.Sequential()

# Prepend an input layer:
model.add(tf.keras.layers.InputLayer(input_shape=(None, None, 1), name='arbitrary_input'))

# Add all convolutional layers (which are the first 4 layers):
for layer in old_model.layers[:4]:
    model.add(layer)

# Get the input dimensions of the flattened layer:
f_dim = old_model.layers[4].input_shape

# And use it to convert the next dense layer:
dense = old_model.layers[5]
out_dim = dense.get_weights()[1].shape[0]
W, b = dense.get_weights()

new_shape = (f_dim[1], f_dim[2], f_dim[3], out_dim)
new_W = W.reshape(new_shape)

model.add(tf.keras.layers.Conv2D(out_dim,
                                 (f_dim[1], f_dim[2]),
                                 name = dense.name,
                                 strides = (1, 1),
                                 activation = dense.activation,
                                 padding = 'valid',
                                 weights = [new_W, b]))

pred = model.predict(blob, steps=1)

def get_bounding_boxes(pred):
    arr = []
    for idx, col in enumerate(pred[0]):
        y = idx * 4
        for jdx, row in enumerate(col):
            obj = {'y': y}
            obj['x'] = jdx * 4
            obj['max_value'] = max(row)
            obj['max_index'] = list(row).index(obj['max_value'])
            if obj['max_index']:
                arr.append(obj)

    arr.sort(key=lambda x: x['max_value'])

    # now the overlapping have to be removed...
    winner = []
    while(len(arr)):
        champ = arr.pop()
        winner.append(champ)

        arr = list(filter(lambda c: abs(c['x'] - champ['x']) >= 32 or abs(c['y'] - champ['y']) >= 32 , arr))

    final = []
    for champ in winner:
        box = [(champ['y']) / 360, (champ['x']) / 360,
               (champ['y'] + 32) / 360, (champ['x'] + 32) / 360]
        final.append(box)

    final = tf.convert_to_tensor(final)
    final = tf.expand_dims(final, axis = 0)
    return final

boxes = get_bounding_boxes(pred)
colors = tf.convert_to_tensor([[1, 1, 1]], dtype=tf.float32)

boxed_image = tf.image.draw_bounding_boxes(blob, boxes, colors)[:1]
boxed_image = boxed_image.numpy()[0]

cv2.imshow('show_image', boxed_image)
cv2.waitKey(0)
cv2.destroyAllWindows()

# TODO implement this as layer.

def non_max_sup(x):
    # extractInterestingInfo transforms the (h x w x d) tensor and
    # creates an array with len(h x w) with dictionaries.
    # these dictionaries contain x and y (times 4) and take the max and maxIndex

    # if extractInterestingInfo is done manually the flatten should not be necessary

    # we have an array now...so we can just remove every value with maxIndex == 0

    # sort everything

    # then comes the filtering... which is going to be nasty but w/e

    # x.map(extractInterestingInfo)
    #  .flat() // we flatten the input... so this could be done internatlly tbh
    #  .filter(e => e.maxIndex) // remove every node which is maxIndex 0 ('n')
    #  .sort((a, b) => a.max - b.max) // sort by max values
    #  .map(prepareForFiltering)
    # removeOverlaps(x) # now we have the array...
    print('--------------------------')
    print(list(x))
    # tf.map_fn(lambda y: print(y), x)
    # x.numpy()
    output = x
    return output

# model.add(tf.keras.layers.Lambda(non_max_sup))

# model.predict(blob, steps=1)
