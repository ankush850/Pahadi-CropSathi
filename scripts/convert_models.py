import os
import keras
import tensorflow as tf
import numpy as np

print("Testing loading Arecanut SavedModel with TFSMLayer...")
arecanut_path = "arecanut-detector/models/1"
if os.path.exists(arecanut_path):
    layer = keras.layers.TFSMLayer(arecanut_path, call_endpoint='serving_default')
    dummy_input = tf.zeros((1, 256, 256, 3))
    output = layer(dummy_input)
    print("Arecanut model loaded successfully! Output shape:", output)

print("Testing loading Crop Weed SavedModel with TFSMLayer...")
weed_path = "crop-detection/models/model_352x480_3_30.hd5"
if os.path.exists(weed_path):
    layer = keras.layers.TFSMLayer(weed_path, call_endpoint='serving_default')
    dummy_input = tf.zeros((1, 352, 480, 3))
    output = layer(dummy_input)
    print("Crop Weed model loaded successfully! Output shape:", output)
