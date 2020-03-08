
from os import listdir, makedirs, unlink
from os.path import isdir, isfile, join
from shutil import copyfile, rmtree

# Create a training environment in the target directory.
# Create one directory in target_dir/{train, validate, test} for each directory in raw.
# Returns the paths for the raw "classes" (3 each).
def create(raw_classes, target_dir):
    makedirs(target_dir, exist_ok=True)

    train_dir = join(target_dir, 'train')
    makedirs(train_dir, exist_ok=True)
    validation_dir = join(target_dir, 'validation')
    makedirs(validation_dir, exist_ok=True)
    test_dir = join(target_dir, 'test')
    makedirs(test_dir, exist_ok=True)

    return_values = []

    for d in sorted(raw_classes):
        train = join(train_dir, d)
        validation = join(validation_dir, d)
        test = join(test_dir, d)

        return_values.append(train)
        return_values.append(validation)
        return_values.append(test)

        makedirs(train, exist_ok=True)
        makedirs(validation, exist_ok=True)
        makedirs(test, exist_ok=True)

    return return_values

# Populate directories made by create
def populate(raw_dir, paths, seg, raw_classes=None):
    def dist(src_dir, dest, begin, limit):
        for i in range(begin, limit):
            filename = str(i) + '.jpeg'
            src = join(src_dir, filename)
            target = join(dest, filename)
            copyfile(src, target)

    if raw_classes is None:
        raw_classes = listdir(raw_dir)

    for idx, val in enumerate(sorted(raw_classes)):
        dist(join(raw_dir, val), paths[idx * 3 + 0], 0, seg[0])
        dist(join(raw_dir, val), paths[idx * 3 + 1], seg[0], sum(seg[:2]))
        dist(join(raw_dir, val), paths[idx * 3 + 2], sum(seg[:2]), sum(seg))

def create_and_populate(raw_dir, target_dir, segmentation, raw_classes=None):
    if raw_classes is None:
        raw_classes = listdir(raw_dir)
    paths = create(raw_classes, target_dir)
    populate(raw_dir, paths, segmentation, raw_classes)
    return paths

# Remove all files inside of the interim and processed directory. Don't touch the raw data!
def reset(target_dir):
    try:
        for file in listdir(target_dir):
            file_path = join(target_dir, file)
            try:
                if isfile(file_path):
                    unlink(file_path)
                elif isdir(file_path):
                    rmtree(file_path)
            except Exception as e:
                print(e)
        try:
                rmtree(target_dir)
        except Exception as e:
            print(e)
    except:
        pass

def reset_and_populate(raw_dir, target_dir, segmentation, raw_classes=None):
    makedirs(raw_dir, exist_ok=True)
    makedirs(target_dir, exist_ok=True)

    if raw_classes is None:
        raw_classes = listdir(raw_dir)

    reset(target_dir)
    return create_and_populate(raw_dir, target_dir, segmentation, raw_classes)
