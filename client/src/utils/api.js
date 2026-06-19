import axios from 'axios';

const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const analyzeText = (data) => API.post('/api/analysis/analyze', data);
export const getHistory = () => API.get('/api/analysis/history');
export const loginUser = (data) => API.post('/api/auth/login', data);
export const registerUser = (data) => API.post('/api/auth/register', data);
export const googleAuth = (data) => API.post('/api/auth/google', data);