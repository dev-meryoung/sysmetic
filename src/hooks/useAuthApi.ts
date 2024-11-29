import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { checkAuth, login, LoginRequestData, logout } from '@/api';
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
