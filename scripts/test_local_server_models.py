import os
import numpy as np
import tensorflow as tf
import onnxruntime as ort
from PIL import Image

print("--- Testing Arecanut Model (tf.compat.v1) ---")
arecanut_path = "arecanut-detector/models/1"
graph = tf.Graph()
sess = tf.compat.v1.Session(graph=graph)
tf.compat.v1.saved_model.load(sess, [tf.saved_model.SERVING], arecanut_path)

input_tensor = graph.get_tensor_by_name("serving_default_sequential_input:0")
output_tensor = graph.get_tensor_by_name("StatefulPartitionedCall:0")

dummy_arecanut = np.random.rand(1, 256, 256, 3).astype(np.float32)
arecanut_preds = sess.run(output_tensor, {input_tensor: dummy_arecanut})
print("Arecanut Prediction Success! Output shape:", arecanut_preds.shape)

print("--- Testing Crop Weed Model (ONNX) ---")
weed_session = ort.InferenceSession("lib/crop_weed_model.onnx")
input_name = weed_session.get_inputs()[0].name
output_name = weed_session.get_outputs()[0].name

dummy_weed = np.random.rand(1, 352, 480, 3).astype(np.float32)
weed_preds = weed_session.run([output_name], {input_name: dummy_weed})[0]
print("Crop Weed Prediction Success! Output shape:", weed_preds.shape)

print("\nALL LOCAL ML MODELS LOADED & TESTED WITH 0 API KEYS!")
