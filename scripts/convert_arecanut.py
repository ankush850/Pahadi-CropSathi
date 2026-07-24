import tensorflow as tf
import tf2onnx

print("Converting Arecanut SavedModel via tf2onnx.process_tf_graph...")
graph = tf.Graph()
with tf.compat.v1.Session(graph=graph) as sess:
    meta_graph = tf.compat.v1.saved_model.load(sess, [tf.saved_model.SERVING], "arecanut-detector/models/1")
    
    input_names = ["serving_default_sequential_input:0"]
    output_names = ["StatefulPartitionedCall:0"]
    
    model_proto, _ = tf2onnx.process_tf_graph(
        graph, 
        input_names=input_names, 
        output_names=output_names
    )
    
    output_path = "lib/arecanut_model.onnx"
    with open(output_path, "wb") as f:
        f.write(model_proto.SerializeToString())
    print("Exported", output_path, "successfully!")
