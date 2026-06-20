import axios from 'axios';

const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 120000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - attach token
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      if (status === 401) {
        // Token expired or invalid - logout user
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      if (status === 404) {
        console.error('API endpoint not found. Check your Render backend URL.');
      }

      if (status === 500) {
        console.error('Backend server error.');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. Render free tier may be waking up, try again.');
    } else {
      console.error('Network error - backend may be down:', error.message);
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const loginUser    = (data) => API.post('/api/auth/login', data);
export const registerUser = (data) => API.post('/api/auth/register', data);
export const googleAuth   = (data) => API.post('/api/auth/google', data);

// Analysis APIs
export const analyzeText = (data) => API.post('/api/analysis/analyze', data);
export const getHistory   = ()     => API.get('/api/analysis/history');

export default API;