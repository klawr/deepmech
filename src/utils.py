
from os import mkdir

def mkdir_ex(path):
    try:
        mkdir(path)
    except:
        pass
