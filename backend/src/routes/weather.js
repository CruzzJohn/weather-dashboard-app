const express = require('express');
const axios = require('axios');
const WeatherCache = require('../models/WeatherCache');

const router = express.Router();

const OPENWEATHER_API = 'https://api.openweathermap.org/data/2.5';

/**
 * Centralized error handler
 */
const handleWeatherApiError = (err, res) => {
  if (err.response) {
    const status = err.response.status;

    if (status === 404) {
      return res.status(404).json({
        message: 'City not found. Please check the city name and try again.'
      });
    }

    if (status === 401) {
      return res.status(502).json({
        message: 'Weather service authentication failed. Check your API key.'
      });
    }

    if (status === 429) {
      return res.status(502).json({
        message: 'Weather service rate limit reached. Please try again later.'
      });
    }

    return res.status(502).json({
      message: 'Weather service returned an unexpected response.'
    });
  }

  if (err.request) {
    return res.status(502).json({
      message: 'Unable to reach the weather service. Please try again later.'
    });
  }

  console.error('Weather API error:', err);

  return res.status(500).json({
    message: 'Unexpected server error. Please try again later.'
  });
};

//
// 🌦️ FORECAST ROUTE (MUST BE FIRST)
//
router.get('/forecast/:city', async (req, res) => {
  try {
    const rawCity = req.params.city?.trim();

    if (!rawCity) {
      return res.status(400).json({
        message: 'City name is required.'
      });
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({
        message: 'Weather API key is not configured.'
      });
    }

    const response = await axios.get(`${OPENWEATHER_API}/forecast`, {
      params: {
        q: rawCity,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    return res.json({
      message: 'Forecast retrieved successfully',
      data: response.data
    });

  } catch (err) {
    handleWeatherApiError(err, res);
  }
});

//
// 🌤️ CURRENT WEATHER ROUTE
//
router.get('/:city', async (req, res) => {
  try {
    const rawCity = req.params.city?.trim();

    if (!rawCity) {
      return res.status(400).json({
        message: 'City name is required.'
      });
    }

    const city = rawCity.toLowerCase();

    // Check cache first
    const cached = await WeatherCache.findOne({
      city,
      expiresAt: { $gt: new Date() }
    });

    if (cached) {
      return res.json({
        message: 'Current weather retrieved (cached)',
        data: cached.weatherData
      });
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({
        message: 'Weather API key is not configured.'
      });
    }

    const response = await axios.get(`${OPENWEATHER_API}/weather`, {
      params: {
        q: rawCity,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const weatherData = response.data;

    // Save to cache
    await WeatherCache.updateOne(
      { city },
      {
        city,
        country: weatherData.sys.country,
        latitude: weatherData.coord.lat,
        longitude: weatherData.coord.lon,
        weatherData,
        lastUpdated: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000)
      },
      { upsert: true }
    );

    return res.json({
      message: 'Current weather retrieved',
      data: weatherData
    });

  } catch (err) {
    handleWeatherApiError(err, res);
  }
});

module.exports = router;
