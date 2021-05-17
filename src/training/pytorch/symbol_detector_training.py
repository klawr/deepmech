from os import path

import torch
from torch.utils.data import DataLoader, random_split

from spot import Spot
from symbol_detector_dataset import SymbolDataSet
from symbol_detector_model import SymbolDetector

annotation_file = path.join("data", "iftomm_dach_interim_01", "config.json")

data = SymbolDataSet(annotations_file=annotation_file, img_dir=".")
split = (int(len(data) * 0.8), int(len(data) * 0.2))

training_data, test_data = random_split(data, split)

batch_size = 64
train_dataloader = DataLoader(training_data, batch_size=batch_size, shuffle=True)
test_dataloader = DataLoader(test_data, batch_size=batch_size, shuffle=True)

device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using {}".format(device))

model = SymbolDetector().to(device)

loss_fn = torch.nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters())


def train(dataloader, model, loss_fn, optimizer):
    size = len(dataloader.dataset)
    for batch, (X, y) in enumerate(dataloader):
        X, y = X.to(device), y.to(device)

        pred = model(X)
        loss = loss_fn(pred, y)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if batch % 100 == 0:
            loss, current = loss.item(), batch * len(X)
            print(f"loss: {loss:>7f} [{current:>5d}/{size:>5d}]")


last = ""


def test(dataloader, model):
    global last
    size = len(dataloader.dataset)
    model.eval()
    test_loss, correct = 0, 0
    with torch.no_grad():
        for X, y in dataloader:
            X, y = X.to(device, dtype=torch.float32), y.to(device)
            pred = model(X)
            test_loss += loss_fn(pred, y).item()
            correct += (pred.argmax(1) == y).type(torch.float).sum().item()

    test_loss /= size
    correct /= size
    last = f"Accuracy: {(100*correct):>0.1f}%, \nAvg loss: {test_loss:>8f}"
    print(f"Test Error:\n{last}")


epochs = 30
for t in range(epochs):
    print(f"Epoch {t+1}\n-----------------------------")
    train(train_dataloader, model, loss_fn, optimizer)
    test(test_dataloader, model)

print("Done!")
model_path = "models/symbol_detector.pth"
torch.save(model.state_dict(), model_path)
msg = f"Saved PyTorch Model State to: {model_path}"
print(msg)
with Spot("./spot.json") as spot:
    spot.message(f"Done.\nLast results are: {last}\n{msg}")
