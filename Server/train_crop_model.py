import os
import json
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "dataset", "Crop_recommendation.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")


def main():
    print("Loading dataset...")
    df = pd.read_csv(CSV_PATH)
    print(f"Rows: {len(df)} | Crops: {df['label'].nunique()}")

    features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    X, y = df[features], df["label"]

    X_tr, X_te, y_tr, y_te = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Training Random Forest (300 trees)...")
    model = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1)
    model.fit(X_tr, y_tr)

    acc = accuracy_score(y_te, model.predict(X_te))
    print(f"\n✅ Test accuracy: {acc * 100:.2f}%\n")
    print(classification_report(y_te, model.predict(X_te)))

    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODELS_DIR, "crop_model.pkl"))
    with open(os.path.join(MODELS_DIR, "crop_classes.json"), "w") as f:
        json.dump(list(model.classes_), f)

    print("Saved: models/crop_model.pkl + models/crop_classes.json")


if __name__ == "__main__":
    main()