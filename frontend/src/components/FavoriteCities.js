import { useEffect, useState } from "react";
import useWeatherStore from "../context/weatherStore";
import { getForecast } from "../api";

const Forecast = () => {
  const { currentWeather } = useWeatherStore();
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const city = currentWeather?.name;

    if (!city) return;

    const fetchForecast = async () => {
      try {
        const res = await getForecast(city);

        const list = res.data?.list || res.data?.data?.list || [];

        // take one reading per day (every 8th item = 24h)
        const daily = list.filter((_, i) => i % 8 === 0);

        setForecast(daily);
     } catch (err) {
       console.error("Forecast error:", err.response?.data || err.message);
     } 
    };

    fetchForecast();
  }, [currentWeather]);

  if (!currentWeather) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>5-Day Forecast for {currentWeather.name}</h2>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {forecast.map((day, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px" }}>
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