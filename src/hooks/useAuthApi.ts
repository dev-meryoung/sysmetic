import { useMutation } from '@tanstack/react-query';
import {
  login,
  LoginRequestData,
  logout,
  findEmail,
  FindEmailData,
  checkEmailCodeForPassword,
  EmailCodeData,
  resetPassword,
  ResetPwData,
} from '@/api';

export const useLogin = () =>
  useMutation({
    mutationFn: (loginData: LoginRequestData) => login(loginData),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: logout,
  });

export const useFindEmail = () =>
  useMutation({
    mutationFn: (findEmailData: FindEmailData) => findEmail(findEmailData),
  });

export const useCheckEmailCodeForPassword = () =>
  useMutation({
    mutationFn: (codeData: EmailCodeData) =>
      checkEmailCodeForPassword(codeData),
  });

export const useReset = () =>
  useMutation({
    mutationFn: (passwordData: ResetPwData) => resetPassword(passwordData),
  });
