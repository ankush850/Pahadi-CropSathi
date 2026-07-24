import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report

print("--- Evaluating Crop Recommender Model Accuracy ---")
csv_path = "crop-recommender/Crop_recommendation.csv"
df = pd.read_csv(csv_path)

features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
target = 'label'

X = df[features]
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = GaussianNB()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"Gaussian Naive Bayes Model Test Accuracy: {acc * 100:.2f}%")
print("\nDetailed Per-Crop Classification Metrics:")
print(classification_report(y_test, y_pred))
