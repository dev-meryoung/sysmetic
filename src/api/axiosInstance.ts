import axios from 'axios';
import CONFIG from '@/config';

const axiosInstance = axios.create({
  baseURL: CONFIG.API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (res) => {
    const authHeader = res.headers['authorization'];

    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

      localStorage.setItem('token', token);
    }

    return res;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
