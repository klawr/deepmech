
from os.path import join

def get_directories():
    data = join('..', 'data')
    raw = join(data, 'raw')
    interim = join(data, 'interim')
    processed = join(data, 'processed')
    
    return raw, interim, processed