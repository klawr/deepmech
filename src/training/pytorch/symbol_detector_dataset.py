import os

import pandas as pd
from torch.utils.data import Dataset
from torchvision.io import read_image
from torchvision.io.image import ImageReadMode

labels = [None, "r", "t"]


class SymbolDataSet(Dataset):
    def __init__(
        self, annotations_file, img_dir, transform=None, target_transform=None
    ):
        self.img_labels = pd.read_json(annotations_file)
        self.img_dir = img_dir
        self.transform = transform
        self.target_transform = target_transform

    def __len__(self):
        return len(self.img_labels)

    def __getitem__(self, idx):
        img_path = os.path.join(self.img_dir, self.img_labels.iloc[idx, 0])
        image = read_image(img_path, mode=ImageReadMode.GRAY)
        float_image = image / 255.0
        label = self.img_labels.iloc[idx, 1]
        label = labels.index(label)  # Tensors need numbers. No string allowed.
        if self.transform:
            float_image = self.transform(float_image)
        if self.target_transform:
            label = self.target_transform(label)

        return [float_image, label]
