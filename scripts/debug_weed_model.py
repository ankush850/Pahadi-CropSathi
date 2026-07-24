import onnxruntime as ort
import numpy as np
from PIL import Image

session = ort.InferenceSession("lib/crop_weed_model.onnx")
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

print("Input shape:", session.get_inputs()[0].shape)
print("Output shape:", session.get_outputs()[0].shape)

# Create dummy input with values around 128 (green/field colors)
dummy = np.full((1, 352, 480, 3), 128, dtype=np.float32) / 255.0
output = session.run([output_name], {input_name: dummy})[0]

print("Model Raw Output shape:", output.shape)
print("Channel 0 mean:", np.mean(output[0, :, :, 0]))
print("Channel 1 mean:", np.mean(output[0, :, :, 1]))
print("Channel 1 min/max:", np.min(output[0, :, :, 1]), np.max(output[0, :, :, 1]))
