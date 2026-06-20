import axios from 'axios';

// This safely switches between local testing and live Vercel URL
const API_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:8000/api/' : '/api/';

export const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default authClient;
