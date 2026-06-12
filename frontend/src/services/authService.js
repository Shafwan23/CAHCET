import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';
let API_URL = import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:5000/api/v1' : '/api/v1');

// Ensure VITE_API_URL includes /api/v1 if it was only provided as the base domain
if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.endsWith('/api/v1')) {
  API_URL = `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/v1`;
}

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor to attach the token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor to handle expired tokens
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch custom event to notify AuthContext to log out
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  }
};

export default apiClient;
