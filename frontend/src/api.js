import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});


export const getWeather = (city) =>
  API.get(`/weather/${city}`);


export const getForecast = (city) =>
  API.get(`/weather/forecast/${city}`);

export const addFavorite = (data, token) =>
  API.post("/favorites", data, {
    headers: { 
        Authorization: `Bearer ${token}` 
    },
  });

export const getFavorites = (token) =>
  API.get("/favorites", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteFavorite = (city, token) =>
  API.delete(`/favorites/${city}`, {
    headers: { Authorization: `Bearer ${token}` }
  });