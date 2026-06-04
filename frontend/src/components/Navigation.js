import React from 'react';
import useAuthStore from '../context/authStore';
import '../styles/Navigation.css';

const Navigation = () => {
  const { user, logout, token } = useAuthStore();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">Weather Dashboard</div>
        <div className="navbar-actions">
          {token && user ? (
            <>
              <span className="username">Welcome, {user.username}</span>
              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <span className="guest-text">Login to manage favorites</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
