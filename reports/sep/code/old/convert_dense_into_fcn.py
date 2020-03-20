from tensorflow import keras

from os.path import join
import tensorflow as tf

path = join('reports', 'sep', 'code', 'reversed.jpg')
blob = tf.io.read_file(path)
blob = tf.image.decode_jpeg(blob, channels=1)
blob = tf.image.convert_image_dtype(blob, tf.float32)
print(blob.shape)
blob = tf.image.resize(blob, (231, 180))
blob = tf.expand_dims(blob, axis=0)

def to_fully_conv(model):
    new_model = tf.keras.models.Sequential()
    input_layer = tf.keras.layers.InputLayer(input_shape=(None, None, 1), name="input_new")

    new_model.add(input_layer)
    for layer in model.layers:
        if "Flatten" in str(layer):
            flattened_ipt = True
            f_dim = layer.input_shape

        elif "Dense" in str(layer):
            input_shape = layer.input_shape
            output_dim =  layer.get_weights()[1].shape[0]
            W,b = layer.get_weights()

            if flattened_ipt:
                shape = (f_dim[1],f_dim[2],f_dim[3],output_dim)
                new_W = W.reshape(shape)
                new_model.add(tf.keras.layers.Conv2D(output_dim,
                                          (f_dim[1],f_dim[2]),
                                          name=layer.name,
                                          strides=(1,1),
                                          activation=layer.activation,
                                          padding='valid',
                                          weights=[new_W,b]))
                flattened_ipt = False
            else:
                shape = (1,1,input_shape[1],output_dim)
                new_W = W.reshape(shape)
                new_model.add(tf.keras.layers.Conv2D(output_dim,
                                          (1,1),
                                          strides=(1,1),
                                          activation=layer.activation,
                                          padding='valid',
                                          weights=[new_W,b]))

        else:
            new_model.add(layer)
    return new_model

model_path = join('models', 'symbol_classifier', 'model.h5')
old_model = tf.keras.models.load_model(model_path)

model = to_fully_conv(old_model)

model.summary()

print(model.predict(blob, steps=1).shape)

