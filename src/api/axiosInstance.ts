import axios from 'axios';
import CONFIG from '@/config';

const axiosInstance = axios.create({
  baseURL: CONFIG.API_URL,
});

export default axiosInstance;
