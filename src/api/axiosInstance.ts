import axios from 'axios';

const axiosInstance = axios.create({
  // 임시 작성, 구체화되면 추가 작업 예정
  baseURL: 'https://example.com',
});

export default axiosInstance;
