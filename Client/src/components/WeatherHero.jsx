import {
  Sun,
  Moon,
  Droplets,
  Wind,
} from "lucide-react";

const getWeatherTheme = (description, isNight) => {
  const desc = description.toLowerCase();

  if (desc.includes("rain")) {
    return {
      bg: "from-slate-700 to-slate-900",
      text: "text-white",
      advice: "Avoid watering today, let nature help 🌧️",
    };
  }

  if (desc.includes("cloud")) {
    return {
      bg: "from-gray-400 to-gray-600",
      text: "text-white",
      advice: "Good day for leafy plants 🌿",
    };
  }

  if (isNight) {
    return {
      bg: "from-indigo-900 to-black",
      text: "text-white",
      advice: "Night time — plants are resting 🌙",
    };
  }

  return {
    bg: "from-yellow-300 to-orange-400",
    text: "text-black",
    advice: "Great sunlight! Water early morning ☀️",
  };
};

export default function WeatherHero({ weather }) {
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour <= 5;

  const theme = getWeatherTheme(weather.description, isNight);

  // Prefer the backend's smart alert (uses temp/humidity/wind); fallback to theme advice
  const advice = weather.alerts?.[0] || theme.advice;

  return (
    <section
      className={`w-full min-h-[260px] bg-gradient-to-br ${theme.bg} ${theme.text} rounded-2xl overflow-hidden`}
    >
      <div className="p-6 flex flex-col justify-between h-full">
        {/* Top */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              {weather.location}
            </h1>
            <p className="capitalize opacity-90">
              {weather.description}
            </p>
          </div>

          {isNight ? <Moon size={42} /> : <Sun size={42} />}
        </div>

        {/* Middle */}
        <div>
          <p className="text-5xl font-semibold">
            {weather.temperature}°C
          </p>
          <p className="opacity-90">
            Feels like {weather.feels_like}°C
          </p>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Droplets size={16} />
              {weather.humidity}%
            </span>
            <span className="flex items-center gap-1">
              <Wind size={16} />
              {weather.wind_speed} m/s
            </span>
          </div>

          <div className="bg-black/20 px-4 py-2 rounded-xl">
            🌱 {advice}
          </div>
        </div>
      </div>
    </section>
  );
}