import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Menggunakan URL dari environment variable.
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
});

// Request interceptor untuk menambahkan token JWT ke header
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
