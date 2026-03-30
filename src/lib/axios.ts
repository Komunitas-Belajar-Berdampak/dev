import axios from 'axios';
import { getToken, removeToken, removeUser } from './authStorage';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url ?? '');
    const isLoginRequest = requestUrl.includes('/auth/login');
    const isOnLoginPage = window.location.pathname === '/auth/login';

    if (status === 401 && !isLoginRequest) {
      removeToken();
      removeUser();

      if (!isOnLoginPage) {
        window.location.assign('/auth/login');
      }
    }

    return Promise.reject(error);
  },
);
