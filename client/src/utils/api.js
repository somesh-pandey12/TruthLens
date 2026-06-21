import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (error.response?.status === 404) console.error('API endpoint not found.');
    if (error.response?.status === 500) console.error('Backend server error.');
    if (error.code === 'ECONNABORTED') console.error('Request timed out.');
    return Promise.reject(error);
  }
);

export const loginUser    = (data) => API.post('/api/auth/login', data);
export const registerUser = (data) => API.post('/api/auth/register', data);
export const googleAuth   = (data) => API.post('/api/auth/google', data);
export const analyzeText  = (data) => API.post('/api/analysis/analyze', data);
export const getHistory   = ()     => API.get('/api/analysis/history');

export default API;