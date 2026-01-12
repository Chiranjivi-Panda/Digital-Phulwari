import { useEffect, useState } from "react";
import WeatherHero from "./WeatherHero";

const API_KEY = "ccbd267d3d0311d76290c1068d24bdb7";

const WeatherCard = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          );

          if (!res.ok) throw new Error("Failed to fetch weather");

          const data = await res.json();
          setWeather(data);
        } catch (err) {
          setError(err.message);
        }
      },
      () => setError("Location permission denied")
    );
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!weather) return <p>Loading weather...</p>;

  return (
    <div className="w-full">
      <WeatherHero weather={weather} />
    </div>
  );
};

export default WeatherCard;
