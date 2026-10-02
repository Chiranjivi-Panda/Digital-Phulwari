import io
import os
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# ---- Paths (works no matter where you launch the server from) ----
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "soil_model_best.pt")
CLASSES_PATH = os.path.join(BASE_DIR, "models", "classes.json")

# ---- Load class names in the EXACT order used during training ----
with open(CLASSES_PATH, "r") as f:
    SOIL_CLASSES = json.load(f)

# Pretty display names (model uses folder names with underscores)
DISPLAY_NAMES = {
    "Alluvial_Soil": "Alluvial Soil",
    "Arid_Soil": "Arid Soil",
    "Black_Soil": "Black Soil",
    "Laterite_Soil": "Laterite Soil",
    "Mountain_Soil": "Mountain Soil",
    "Red_Soil": "Red Soil",
    "Yellow_Soil": "Yellow Soil",
}

# ---- Rooftop-gardening metadata for all 7 soil types ----
SOIL_METADATA = {
    "Alluvial_Soil": {
        "description": "Very fertile river-deposited soil. Soft, loose and nutrient-rich — one of the best soils for a kitchen garden.",
        "recommended_plants": [
            {"name": "Tomato", "reason": "Thrives in nutrient-rich, loose alluvial mix", "difficulty": "beginner", "sunlight": "6-8 hrs", "water": "Daily"},
            {"name": "Spinach (Palak)", "reason": "Fast harvest (30 days), loves moist fertile soil", "difficulty": "beginner", "sunlight": "3-5 hrs", "water": "Keep moist"},
            {"name": "Coriander (Dhaniya)", "reason": "Quick harvest, perfect for moist alluvial pots", "difficulty": "beginner", "sunlight": "4-5 hrs", "water": "Light daily mist"}
        ],
        "tips": "Mix 20% vermicompost into pots. Alluvial soil stays moist, so poke a finger 1 inch deep — water only if dry."
    },
    "Arid_Soil": {
        "description": "Dry, sandy desert soil (common in Rajasthan/Gujarat). Water drains away very fast and nutrients are low.",
        "recommended_plants": [
            {"name": "Aloe Vera", "reason": "Loves fast-draining dry soil, needs almost no care", "difficulty": "beginner", "sunlight": "Direct/Filtered", "water": "Once a week"},
            {"name": "Fenugreek (Methi)", "reason": "Grows in 3 weeks even in poor sandy soil", "difficulty": "beginner", "sunlight": "4-5 hrs", "water": "Light spray"},
            {"name": "Snake Plant", "reason": "Survives dry soil and forgetful watering", "difficulty": "beginner", "sunlight": "Any (even shade)", "water": "Once in 10 days"}
        ],
        "tips": "Mix 40% cocopeat + compost into pots so water stays longer. Cover top with dry-leaf mulch to stop evaporation."
    },
    "Black_Soil": {
        "description": "Heavy, dark 'cotton soil' (common in Maharashtra/MP). Holds water for a long time and is rich in iron and lime.",
        "recommended_plants": [
            {"name": "Chilli (Mirchi)", "reason": "Roots love mineral-rich black soil", "difficulty": "beginner", "sunlight": "6-8 hrs", "water": "When top inch is dry"},
            {"name": "Okra (Bhindi)", "reason": "Very sturdy grower in black soil containers", "difficulty": "beginner", "sunlight": "6 hrs", "water": "Moderate"},
            {"name": "Hibiscus (Gudhal)", "reason": "Blooms beautifully in iron-rich moist soil", "difficulty": "experienced", "sunlight": "6-8 hrs", "water": "Regular"}
        ],
        "tips": "Black soil turns rock-hard in pots. Mix 30% sand or cocopeat so roots breathe and water never gets stuck."
    },
    "Laterite_Soil": {
        "description": "Reddish, acidic soil of coastal/Konkan regions. Drains fast but is low in fertility and lime.",
        "recommended_plants": [
            {"name": "Ginger (Adrak)", "reason": "Grows happily in loose, acidic laterite", "difficulty": "beginner", "sunlight": "Partial shade", "water": "Keep moist"},
            {"name": "Turmeric (Haldi)", "reason": "Classic laterite crop, low maintenance", "difficulty": "beginner", "sunlight": "4-6 hrs", "water": "Regular"},
            {"name": "Curry Leaves (Kadi Patta)", "reason": "Tolerates acidity, loves good drainage", "difficulty": "beginner", "sunlight": "6 hrs", "water": "When dry"}
        ],
        "tips": "Add a handful of garden lime + lots of compost to reduce acidity. Laterite heats up fast — prefer light-coloured pots."
    },
    "Mountain_Soil": {
        "description": "Dark, loose forest soil from hilly regions. Rich in organic matter, slightly acidic — great for exotic vegetables.",
        "recommended_plants": [
            {"name": "Strawberry", "reason": "Hill crop that thrives in organic mountain soil", "difficulty": "experienced", "sunlight": "5-6 hrs", "water": "Keep moist"},
            {"name": "Peas (Matar)", "reason": "Cool-weather climber, perfect in loose soil", "difficulty": "beginner", "sunlight": "5-6 hrs", "water": "Moderate"},
            {"name": "Spinach (Palak)", "reason": "Loves organic-rich, slightly acidic soil", "difficulty": "beginner", "sunlight": "3-5 hrs", "water": "Keep moist"}
        ],
        "tips": "Perfect soil for strawberries and peas! On hot terraces give afternoon shade — this soil dries out quickly."
    },
    "Red_Soil": {
        "description": "Red soil coloured by iron oxide. Loose, well-draining and easy to work with, but needs compost for nutrients.",
        "recommended_plants": [
            {"name": "Curry Leaves (Kadi Patta)", "reason": "Loves slightly acidic, well-draining red soil", "difficulty": "beginner", "sunlight": "6 hrs", "water": "When dry"},
            {"name": "Radish (Mooli)", "reason": "Loose texture lets roots grow straight", "difficulty": "beginner", "sunlight": "5-6 hrs", "water": "Moderate"},
            {"name": "Marigold (Genda)", "reason": "Natural pest-protector, blooms vibrantly", "difficulty": "beginner", "sunlight": "6-8 hrs", "water": "Low to Moderate"}
        ],
        "tips": "Red soil drains fast on hot terraces. Water early morning and add cow-dung compost every 3 weeks."
    },
    "Yellow_Soil": {
        "description": "Pale yellow soil from humid regions. Holds more water than red soil and is slightly acidic and less fertile.",
        "recommended_plants": [
            {"name": "Lemon (Nimbu)", "reason": "Tolerates acidic yellow soil very well", "difficulty": "experienced", "sunlight": "6-8 hrs", "water": "Regular"},
            {"name": "Mint (Pudina)", "reason": "Loves moisture-retentive soil, spreads fast", "difficulty": "beginner", "sunlight": "3-4 hrs (partial shade)", "water": "High"},
            {"name": "Taro (Arbi)", "reason": "Enjoys damp, water-holding soil", "difficulty": "beginner", "sunlight": "Partial shade", "water": "High"}
        ],
        "tips": "Yellow soil can get waterlogged. Make sure every pot has drainage holes and mix in coarse sand."
    }
}

# ---- Model wrapper ----
class SoilModel:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Build architecture, then load YOUR trained weights (no internet needed)
        self.model = models.mobilenet_v2(weights=None)
        self.model.classifier[1] = nn.Linear(
            self.model.classifier[1].in_features, len(SOIL_CLASSES)
        )
        state = torch.load(MODEL_PATH, map_location=self.device)
        self.model.load_state_dict(state)
        self.model.to(self.device)
        self.model.eval()

        # Must match the validation transforms used in training
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ])

    def predict(self, image_bytes: bytes):
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(tensor)
            probabilities = torch.softmax(outputs, dim=1)[0]

            # Top-3 predictions for extra context
            top3_conf, top3_idx = torch.topk(probabilities, k=3)
            top3 = [
                {"soil": DISPLAY_NAMES.get(SOIL_CLASSES[i], SOIL_CLASSES[i]),
                 "confidence": round(float(c) * 100, 2)}
                for c, i in zip(top3_conf, top3_idx)
            ]

        best_key = SOIL_CLASSES[top3_idx[0]]
        metadata = SOIL_METADATA.get(best_key, {})

        return {
            "soil_type": DISPLAY_NAMES.get(best_key, best_key),
            "confidence": top3[0]["confidence"],
            "top_3": top3,
            "description": metadata.get("description", ""),
            "recommended_plants": metadata.get("recommended_plants", []),
            "terrace_tip": metadata.get("tips", "")
        }

classifier = SoilModel()