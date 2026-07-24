import csv
import json
import math

with open('lib/crop_model.json', 'r') as f:
    model_data = json.load(f)

classes = model_data['classes']
theta = model_data['theta']
var_ = model_data['var']
priors = model_data['class_prior']

correct = 0
total = 0

def predict(x):
    best_crop = None
    max_log_prob = -float('inf')
    
    for c in range(len(classes)):
        log_prob = math.log(priors[c])
        for f in range(7):
            mean = theta[c][f]
            variance = var_[c][f]
            val = x[f]
            log_density = -0.5 * math.log(2 * math.pi * variance) - ((val - mean) ** 2) / (2 * variance)
            log_prob += log_density
            
        if log_prob > max_log_prob:
            max_log_prob = log_prob
            best_crop = classes[c]
            
    return best_crop

with open('crop-recommender/Crop_recommendation.csv', 'r') as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        if not row:
            continue
        vals = [float(x) for x in row[:7]]
        actual_label = row[7].strip().lower()
        
        pred_label = predict(vals).lower()
        if pred_label == actual_label:
            correct += 1
        total += 1

accuracy = (correct / total) * 100
print("==========================================================")
print(f"CROP RECOMMENDER MODEL ACCURACY: {accuracy:.2f}% ({correct}/{total} correctly predicted)")
print("==========================================================")
