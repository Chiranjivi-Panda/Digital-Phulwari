from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from soil_classifier import classifier
from crop_recommender import get_recommendations
from dotenv import load_dotenv
import os
import requests
from gemini_chat import get_gemini_reply
from pydantic import BaseModel

# Load keys from Server/.env (fallback keeps old behaviour if .env missing)
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

app = FastAPI(
    title="Digital Phulwari API",
    description="AI-powered smart rooftop gardening backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- OpenWeatherMap key (move to .env before pushing to GitHub!) ----
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")


def _fetch_openweather(lat=None, lon=None, city=None) -> dict:
    """Shared helper: fetch raw weather JSON from OpenWeatherMap."""
    params = {"appid": OPENWEATHER_API_KEY, "units": "metric"}
    if lat is not None and lon is not None:
        params.update({"lat": lat, "lon": lon})
    if not OPENWEATHER_API_KEY:
        raise HTTPException(status_code=500, detail="OPENWEATHER_API_KEY not set — add it to Server/.env")    
    elif city:
        params["q"] = city
    else:
        params.update({"lat": 28.61, "lon": 77.21})  # default: New Delhi

    r = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params, timeout=10)
    if r.status_code == 401:
        raise HTTPException(status_code=401, detail="Invalid API key (or key not activated yet — new keys can take up to 2 hours)")
    if r.status_code == 404:
        raise HTTPException(status_code=404, detail="City not found. Check spelling.")
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail="Weather service error. Try again shortly.")
    return r.json()


@app.get("/")
def root():
    return {
        "status": "online",
        "app": "Digital Phulwari Backend",
        "endpoints": {
            "soil_analysis": "POST /api/soil/analyze",
            "weather": "GET /api/weather",
            "recommend": "GET /api/recommend",
            "health": "GET /api/health"
        }
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/weather")
def get_weather(lat: float | None = None, lon: float | None = None, city: str | None = None):
    d = _fetch_openweather(lat, lon, city)

    temp = round(d["main"]["temp"])
    humidity = d["main"]["humidity"]
    condition = d["weather"][0]["main"]
    wind = d["wind"]["speed"]

    return {
        "success": True,
        "location": d.get("name", "Unknown"),
        "temperature": temp,
        "feels_like": round(d["main"]["feels_like"]),
        "humidity": humidity,
        "condition": condition,
        "description": d["weather"][0]["description"],
        "wind_speed": wind,
        "rain_mm": d.get("rain", {}).get("1h", 0),
        "alerts": _gardening_alerts(temp, humidity, condition, wind),
    }


def _gardening_alerts(temp, humidity, condition, wind):
    c = condition.lower()
    alerts = []
    if temp >= 38:
        alerts.append("🔥 Extreme heat! Water only early morning or evening, and add a shade net for delicate plants.")
    elif temp >= 32:
        alerts.append("☀️ Hot day — mulch your pots and check soil moisture twice.")
    if "rain" in c or "drizzle" in c or "thunder" in c:
        alerts.append("🌧️ Rain expected — skip watering today and move small pots under shelter.")
    if humidity <= 30:
        alerts.append("💧 Very dry air — cover soil with dry leaves (mulch) to lock in moisture.")
    if wind >= 10:
        alerts.append("💨 Strong winds — stake tall plants (tomato, chilli) so they don't bend.")
    if not alerts:
        alerts.append("✅ Stable weather — a good day for your regular care routine!")
    return alerts


@app.get("/api/recommend")
def recommend_crops(soil: str, lat: float | None = None, lon: float | None = None, city: str | None = None):
    """Crop recommendations = soil type (from CNN) + live weather (Random Forest).
    Example: /api/recommend?soil=Red Soil
    """
    d = _fetch_openweather(lat, lon, city)
    weather = {
        "location": d.get("name", ""),
        "temperature": round(d["main"]["temp"]),
        "humidity": d["main"]["humidity"],
        "condition": d["weather"][0]["main"],
    }
    try:
        return get_recommendations(soil, weather)
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

class ChatMessage(BaseModel):
    role: str   # "user" | "bot"
    text: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    soil_context: str | None = None


@app.post("/api/chat")
def chat(req: ChatRequest):
    if not req.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
    try:
        reply = get_gemini_reply(
            [m.model_dump() for m in req.messages],
            soil_context=req.soil_context,
        )
        return {"success": True, "reply": reply}
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))    


@app.post("/api/soil/analyze")
async def analyze_soil(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        contents = await file.read()
        prediction = classifier.predict(contents)
        return {
            "success": True,
            "filename": file.filename,
            "data": prediction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)