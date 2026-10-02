import os
import requests

# Tried in order — newest first. Update this list as Google retires models.
GEMINI_MODELS = [
    "gemini-3.8-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
]

SYSTEM_PROMPT = """You are 'Phulwari AI', a warm and patient gardening assistant inside the Digital
Phulwari app, used by Indian home gardeners doing rooftop/terrace gardening. Many users are parents
with no technical gardening knowledge.

Rules:
- Keep answers short and simple (3-6 sentences max). Use everyday words, avoid jargon.
- You may add simple Hindi words in brackets when helpful (e.g., vermicompost (khaad)).
- Focus on container/terrace gardening: watering, sunlight, soil care, compost, pests, and
  seasonal vegetables and herbs common in India.
- Prefer organic/home solutions (neem oil spray, cow dung compost) over chemicals.
- Give concrete numbers when useful: litres of water, hours of sun, days to harvest.
- If asked something unrelated to gardening, gently steer back with one short line.
- Never give medical advice. For poisonous plants or chemical exposure, say to consult a doctor.
"""


def _get_api_key():
    """Read the key LAZILY (at call time) so .env is always loaded first."""
    key = os.getenv("GEMINI_API_KEY", "")
    return key.strip().strip('"').strip("'")


def get_gemini_reply(messages, soil_context=None):
    """messages: [{'role': 'user'|'bot', 'text': str}, ...] chronological, latest last."""
    key = _get_api_key()
    if not key:
        raise RuntimeError("Add your Gemini key to Server/.env")

    system_text = SYSTEM_PROMPT
    if soil_context:
        system_text += (
            f"\nThe user's terrace soil was detected as: {soil_context}. "
            "Personalize your advice using this when relevant."
        )

    contents = []
    for m in messages[-12:]:
        role = "user" if m["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": m["text"]}]})

    body = {
        "systemInstruction": {"parts": [{"text": system_text}]},
        "contents": contents,
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 400},
    }

    last_err = None
    for model in GEMINI_MODELS:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        r = requests.post(url, params={"key": key}, json=body, timeout=30)

        if r.status_code == 200:
            data = r.json()
            try:
                return data["candidates"][0]["content"]["parts"][0]["text"].strip()
            except (KeyError, IndexError):
                return "I can't answer that one — try rephrasing your gardening question 🌱"

        if r.status_code == 400 and "API key not valid" in r.text:
            raise RuntimeError("Gemini API key is invalid")
        if r.status_code == 429:
            raise RuntimeError("Gemini rate limit reached — try again in a minute")

        last_err = f"{model}: HTTP {r.status_code}"  # 404 etc → try next model

    raise RuntimeError(f"Gemini error — {last_err}")