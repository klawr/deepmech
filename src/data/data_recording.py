
import sys
sys.path.append('.')

from os import listdir
from os.path import join

from src.image_handling import encode_record, read_augmented_images

interim = join('data', 'interim')
processed = join('data', 'processed')
labels = listdir(join('data', 'raw'))

train_list = read_augmented_images(join(interim, 'train', 'config.json'))
validation_list = read_augmented_images(join(interim, 'validation', 'config.json'))
test_list = read_augmented_images(join(interim, 'test', 'config.json'))

encode_record(train_list, labels, processed, 'train')
encode_record(validation_list, labels, processed, 'validation')
encode_record(test_list, labels, processed, 'test')