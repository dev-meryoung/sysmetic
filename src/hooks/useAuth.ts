import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, LoginRequestData } from '@/api';
import { PATH } from '@/constants/path';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (loginData: LoginRequestData) => login(loginData),

    onSuccess: () => {
      navigate(PATH.ROOT);
    },

    onError: (err) => {
      console.error('로그인 실패:', err.message);
    },
  });
};
