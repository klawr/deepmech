import cv2
import torch
from torchvision.io import read_image
from torchvision.io.image import ImageReadMode

from symbol_detector_model import SymbolDetector

print("Finished imports...")
image = read_image("./image.png", mode=ImageReadMode.GRAY)
image = image.unsqueeze(0)
image = image / 255.0

model = SymbolDetector()
model.load_state_dict(torch.load("./models/symbol_detector.pth"))
print("Model loaded...")

c = model(image)
print("Prediction finished...")
i = cv2.resize(c.permute(1, 2, 0).detach().numpy(), (0, 0), fx=4, fy=4)

print("Inverting colors...")
i = cv2.bitwise_not(i)

cv2.imshow("tensor", i)
cv2.waitKey(0)
print("Closing...")
cv2.destroyAllWindows()
