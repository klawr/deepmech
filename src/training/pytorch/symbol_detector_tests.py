import torch
from torchvision.io import read_image
from torchvision.io.image import ImageReadMode

from symbol_detector_model import SymbolDetector

image = read_image("./image.png", mode=ImageReadMode.GRAY)
image = image.unsqueeze(0)
image = image / 255.0

model = SymbolDetector()
model.load_state_dict(torch.load("./models/symbol_detector.pth"))

c = model(image)

