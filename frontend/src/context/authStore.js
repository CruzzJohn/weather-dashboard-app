import { create } from 'zustand';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const storedUser = JSON.parse(localStorage.getItem('authUser') || 'null');

const useAuthStore = create((set) => ({
  user: storedUser,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, { username, email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('authUser', JSON.stringify(response.data.user));
      set({ user: response.data.user, token: response.data.token, isLoading: false });
      return response.data;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Registration failed' });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
      
      console.log("LOGIN RESPONSE FULL:", response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('authUser', JSON.stringify(response.data.user));
      set({ user: response.data.user, token: response.data.token, isLoading: false });
      return response.data;
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.message || 'Login failed' });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    set({ user: null, token: null });
  },

  setUser: (user) => {
    localStorage.setItem('authUser', JSON.stringify(user));
    set({ user });
  }
}));

export default useAuthStore;
