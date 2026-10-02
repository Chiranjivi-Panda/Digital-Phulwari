import os
import json
import random
import joblib
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "crop_model.pkl")
CLASSES_PATH = os.path.join(BASE_DIR, "models", "crop_classes.json")

FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# Typical nutrient & pH ranges per soil type (agronomy-informed priors)
SOIL_PRIORS = {
    "alluvial_soil":  {"N": (60, 120), "P": (40, 90),  "K": (40, 100), "ph": (6.3, 7.8)},
    "arid_soil":      {"N": (15, 50),  "P": (15, 40),  "K": (40, 120), "ph": (7.0, 8.8)},
    "black_soil":     {"N": (40, 90),  "P": (30, 70),  "K": (80, 180), "ph": (7.2, 8.8)},
    "laterite_soil":  {"N": (10, 40),  "P": (8, 30),   "K": (15, 50),  "ph": (4.5, 6.2)},
    "mountain_soil":  {"N": (50, 110), "P": (35, 80),  "K": (40, 110), "ph": (5.2, 6.8)},
    "red_soil":       {"N": (20, 60),  "P": (15, 45),  "K": (25, 70),  "ph": (5.8, 7.2)},
    "yellow_soil":    {"N": (25, 65),  "P": (20, 50),  "K": (30, 80),  "ph": (5.3, 6.8)},
}

# Sky condition -> seasonal rainfall estimate (mm) for the model
RAIN_BY_CONDITION = [
    (("rain", "thunderstorm"), (180, 300)),
    (("drizzle",), (150, 240)),
    (("clouds", "mist", "fog"), (80, 150)),
    (("haze", "dust"), (60, 110)),
    (("clear",), (40, 90)),
]
DEFAULT_RAIN = (60, 140)

# Rooftop-gardening suitability for every crop in the dataset
CROP_INFO = {
    "rice":        {"display": "Rice (Dhaan)",            "rooftop": False, "pot": "Not for pots",          "difficulty": "experienced", "note": "Needs flooded paddy fields — not possible on terraces."},
    "maize":       {"display": "Maize (Bhutta)",          "rooftop": False, "pot": "Needs deep ground",     "difficulty": "experienced", "note": "Grows very tall with deep roots — skip for pots."},
    "chickpea":    {"display": "Chickpea (Chana)",        "rooftop": True,  "pot": "12-14 inch pot",        "difficulty": "beginner",    "note": "Cool-season pulse; very low maintenance in pots."},
    "kidneybeans": {"display": "Kidney Beans (Rajma)",    "rooftop": True,  "pot": "12-14 inch pot",        "difficulty": "beginner",    "note": "Loves cool weather; give it a support stick."},
    "pigeonpeas":  {"display": "Pigeon Peas (Arhar/Tur)", "rooftop": False, "pot": "Very large tub",        "difficulty": "experienced", "note": "Takes 5-6 months and grows into a big shrub."},
    "mothbeans":   {"display": "Moth Beans (Matki)",      "rooftop": True,  "pot": "10-12 inch pot",        "difficulty": "beginner",    "note": "Hardy desert pulse — almost zero care needed."},
    "mungbean":    {"display": "Mung Bean (Moong)",       "rooftop": True,  "pot": "10-12 inch pot",        "difficulty": "beginner",    "note": "Harvest in ~60 days; perfect summer pot crop."},
    "blackgram":   {"display": "Black Gram (Urad)",       "rooftop": True,  "pot": "10-12 inch pot",        "difficulty": "beginner",    "note": "Like moong; loves warm and humid days."},
    "lentil":      {"display": "Lentil (Masoor)",         "rooftop": True,  "pot": "12 inch pot",           "difficulty": "beginner",    "note": "Winter crop; keep the soil lightly moist."},
    "pomegranate": {"display": "Pomegranate (Anaar)",     "rooftop": True,  "pot": "18-24 inch pot",        "difficulty": "experienced", "note": "Dwarf varieties fruit nicely in big terrace pots."},
    "banana":      {"display": "Banana (Kela)",           "rooftop": False, "pot": "Ground or huge tub",    "difficulty": "experienced", "note": "Too heavy and hungry for normal terrace pots."},
    "mango":       {"display": "Mango (Aam)",             "rooftop": False, "pot": "Huge tub, years",       "difficulty": "experienced", "note": "A full tree — only for large terraces."},
    "grapes":      {"display": "Grapes (Angoor)",         "rooftop": True,  "pot": "18 inch pot + trellis", "difficulty": "experienced", "note": "Train along a railing trellis; fruits in 2-3 years."},
    "watermelon":  {"display": "Watermelon (Tarbooz)",    "rooftop": False, "pot": "10+ sq ft of space",    "difficulty": "experienced", "note": "Vines spread everywhere — big terraces only."},
    "muskmelon":   {"display": "Muskmelon (Kharbooja)",   "rooftop": False, "pot": "Large tub + space",     "difficulty": "experienced", "note": "Possible with a strong trellis; needs room."},
    "apple":       {"display": "Apple (Seb)",             "rooftop": False, "pot": "Hill climate only",     "difficulty": "experienced", "note": "Needs cold winters — won't fruit in hot plains."},
    "orange":      {"display": "Orange (Santra)",         "rooftop": True,  "pot": "18 inch pot (dwarf)",   "difficulty": "experienced", "note": "Dwarf varieties can fruit in large pots."},
    "papaya":      {"display": "Papaya (Papita)",         "rooftop": True,  "pot": "20+ inch deep pot",     "difficulty": "experienced", "note": "Fast grower; needs a deep pot and full sun."},
    "coconut":     {"display": "Coconut (Nariyal)",       "rooftop": False, "pot": "Not for pots",          "difficulty": "experienced", "note": "A full palm — impossible on a terrace."},
    "cotton":      {"display": "Cotton (Kapas)",          "rooftop": False, "pot": "Field crop",            "difficulty": "experienced", "note": "Commercial field crop with no terrace value."},
    "jute":        {"display": "Jute",                    "rooftop": False, "pot": "Field crop",            "difficulty": "experienced", "note": "Fibre crop grown in flooded fields."},
    "coffee":      {"display": "Coffee",                  "rooftop": True,  "pot": "14 inch pot, shade",    "difficulty": "experienced", "note": "Grows slowly as a shade plant; beans take years."},
}

_model = None
_classes = None


def _load_model():
    global _model, _classes
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("models/crop_model.pkl not found — run train_crop_model.py first")
        _model = joblib.load(MODEL_PATH)
        with open(CLASSES_PATH, "r") as f:
            _classes = json.load(f)
    return _model, _classes


def get_recommendations(soil: str, weather: dict, n_samples: int = 60):
    """Recommend crops for a soil type + current weather.

    Bridge: we don't have lab NPK values, so we sample realistic nutrient/pH
    profiles from soil-type priors, jitter the live weather slightly, run all
    profiles through the Random Forest, and average the probabilities.
    """
    model, classes = _load_model()

    key = soil.strip().lower().replace(" ", "_")
    if key not in SOIL_PRIORS:
        valid = [k.title().replace("_", " ") for k in SOIL_PRIORS]
        raise ValueError(f"Unknown soil '{soil}'. Valid soils: {valid}")
    prior = SOIL_PRIORS[key]

    cond = weather.get("condition", "").lower()
    rain_lo, rain_hi = DEFAULT_RAIN
    for keys, rng in RAIN_BY_CONDITION:
        if any(k in cond for k in keys):
            rain_lo, rain_hi = rng
            break

    rows = []
    for _ in range(n_samples):
        rows.append([
            random.uniform(*prior["N"]),
            random.uniform(*prior["P"]),
            random.uniform(*prior["K"]),
            max(5.0, weather["temperature"] * random.uniform(0.92, 1.08)),
            min(100.0, max(5.0, weather["humidity"] * random.uniform(0.90, 1.10))),
            random.uniform(*prior["ph"]),
            random.uniform(rain_lo, rain_hi),
        ])

    X = pd.DataFrame(rows, columns=FEATURES)
    avg = model.predict_proba(X).mean(axis=0)

    order = np.argsort(avg)[::-1][:6]
    crops = []
    for idx in order:
        name = classes[idx]
        info = CROP_INFO.get(name, {
            "display": name.title(), "rooftop": False, "pot": "—",
            "difficulty": "beginner", "note": "",
        })
        crops.append({
            "name": name,
            "display": info["display"],
            "match": round(float(avg[idx]) * 100, 1),
            "rooftop_friendly": info["rooftop"],
            "pot": info["pot"],
            "difficulty": info["difficulty"],
            "note": info["note"],
        })

    # Terrace-friendly crops first, then by match score
    crops.sort(key=lambda c: (not c["rooftop_friendly"], -c["match"]))

    return {
        "success": True,
        "soil": soil.strip().title(),
        "location": weather.get("location", ""),
        "temperature": weather.get("temperature"),
        "condition": weather.get("condition", ""),
        "top_crops": crops,
    }