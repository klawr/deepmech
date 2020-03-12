
import asyncio
import discord
import json as json
import os
from os import path
import shutil

def distribute_data(raw_dir, target_dir, distribution, raw_classes=None):
    """Distribute data into train, validate and test.

    # Arguments
        raw_dir: path to directory with raw data.
            Data can be lying in the directory,
            or in subfolders which are then considered to be labels.
        target_dir: directory in which the data should be distributed in.
        distribution: Distribution of data in absolute values.
        raw_classes: Must be a subset of raw_dir subfolders or None.
            If raw_classes is None, sub_dirs of raw_dir are used as raw_classes.
            Can be used to prevent some classes from being distributed.
    """
    _, sub_dirs, files = os.walk(raw_dir).__next__()

    # Use sub_dirs as default for raw_classes
    if not raw_classes:
        raw_classes = sub_dirs
    # Check if raw_classes is a valid subset
    elif not set(raw_classes) <= set(sub_dirs):
        print("Error: raw_classes:%s is no subset of raw_dir:%s." % (raw_classes, sub_dirs))        

    # Create target_dir and in it train, validate and test
    os.makedirs(target_dir, exist_ok=True)

    train_dir = path.join(target_dir, 'train')
    os.makedirs(train_dir, exist_ok=True)
    
    validate_dir = path.join(target_dir, 'validate')
    os.makedirs(validate_dir, exist_ok=True)
    
    test_dir = path.join(target_dir, 'test')
    os.makedirs(test_dir, exist_ok=True)

    target_dirs = [train_dir, validate_dir, test_dir]

    # Create a directory for each raw_class in target_dir
    for target_dir in target_dirs:
        for raw_class in raw_classes:
            os.makedirs(path.join(target_dir, raw_class), exist_ok=True)


    def distribute(src_dir, filenames, distribution, raw_class = ''):
        l = len(filenames)
        s = sum(distribution)
        if l < s:
            print("Error: Number of files (%s) less than sum of distribution (%s)" % (l, s))
            return

        file_iter = iter(filenames)

        for idx, quantity in enumerate(distribution):
            tar_dir = path.join(target_dirs[idx], raw_class)

            for i in range(quantity):
                file_name = next(file_iter)
                src = path.join(src_dir, file_name)
                tar = path.join(tar_dir, file_name)
                shutil.copyfile(src, tar)

        return

    if not len(raw_classes):
        distribute(src_dir, files, distribution)

        return

    for idx, raw_class in enumerate(raw_classes):
        src_dir = path.join(raw_dir, raw_class)
        _, _, src_files = os.walk(src_dir).__next__()
        distribute(src_dir, src_files, distribution, raw_class)

    return


def reset_and_distribute_data(raw_dir, target_dir, *args):
    # Clear target_dir and then call distribute_data

    try:
        shutil.rmtree(target_dir, ignore_errors=True)
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))

    distribute_data(raw_dir, target_dir, *args)

    return


# TODO do not import discord until Spot is loaded.
class Spot(discord.Client):
    '''
    import spot
    with spot('./config.json') as spot:
        spot.message('i love you')
    '''
    def __init__(self, file=None, id=None, token=None,
        loop=asyncio.new_event_loop(), *args, **kwargs):
        
        if file is not None:
            with open(file) as config:
                auth = json.load(config)
                id = auth['id']
                token = auth['token']
        elif id is None and token is None:
            print('spot can not authenticate.')
            return

        self.loop = loop
        super().__init__(*args, **kwargs)
        async def login(token):
            await self.login(token)
            user = await self.fetch_user(id)
            self.channel = await user.create_dm()
        self.loop.run_until_complete(login(token))

    def __enter__(self):
        return self

    def exit(self):
        async def goodbye():
            await self.logout()
        self.loop.run_until_complete(goodbye())

    def __exit__(self, *args):
        self.exit()
    
    def message(self, text):
        self.loop.run_until_complete(self.channel.send(text))
