
# Create a training environment in the target directory.
# Create one directory in target_dir/{train, validate, test} for each directory in raw.
# Returns the paths for the raw "classes" (3 each).
def create(raw_classes, target_dir):
    from os import mkdir, listdir
    from os.path import join, exists

    def mkdir_ex(path):
        if not exists(path):
            mkdir(path)

    mkdir_ex(target_dir)

    train_dir = join(target_dir, 'train')
    mkdir_ex(train_dir)
    validation_dir = join(target_dir, 'validation')
    mkdir_ex(validation_dir)
    test_dir = join(target_dir, 'test')
    mkdir_ex(test_dir)

    return_values = []

    for d in sorted(raw_classes):
        train = join(train_dir, d)
        validation = join(validation_dir, d)
        test = join(test_dir, d)

        return_values.append(train)
        return_values.append(validation)
        return_values.append(test)

        mkdir_ex(train)
        mkdir_ex(validation)
        mkdir_ex(test)

    return return_values

# Populate directories made by create
def populate(raw_dir, paths, seg, raw_classes=None):
    from shutil import copyfile
    from sys import exit
    from os import listdir
    from os.path import join

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
    from shutil import rmtree
    from os import listdir, unlink
    from os.path import join, isfile

    for file in listdir(target_dir):
        file_path = join(target_dir, file)
        try:
            if isfile(file_path):
                unlink(file_path)
            elif os.path.isdir(file_path): rmtree(file_path)
        except Exception as e:
            print(e)

def reset_and_populate(raw_dir, target_dir, segmentation, raw_classes=None):
    from os import listdir

    if raw_classes is None:
        raw_classes = listdir(raw_dir)

    reset(target_dir)
    return create_and_populate(raw_dir, target_dir, segmentation, raw_classes)
