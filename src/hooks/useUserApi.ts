import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  updateUser,
  updatePassword,
  UpdatePasswordData,
  updateOpt,
  UpdateOptData,
  deleteUser,
} from '@/api';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';

// 회원 정보 수정
export const useUpdateUser = () => {
  const navigate = useNavigate();
  const { initializeAuth } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      formData,
      userId,
    }: {
      formData: FormData;
      userId: number;
    }) => {
      const response = await updateUser(formData, userId);
      return response;
    },
    onSuccess: async () => {
      await initializeAuth();
    },
  });
};

// 비밀번호 수정
export const useUpdatePassword = () =>
  useMutation({
    mutationFn: async (passwordData: UpdatePasswordData) => {
      const response = await updatePassword(passwordData);
      return response;
    },
  });

// 수신 동의 상태 변경
export const useUpdateOpt = () =>
  useMutation({
    mutationFn: async ({
      userId,
      updateOptData,
    }: {
      userId: number;
      updateOptData: UpdateOptData;
    }) => updateOpt(userId, updateOptData),
  });

// 회원 탈퇴
export const useDeleteUser = () => {
  const navigate = useNavigate();
  const { resetAuthState } = useAuthStore();

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await deleteUser(userId);
      return response;
    },
    onSuccess: () => {
      resetAuthState();
      navigate(PATH.SIGN_IN);
    },
  });
};
