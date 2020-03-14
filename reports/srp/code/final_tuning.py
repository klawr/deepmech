"""
The final model tuning is put in a python script, because to run it in
terminal seems to be a little bit faster than to print everything into a
jupyter notebook apparently...
"""

import sys
sys.path.append('.')

from datetime import datetime
from os import path

from kerastuner import Hyperband, HyperParameters
from kerastuner import HyperParameters

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from tensorflow.keras.optimizers import Adam, RMSprop, SGD
from tensorboard.plugins.hparams import api

from src.utils import Spot, decode_image_record

spot = Spot('auth.json')

processed = path.join('data', 'processed')

features = {
    'image': tf.io.FixedLenFeature([], tf.string),
    'label': tf.io.FixedLenFeature([2], tf.int64),
}
shape = (32, 32, 1)

def decoder(example):
    feature = tf.io.parse_single_example(example, features)
    image = tf.io.parse_tensor(feature['image'], tf.float32)
    image.set_shape(shape)
    # We only want the 'label_idx'. Not the 'angle'.
    label = feature['label'][0]

    return [image, label]

train_dataset = decode_record(path.join(processed, 'train.tfrecord'), decoder)
validation_dataset = decode_record(path.join(processed, 'validate.tfrecord'), decoder)
test_dataset = decode_record(path.join(processed, 'test.tfrecord'), decoder)

def create_model(hp):
    model = models.Sequential()
    k1 = hp.Int('layer1_kernel', 2,4)
    model.add(layers.Conv2D(2**hp.Int('layer1_filter', 1,6), (k1,k1), activation='relu', input_shape=(32, 32, 1)))
    k2 = hp.Int('layer2_kernel', 2,4)
    model.add(layers.Conv2D(2**hp.Int('layer2_filter', 1,6), (k2,k2), activation='relu'))
    model.add(layers.MaxPooling2D(hp.Int('max_pooling', 2, 4)))
    model.add(layers.Flatten())
    model.add(layers.Dense(3, 'softmax'))

    optimizers = {
        'adam': Adam(),
        'sgd': SGD(lr=hp.Choice('learning_rate', [0.001, 0.003, 0.007, 0.01, 0.03]),
            momentum=hp.Float('momentum', 0.6, 1, 0.1),
            nesterov=hp.Boolean('nesterov')),
        'rms': RMSprop(lr=hp.Choice('learning_rate', [0.001, 0.003, 0.007, 0.01, 0.03]))
    }

    model.compile(
        loss='sparse_categorical_crossentropy',
        optimizer=optimizers[hp.Choice('optimizer', list(optimizers.keys()))],
        metrics=['acc'])

    return model

class customTuner(Hyperband):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def on_trial_end(self, trial):
        trial_dir = self.get_trial_dir(trial.trial_id)
        hparam_dir = path.join(trial_dir, trial.trial_id)
        hparams = trial.hyperparameters.values
        with tf.summary.create_file_writer(hparam_dir).as_default():
            api.hparams(hparams, trial_id=trial.trial_id)

        print(datetime.now().strftime("%Y-%m-%dT%H-%M-%S"))
        
        super().on_trial_end(trial)

    def on_epoch_end(self, trial, model, epoch, logs):
        id = trial.trial_id
        trial_dir = self.get_trial_dir(trial.trial_id)
        log_dir = path.join(trial_dir, trial.trial_id)
        with tf.summary.create_file_writer(log_dir).as_default():
            for metric in logs:
                tf.summary.scalar(metric, data=logs[metric], step=epoch)
            for layer in model.weights:
                tf.summary.histogram(layer.name, data=layer, step=epoch)
        super().on_epoch_end(trial, model, epoch, logs)

hp=HyperParameters()
log_dir = path.join('logs', 'srp_dropout')
model_path = path.join('models', 'devel', 'srp653.h5')

timestamp = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")

tuner = customTuner(
    create_model,
    hyperparameters=hp,
    objective='acc',
    max_epochs=100,
    factor=3,
    executions_per_trial=5,
    directory=log_dir,
    project_name=timestamp)

tuner.search_space_summary()

callbacks = [
    EarlyStopping(monitor='loss', patience=3),
    ModelCheckpoint(model_path, save_best_only=True) ]

tuner.search(
    train_dataset,
    validation_data=validation_dataset,
    epochs=30,
    steps_per_epoch=100,
    validation_steps=100,
    verbose=0,
    callbacks=callbacks)

print(tuner.results_summary())

test_winner = tuner.get_best_models(num_models=50)


for winner in test_winner:
    spot.message(str(winner.evaluate(test_dataset, steps=100, verbose=0)))

spot.exit()