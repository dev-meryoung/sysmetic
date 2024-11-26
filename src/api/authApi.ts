import axiosInstance from '@/api/axiosInstance';

export interface LoginRequestData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// 로그인 API
export const login = async (loginData: LoginRequestData) => {
  const response = await axiosInstance.post('/v1/auth/login', loginData);

  return response.data;
};
