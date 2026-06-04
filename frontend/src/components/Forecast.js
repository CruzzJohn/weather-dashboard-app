import React, { useEffect, useState } from "react";
import useWeatherStore from "../context/weatherStore";
import { getForecast } from "../api";
import "../styles/Forecast.css";

const Forecast = () => {
  const { currentWeather } = useWeatherStore();
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const city = currentWeather?.name;
    if (!city) return;

    const loadForecast = async () => {
      try {
        const res = await getForecast(city);

        const list = res.data.data.list;

        const daily = list.filter((_, i) => i % 8 === 0);

        setForecast(daily);
      } catch (err) {
        console.error("Forecast error:", err);
      }
    };

    loadForecast();
  }, [currentWeather]);

  if (!currentWeather) return null;

  return (
    <div className="forecast-container">
      <h2>5-Day Forecast for {currentWeather.name}</h2>

      <div className="forecast-grid">
        {forecast.map((day, i) => (
          <div key={i} className="forecast-card">
            <p>{new Date(day.dt * 1000).toDateString()}</p>
            <p>{Math.round(day.main.temp)}°C</p>
            <p>{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;