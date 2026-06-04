import React, { useState } from 'react';
import useWeatherStore from '../context/weatherStore';
import useAuthStore from '../context/authStore';
import '../styles/WeatherSearch.css';

const WeatherSearch = () => {
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');

  const {
    currentWeather,
    fetchWeather,
    addFavorite,
    weatherLoading,
    weatherError
  } = useWeatherStore();

  const token = localStorage.getItem("token");

  const handleSearch = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!city.trim()) {
      setMessage('Please enter a city name.');
      return;
    }

    try {
      await fetchWeather(city.trim());
    } catch (err) {
      console.log("SEARCH ERROR:", err);
    }
  };
const handleAddFavorite = async () => {
  const token = localStorage.getItem("token");

  console.log("TOKEN FROM LOCALSTORAGE:", token);

  if (!token) {
    setMessage("You must login first.");
    return;
  }

  try {
    await addFavorite(
      currentWeather.name,
      currentWeather.sys.country,
      currentWeather.coord.lat,
      currentWeather.coord.lon,
      token
    );

    setMessage(`${currentWeather.name} was added to favorites.`);
  } catch (err) {
    setMessage(err.response?.data?.message || "Unable to add favorite.");
  }
};

  return (
    <section className="weather-search-container">
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city name..."
            className="search-input"
          />

          <button
            type="submit"
            className="search-button"
            disabled={weatherLoading}
          >
            {weatherLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {(weatherError || message) && (
        <div className="error-message">
          {weatherError || message}
        </div>
      )}

      {currentWeather && (
        <div className="weather-card">
          <div className="weather-header">
            <h2>
              {currentWeather.name}, {currentWeather.sys?.country}
            </h2>

            {token && (
              <button
                className="favorite-button"
                onClick={handleAddFavorite}
              >
                Add to favorites
              </button>
            )}
          </div>

          <div className="weather-info">
            <div className="temperature">
              <span className="temp-value">
                {Math.round(currentWeather.main?.temp)}°C
              </span>
              <span className="weather-desc">
                {currentWeather.weather?.[0]?.main}
              </span>
            </div>

            <div className="weather-details">
              <p>Feels like: {Math.round(currentWeather.main?.feels_like)}°C</p>
              <p>Humidity: {currentWeather.main?.humidity}%</p>
              <p>Pressure: {currentWeather.main?.pressure} hPa</p>
              <p>Wind: {currentWeather.wind?.speed} m/s</p>
            </div>
          </div>

          {!token && (
            <p className="favorite-note">
              Login to save this city to favorites.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default WeatherSearch;