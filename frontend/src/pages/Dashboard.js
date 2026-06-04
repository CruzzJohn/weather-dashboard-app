import React, { useState } from 'react';
import useAuthStore from '../context/authStore';
import WeatherSearch from '../components/WeatherSearch';
import Forecast from '../components/Forecast';
import Favorites from '../components/Favorites';
import Login from '../components/Login';
import Register from '../components/Register';

const Dashboard = () => {
  const { token } = useAuthStore();
  const [authMode, setAuthMode] = useState('login');
  const [showAuth, setShowAuth] = useState(!token);



  return (
    <div className="dashboard">

      {!token && showAuth && (
        <div className="auth-panel">
          {authMode === 'login' ? (
            <Login onSuccess={() => setShowAuth(false)} />
          ) : (
            <Register onSuccess={() => setShowAuth(false)} />
          )}

          <p className="toggle-auth">
            {authMode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}

            <button
              className="toggle-button"
              onClick={() =>
                setAuthMode(authMode === 'login' ? 'register' : 'login')
              }
            >
              {authMode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      )}

      {token && <p className="welcome-message">Welcome back! Manage your favorites below.</p>}
      <WeatherSearch />

      <Favorites />

      {/* 🌤 Forecast now receives city */}
      <Forecast />
    </div>
  );
};

export default Dashboard;