import { useState } from "react";
import { Sun, Moon, Cloud, Droplets, Wind, MapPin, Pencil, Check } from "lucide-react";
import { setPreferredCity } from "../services/weatherService";

const getBarTheme = (description, isNight) => {
  const desc = (description || "").toLowerCase();

  if (isNight) {
    return { bg: "from-indigo-950 via-indigo-900 to-slate-900", text: "text-white", chip: "bg-white/10" };
  }
  if (desc.includes("rain") || desc.includes("drizzle") || desc.includes("thunder")) {
    return { bg: "from-slate-600 via-slate-700 to-slate-800", text: "text-white", chip: "bg-white/10" };
  }
  if (desc.includes("cloud") || desc.includes("mist") || desc.includes("fog") || desc.includes("haze")) {
    return { bg: "from-slate-300 via-slate-200 to-slate-400", text: "text-slate-800", chip: "bg-black/5" };
  }
  return { bg: "from-amber-300 via-yellow-200 to-orange-300", text: "text-slate-900", chip: "bg-black/5" };
};

const AnimatedSkyIcon = ({ description, isNight }) => {
  const desc = (description || "").toLowerCase();

  if (isNight) {
    return (
      <span className="relative inline-flex shrink-0">
        <Moon size={24} className="text-indigo-100" />
        <span className="phw-star absolute -top-1.5 -right-2 text-[8px] text-white">✦</span>
        <span className="phw-star phw-star-2 absolute -bottom-1 -right-3 text-[7px] text-white">✦</span>
      </span>
    );
  }
  if (desc.includes("rain") || desc.includes("drizzle") || desc.includes("thunder")) {
    return (
      <span className="relative inline-flex shrink-0">
        <Cloud size={24} className="text-slate-100" />
        <span className="phw-drop absolute -bottom-1 left-2.5 w-[3px] h-[6px] bg-sky-200 rounded-full"></span>
        <span className="phw-drop phw-drop-2 absolute -bottom-1 left-6 w-[3px] h-[6px] bg-sky-200 rounded-full"></span>
      </span>
    );
  }
  if (desc.includes("cloud") || desc.includes("mist") || desc.includes("fog") || desc.includes("haze")) {
    return <Cloud size={24} className="phw-drift text-white shrink-0" />;
  }
  return <Sun size={24} className="phw-glow text-amber-500 shrink-0" />;
};

const WeatherBar = ({ weather, forceNight = null, onCitySaved }) => {
  const [editing, setEditing] = useState(false);
  const [cityInput, setCityInput] = useState("");

  const hour = new Date().getHours();
  const isNight = forceNight ?? (hour >= 18 || hour <= 5);

  if (!weather) return null;

  const theme = getBarTheme(weather.description, isNight);
  const alert = weather.alerts?.[0];

  const saveCity = () => {
    const city = cityInput.trim();
    if (city) {
      setPreferredCity(city);
      onCitySaved?.(city);
    }
    setEditing(false);
  };

  return (
    <div
      className={`w-full bg-gradient-to-r ${theme.bg} ${theme.text} rounded-xl shadow-sm px-4 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm`}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .phw-glow { animation: phw-glow 3s ease-in-out infinite; }
          .phw-drift { animation: phw-drift 5s ease-in-out infinite; }
          .phw-star { animation: phw-twinkle 2.2s ease-in-out infinite; }
          .phw-star-2 { animation-delay: .8s; }
          .phw-drop { animation: phw-fall 1.4s linear infinite; }
          .phw-drop-2 { animation-delay: .7s; }
        }
        @keyframes phw-glow { 0%,100% { filter: drop-shadow(0 0 2px rgba(245,158,11,.5)); } 50% { filter: drop-shadow(0 0 7px rgba(245,158,11,.9)); } }
        @keyframes phw-drift { 0%,100% { transform: translateX(-2px); } 50% { transform: translateX(3px); } }
        @keyframes phw-twinkle { 0%,100% { opacity:.25; } 50% { opacity:1; } }
        @keyframes phw-fall { 0% { transform: translateY(-2px); opacity:0; } 25% { opacity:1; } 100% { transform: translateY(7px); opacity:0; } }
      `}</style>

      <AnimatedSkyIcon description={weather.description} isNight={isNight} />

      {editing ? (
        <span className="flex items-center gap-1">
          <input
            autoFocus
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveCity();
              if (e.key === "Escape") setEditing(false);
            }}
            placeholder="City name"
            className="w-28 rounded-md px-1.5 py-0.5 text-sm text-slate-900 bg-white/90 outline-none"
          />
          <button onClick={saveCity} className="opacity-80 hover:opacity-100"><Check size={14} /></button>
        </span>
      ) : (
        <button
          onClick={() => { setCityInput(weather.location); setEditing(true); }}
          className="font-semibold flex items-center gap-1 hover:underline underline-offset-2"
          title="Click to change your city"
        >
          <MapPin size={13} className="opacity-70" />
          {weather.location}
          <Pencil size={11} className="opacity-50" />
        </button>
      )}

      <span className="capitalize opacity-80 text-xs hidden sm:inline">{weather.description}</span>

      <span className="font-bold text-base leading-none">{weather.temperature}°C</span>
      <span className="opacity-70 text-xs">feels {weather.feels_like}°</span>

      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${theme.chip}`}>
        <Droplets size={12} /> {weather.humidity}%
      </span>
      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${theme.chip}`}>
        <Wind size={12} /> {weather.wind_speed} m/s
      </span>

      {alert && (
        <span className="flex-1 min-w-[180px] text-xs opacity-90 truncate text-left md:text-right" title={alert}>
          🌱 {alert}
        </span>
      )}
    </div>
  );
};

export default WeatherBar;