import sys
sys.path.append('.')

from datetime import datetime
from os.path import join

from kerastuner import Hyperband, HyperParameters
from kerastuner import HyperParameters

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.optimizers import Adam, RMSprop, SGD
from tensorboard.plugins.hparams import api

from src.image_handling import decode_record

processed = join('data', 'processed')

features = {
    'image': tf.io.FixedLenFeature([], tf.string),
    'label': tf.io.FixedLenFeature([], tf.int64),
}
shape = (32, 32, 1)

train_dataset = decode_record(join(processed, 'train.tfrecord'), features, shape)
validation_dataset = decode_record(join(processed, 'validation.tfrecord'), features, shape)
test_dataset = decode_record(join(processed, 'test.tfrecord'), features, shape)

def create_model(hp):
    model = models.Sequential()
    model.add(layers.Conv2D(2**hp.Int('2**num_filter_0', 4, 6),
        (4,4) ,activation='relu', input_shape=(32, 32, 1)))

    for i in range(hp.Int('num_cnn_layers', 0, 3)):
        filter = 2**hp.Int('2**num_filter_' + str(i), 4, 7)
        model.add(layers.Conv2D(filter, (4,4), activation='relu', padding='same'))
        if hp.Boolean('pooling_' + str(i)):
            model.add(layers.MaxPooling2D(2, 2))

    model.add(layers.Flatten())
    for i in range(hp.Int('num_dense_layers', 1, 3)):
        nodes = 2**hp.Int('2**num_nodes_' + str(i), 4, 7)
        model.add(layers.Dense(nodes, activation='relu'))
    
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
        hparam_dir = join(trial_dir, trial.trial_id)
        hparams = trial.hyperparameters.values
        with tf.summary.create_file_writer(hparam_dir).as_default():
            api.hparams(hparams, trial_id=trial.trial_id)

        print(datetime.now().strftime("%Y-%m-%dT%H-%M-%S"))
        
        super().on_trial_end(trial)

    def on_epoch_end(self, trial, model, epoch, logs):
        id = trial.trial_id
        trial_dir = self.get_trial_dir(trial.trial_id)
        log_dir = join(trial_dir, trial.trial_id)
        with tf.summary.create_file_writer(log_dir).as_default():
            for metric in logs:
                tf.summary.scalar(metric, data=logs[metric], step=epoch)
            for layer in model.weights:
                tf.summary.histogram(layer.name, data=layer, step=epoch)
        super().on_epoch_end(trial, model, epoch, logs)

hp=HyperParameters()
log_dir = join('logs', 'srp_dropout')
timestamp = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")

tuner = customTuner(
    create_model,
    hyperparameters=hp,
    objective='acc',
    max_epochs=400,
    factor=3,
    executions_per_trial=1,
    directory=log_dir,
    project_name=timestamp)

tuner.search_space_summary()

callbacks = [ EarlyStopping(monitor='loss', patience=3) ]

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
    print(winner.evaluate(test_dataset, steps=100, verbose=0))