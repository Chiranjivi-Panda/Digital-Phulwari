import { useEffect, useState } from "react";
import WeatherBar from "./WeatherBar";
import { fetchWeather } from "../services/weatherService";

const WeatherCard = ({ forceNight = null }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const loadCity = (city) => {
    fetchWeather({ city }).then(setWeather).catch(() => {});
  };

  useEffect(() => {
    let cancelled = false;

    // 1) INSTANT: preferred (or default) city — waits for nothing
    fetchWeather({})
      .then((data) => { if (!cancelled) setWeather(data); })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.detail || "Failed to fetch weather"); });

    // 2) Silent refine ONLY if permission was ALREADY granted.
    //    Never opens the popup — the popup was the 2-minute delay.
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((status) => {
          if (status.state !== "granted") return;
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const data = await fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                if (!cancelled) setWeather(data);
              } catch { /* keep city data */ }
            },
            () => {},
            { timeout: 5000 }
          );
        })
        .catch(() => {});
    }

    return () => { cancelled = true; };
  }, []);

  if (error) return <p className="text-red-500 text-xs px-1">{error}</p>;
  if (!weather) return <div className="w-full h-11 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>;

  return <WeatherBar weather={weather} forceNight={forceNight} onCitySaved={loadCity} />;
};

export default WeatherCard;