# 🌦 Weather Dashboard & Authentication App

![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express-API-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## Features

- User registration and login with JWT authentication
- Search weather by city name
- View current weather details
- Display 5-day weather forecast
- Save and manage favorite cities
- Responsive frontend design
- Backend caching for current weather results
  
## 👨‍💻 About This Project

This project demonstrates a full-stack weather application with authentication, API integration, and CRUD operations. It showcases real-world engineering practices including state management, secure authentication, and production-ready deployment structure.

## Setup

### Backend

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file from `.env.example`.
3. Set your MongoDB URI and OpenWeatherMap API key.
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create a `.env` file from `.env.example`.
3. Start the frontend app:
   ```bash
   npm start
   ```
## 🧠 Architecture

Frontend (React + Zustand)
        ↓
Backend (Express API)
        ↓
JWT Authentication Middleware
        ↓
MongoDB Database
        ↓
Weather API Integration

 
  
## Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather-dashboard
JWT_SECRET=your_jwt_secret_key_here
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running Tests
From the `backend` folder, install dev dependencies and run:
```bash
npm install
npm test
```

The tests cover registration, login, protected favorites access, weather endpoint behavior, and favorite city management.

## Environment Security
- Store secrets in backend `.env` files only.
- Do not expose `OPENWEATHER_API_KEY` to the frontend.
- Keep `.env` files out of source control using `.gitignore`.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/weather/{city}`
- `GET /api/forecast/{city}`
- `POST /api/favorites`
- `GET /api/favorites`
- `DELETE /api/favorites/{city}`
