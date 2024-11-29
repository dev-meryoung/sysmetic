// User API 관련 Hook
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

export const useUpdateUser = () => {
  const { setAuthState } = useAuthStore();

  return useMutation({
    mutationFn: (formData: FormData) => updateUser(formData),
    onSuccess: (updatedData) => {
      setAuthState({
        isLoggedIn: true,
        memberId: updatedData.userId,
        email: updatedData.email,
        nickname: updatedData.nickName,
        roleCode: updatedData.roleCode,
        profileImage: updatedData.profileImage,
        // phoneNumber: updatedData.phoneNumber 아직 값이 없어서 나중에 수정
      });
    },
  });
};

export const useUpdatePassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (passwordData: UpdatePasswordData) =>
      updatePassword(passwordData),
    onSuccess: () => {
      navigate(PATH.MYPAGE_PROFILE());
    },
  });
};

export const useUpdateOpt = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (updateOptData: UpdateOptData) => updateOpt(updateOptData),
    onSuccess: () => {
      navigate(PATH.MYPAGE_PROFILE());
    },
  });
};

export const useDeleteUser = () => {
  const navigate = useNavigate();
  const { resetAuthState } = useAuthStore();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      resetAuthState();
      navigate(PATH.SIGN_IN);
    },
  });
};
