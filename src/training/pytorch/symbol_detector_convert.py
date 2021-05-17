import torch
from symbol_detector_model import SymbolDetector
from torch.utils.mobile_optimizer import optimize_for_mobile

model = SymbolDetector()
model.load_state_dict(torch.load("./models/symbol_detector.pth"))

model_tmp = torch.quantization.convert(model)
scripted_model = torch.jit.script(model_tmp)
opt_model = optimize_for_mobile(scripted_model)
torch.jit.save(opt_model, "mobile_model.pt")
