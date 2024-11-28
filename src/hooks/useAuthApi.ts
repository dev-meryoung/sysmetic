import { useMutation } from '@tanstack/react-query';
import { login, LoginRequestData, logout } from '@/api';

export const useLogin = () =>
  useMutation({
    mutationFn: (loginData: LoginRequestData) => login(loginData),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: logout,
  });
