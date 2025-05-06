# This simulates training and saving a basic model
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib
import os

os.makedirs("ml_models", exist_ok=True)

# Simulated MFCC feature vectors
X = np.random.rand(100, 13)  # 100 audio clips with 13 MFCCs
y = np.random.choice(['happy', 'sad', 'angry', 'calm'], 100)

le = LabelEncoder()
y_encoded = le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2)

clf = RandomForestClassifier()
clf.fit(X_train, y_train)

joblib.dump(clf, "ml_models/audio_emotion_model.pkl")
joblib.dump(le, "ml_models/audio_label_encoder.pkl")
