import torch
from torch import nn


class SymbolDetector(nn.Module):
    def __init__(self):
        super(SymbolDetector, self).__init__()

        self.conv = nn.Sequential(
            nn.Conv2d(1, 16, (4, 4)),
            nn.ReLU(),
            nn.MaxPool2d((2, 2)),
            nn.Conv2d(16, 32, (4, 4)),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(32, 3, (5, 5)),
        )

    def forward(self, x):
        logits = self.conv(x)
        logits = torch.squeeze(logits)
        return logits
