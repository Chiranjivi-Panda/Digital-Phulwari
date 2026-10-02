import { useEffect, useState } from "react";
import WeatherBar from "./WeatherBar";
import {
  fetchWeather,
  getPreferredCity,
  getSavedCoords,
  saveCoords,
} from "../services/weatherService";

const WeatherCard = ({ forceNight = null }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const show = (params) =>
      fetchWeather(params)
        .then((d) => { if (!cancelled) setWeather(d); })
        .catch((err) => {
          if (!cancelled) setError(err.response?.data?.detail || "Failed to fetch weather");
        });

    // 1) INSTANT load — pinned city → saved coords → default city
    const city = getPreferredCity();
    const coords = getSavedCoords();
    if (city) {
      show({ city });
    } else if (coords) {
      show({ lat: coords.lat, lon: coords.lon });
    } else {
      show({});
    }

    // 2) Background GPS refine — ONLY if no pinned city AND permission already granted.
    //    Never opens the popup. maximumAge lets the browser return a cached fix instantly.
    if (!city && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((status) => {
          if (status.state !== "granted") return;
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude: lat, longitude: lon } = pos.coords;
              saveCoords(lat, lon);
              try {
                const d = await fetchWeather({ lat, lon });
                if (!cancelled) setWeather(d);
              } catch { /* keep whatever we already showed */ }
            },
            () => {},
            { timeout: 4000, maximumAge: 10 * 60 * 1000 }
          );
        })
        .catch(() => {});
    }

    return () => { cancelled = true; };
  }, []);

  if (error) return <p className="text-red-500 text-xs px-1">{error}</p>;
  if (!weather) return <div className="w-full h-11 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>;

  return <WeatherBar weather={weather} forceNight={forceNight} />;
};

export default WeatherCard;