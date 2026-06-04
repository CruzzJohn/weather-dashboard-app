import { create } from "zustand";
import axios from "axios";

const useWeatherStore = create((set) => ({
  currentWeather: null,
  weatherLoading: false,
  weatherError: null,

  fetchWeather: async (city) => {
    if (!city) return;

    set({ weatherLoading: true, weatherError: null });

    try {
      const res = await axios.get(
        `http://localhost:5000/api/weather/${city}`
      );

      // IMPORTANT: normalize data shape
      set({
        currentWeather: res.data.data,
        weatherLoading: false,
        weatherError: null
      });
    } catch (err) {
      set({
        weatherError: err.response?.data?.message || "Failed to fetch weather",
        weatherLoading: false
      });
    }
  },

  addFavorite: async (name, country, lat, lon, token) => {
  try {
    return await axios.post(
      "http://localhost:5000/api/favorites",
      {
        city: name,
        country,
        latitude: lat,
        longitude: lon,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  } catch (err) {
    throw err;
  }
},
}));

export default useWeatherStore;