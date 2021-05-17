import torch
from torch import nn


class ConstraintDetector(nn.Module):
    def __init__(self):
        super(ConstraintDetector, self).__init__()

        self.conv = nn.Sequential(
            nn.Conv2d(1, 16, (4, 4)),
            nn.ReLU(),
            nn.MaxPool2d((2, 2)),
            nn.Conv2d(16, 32, (4, 4)),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 3, (21, 21)),
        )

    def forward(self, x):
        logits = self.conv(x)
        logits = torch.squeeze(logits)
        return logits
