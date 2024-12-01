import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  checkAuth,
  login,
  LoginRequestData,
  logout,
  findEmail,
  FindEmailData,
  checkEmailCodeForPassword,
  CheckEmailCodeForPasswordData,
  resetPassword,
  ResetPasswordData,
  sendEmailCodeForPassword,
  checkNickname,
} from '@/api';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuthState, resetAuthState } = useAuthStore();

  return useMutation({
    mutationFn: (loginData: LoginRequestData) => login(loginData),
    onSuccess: async () => {
      try {
        const authData = await checkAuth();
        setAuthState(authData.data);
        navigate(PATH.ROOT);
      } catch {
        resetAuthState();
      }
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { resetAuthState } = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      resetAuthState();
      navigate(PATH.ROOT);
    },
  });
};

export const useFindEmail = () =>
  useMutation({
    mutationFn: (findEmailData: FindEmailData) => findEmail(findEmailData),
  });

export const useSendEmailCodeForPassword = () =>
  useMutation({
    mutationFn: (email: string) => sendEmailCodeForPassword(email),
  });

export const useCheckEmailCodeForPassword = () =>
  useMutation({
    mutationFn: (checkEmailCodeForPasswordData: CheckEmailCodeForPasswordData) =>
      checkEmailCodeForPassword(checkEmailCodeForPasswordData),
  });

export const useReset = () =>
  useMutation({
    mutationFn: (resetPasswordData: ResetPasswordData) => resetPassword(resetPasswordData),
  });

export const useCheckNickname = () =>
  useMutation({
    mutationFn: checkNickname,
  });