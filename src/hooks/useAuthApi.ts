import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { checkAuth, login, LoginRequestData, logout } from '@/api';
import { checkNickname } from '@/api/authApi';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';

export const useLogin = () => {
  const { setAuthState, resetAuthState } = useAuthStore();

  return useMutation({
    mutationFn: (loginData: LoginRequestData) => login(loginData),
    onSuccess: async () => {
      try {
        const authData = await checkAuth();
        setAuthState(authData.data);
      } catch (err) {
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

export const useCheckNickname = () =>
  useMutation({
    mutationFn: checkNickname,
    onSuccess: (data) => {
      if (data.code === 200) {
        console.log('사용가능 닉네임', data);
      } else if (data.code === 400) {
        console.log('중복된 닉네임', data);
      }
    },
    onError: (error) => {
      console.error('오류 발생 !', error);
    },
  });
