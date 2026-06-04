const request = require('supertest');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const app = require('../index');

jest.mock('axios');

const User = require('../models/User');
const WeatherCache = require('../models/WeatherCache');

jest.mock('../models/User', () => {
  const mongoose = require('mongoose');
  const mockModel = function (doc) {
    Object.assign(this, doc);
  };
  mockModel.findOne = jest.fn();
  mockModel.findById = jest.fn();
  mockModel.prototype.save = jest.fn();
  return mockModel;
});

jest.mock('../models/WeatherCache', () => ({
  findOne: jest.fn(),
  updateOne: jest.fn()
}));

describe('Backend reliability tests', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'testsecret';
    process.env.OPENWEATHER_API_KEY = 'dummy';
    axios.get.mockReset();
    User.findOne.mockReset();
    User.findById.mockReset();
    User.prototype.save.mockReset();
    WeatherCache.findOne.mockReset();
    WeatherCache.updateOne.mockReset();
  });

  test('User registration and login flow works and rejects invalid credentials', async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.prototype.save.mockResolvedValueOnce();

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toHaveProperty('token');
    expect(registerResponse.body.user).toMatchObject({ username: 'testuser', email: 'test@example.com' });

    const hashedPassword = await bcrypt.hash('password123', 10);
    User.findOne.mockResolvedValueOnce({
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      favoriteCities: []
    });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body.user.email).toBe('test@example.com');

    User.findOne.mockResolvedValueOnce({
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      favoriteCities: []
    });

    const failedLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(failedLoginResponse.status).toBe(401);
    expect(failedLoginResponse.body.message).toMatch(/Invalid email or password/);
  });

  test('Protected favorites endpoints require auth and allow favorite city management', async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.prototype.save.mockResolvedValueOnce();

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'favoriteuser', email: 'fav@example.com', password: 'password123' });

    const token = registerResponse.body.token;
    expect(token).toBeDefined();

    const unauthorizedResponse = await request(app).get('/api/favorites');
    expect(unauthorizedResponse.status).toBe(401);
    expect(unauthorizedResponse.body.message).toMatch(/Authentication required/);

    const favoriteUser = {
      _id: 'user123',
      favoriteCities: [],
      save: jest.fn().mockResolvedValueOnce()
    };
    User.findById.mockResolvedValueOnce(favoriteUser);

    const emptyFavoritesResponse = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(emptyFavoritesResponse.status).toBe(200);
    expect(Array.isArray(emptyFavoritesResponse.body.favoriteCities)).toBe(true);
    expect(emptyFavoritesResponse.body.favoriteCities).toHaveLength(0);

    favoriteUser.favoriteCities = [];
    User.findById.mockResolvedValueOnce(favoriteUser);

    const addFavoriteResponse = await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ city: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522 });

    expect(addFavoriteResponse.status).toBe(201);
    expect(addFavoriteResponse.body.favoriteCities).toHaveLength(1);
    expect(addFavoriteResponse.body.favoriteCities[0].city).toBe('Paris');

    favoriteUser.favoriteCities = [{ city: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522 }];
    User.findById.mockResolvedValueOnce(favoriteUser);

    const deleteFavoriteResponse = await request(app)
      .delete('/api/favorites/Paris')
      .set('Authorization', `Bearer ${token}`);

    expect(deleteFavoriteResponse.status).toBe(200);
    expect(deleteFavoriteResponse.body.favoriteCities).toHaveLength(0);
  });

  test('Weather endpoints integrate with external API and handle invalid city names', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/weather')) {
        return Promise.resolve({ data: { name: 'London', main: { temp: 18 }, weather: [{ description: 'Cloudy' }], sys: { country: 'GB' }, coord: { lat: 51.51, lon: -0.13 } } });
      }
      if (url.includes('/forecast')) {
        return Promise.resolve({ data: { city: { name: 'London' }, list: [] } });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    WeatherCache.findOne.mockResolvedValueOnce(null);
    WeatherCache.updateOne.mockResolvedValueOnce();

    const weatherResponse = await request(app).get('/api/weather/London');
    expect(weatherResponse.status).toBe(200);
    expect(weatherResponse.body.message).toMatch(/Current weather retrieved/);
    expect(weatherResponse.body.data.name).toBe('London');
    expect(weatherResponse.body.data.main.temp).toBe(18);

    const forecastResponse = await request(app).get('/api/forecast/London');
    expect(forecastResponse.status).toBe(200);
    expect(forecastResponse.body.message).toMatch(/Forecast retrieved successfully/);
    expect(forecastResponse.body.data.city.name).toBe('London');

    axios.get.mockRejectedValueOnce({ response: { status: 404 } });
    const invalidCityResponse = await request(app).get('/api/weather/InvalidTown');
    expect(invalidCityResponse.status).toBe(404);
    expect(invalidCityResponse.body.message).toMatch(/City not found/);
  });
});
