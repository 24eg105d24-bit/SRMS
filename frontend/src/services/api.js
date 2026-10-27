import axios from 'axios';

// Use relative URL '/api' which Vite proxies to localhost:8080 in dev,
// or fallback to localhost:8080 if running standalone
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
