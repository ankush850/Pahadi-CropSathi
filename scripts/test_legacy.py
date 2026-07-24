import tensorflow as tf

print("Testing loading with tf.compat.v1.saved_model...")
try:
    with tf.compat.v1.Session(graph=tf.Graph()) as sess:
        meta_graph_def = tf.compat.v1.saved_model.load(sess, [tf.saved_model.SERVING], "arecanut-detector/models/1")
        print("Successfully loaded legacy SavedModel graph!")
        print("Signatures:", meta_graph_def.signature_def.keys())
except Exception as e:
    print("Failed v1 load:", e)
