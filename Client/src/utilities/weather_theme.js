export function getWeatherTheme(condition, isNight) {
  const text = condition.toLowerCase();

  if (isNight) {
    return {
      bg: "from-slate-900 via-slate-800 to-slate-700",
      text: "text-white",
      overlay: "bg-black/40",
      advice: "🌙 Night time — avoid watering, let soil breathe"
    };
  }

  if (text.includes("rain")) {
    return {
      bg: "from-blue-800 via-blue-700 to-indigo-800",
      text: "text-white",
      overlay: "bg-black/30",
      advice: "🌧 Rainy weather — stop watering & ensure drainage"
    };
  }

  if (text.includes("cloud")) {
    return {
      bg: "from-slate-400 via-slate-300 to-slate-500",
      text: "text-slate-900",
      overlay: "bg-white/30",
      advice: "☁ Cloudy day — ideal for leafy greens"
    };
  }

  return {
    bg: "from-yellow-300 via-orange-400 to-yellow-500",
    text: "text-slate-900",
    overlay: "bg-white/30",
    advice: "☀️ Sunny day — give plants morning sunlight"
  };
}
