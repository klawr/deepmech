from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers
from tensorflow.keras import models
from tensorflow.keras.callbacks import TensorBoard
from os.path import join

class model:
    def __init__(self, dirs, image_size, dense_layers, optimizer, training_params):
        processed, log_dir = dirs
        
        self.__epochs=training_params['epochs']
        self.__steps_per_epoch=training_params['steps_per_epoch']
        self.__validation_steps=training_params['validation_steps']

        generator = lambda dir: ImageDataGenerator(rescale=1./255).flow_from_directory(
            dir,
            target_size=(image_size, image_size),
            batch_size=training_params['batch_size'],
            class_mode='binary')

        self.train_generator = generator(join(processed, 'train'))
        self.validation_generator = generator(join(processed, 'validation'))
        self.test_generator = generator(join(processed, 'test'))

        self.model = models.Sequential()
        self.model.add(layers.Flatten(input_shape=(image_size, image_size, 3)))
        for layer in dense_layers:
            self.model.add(layers.Dense(layer, 'relu'))
        self.model.add(layers.Dense(3, 'softmax'))

        self.model.compile(loss=training_params['loss'], optimizer=optimizer, metrics=['acc'])

        # TODO: This callack should have a name for better evaluation of results...
        self.callbacks = [ TensorBoard(
            log_dir=log_dir,
            histogram_freq=1,
            embeddings_freq=1) ]
    

    def train(self):
        history = self.model.fit_generator(
            self.train_generator,
            epochs=self.__epochs,
            steps_per_epoch=self.__steps_per_epoch,
            validation_data=self.validation_generator,
            validation_steps=self.__validation_steps,
            callbacks=self.callbacks)
        return history

    def evaluate(self):
        return self.model.evaluate_generator(self.test_generator)
