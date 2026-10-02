import os
from dotenv import load_dotenv
import requests

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
key = os.getenv("GEMINI_API_KEY")
print("Key loaded:", (key[:10] + "...") if key else "NOT FOUND")

# Try newest first, fall back to older names — survives Google's model churn
MODELS = [
    "gemini-3.8-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
]

for model in MODELS:
    r = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        params={"key": key},
        json={"contents": [{"role": "user", "parts": [{"text": "Say hi in 3 words"}]}]},
        timeout=30,
    )
    print(f"{model}: {r.status_code}")
    if r.status_code == 200:
        print("✅ Reply:", r.json()["candidates"][0]["content"]["parts"][0]["text"])
        break
    elif r.status_code == 400 and "API key not valid" in r.text:
        print("❌ Key invalid — fix the key in .env")
        break
else:
    print("Raw error:", r.text[:500])