import axiosInstance from '@/api/axiosInstance';

export interface UpdateUserData {
  userId: number;
  phoneNumber: string;
  file: string | File;
  nickname: string;
  nicknameDuplCheck: boolean;
}

export interface UpdatePasswordData {
  userId: number;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface UpdateOptData {
  receiveInfoConsent: boolean;
  receiveMarketingConsent: boolean;
}

// 회원 정보 수정 API
export const updateUser = async (updateUserData: FormData, userId: number) => {
  const response = await axiosInstance.patch(
    `/v1/member/info/${userId}`,
    updateUserData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// 회원 비밀번호 수정 API
export const updatePassword = async (PasswordData: UpdatePasswordData) => {
  const response = await axiosInstance.patch(
    `/v1/member/info/${PasswordData.userId}/password`,
    PasswordData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

// 회원 정보성 수신동의 변경 API
export const updateOpt = async (
  userId: number,
  updateOptData: UpdateOptData
) => {
  const response = await axiosInstance.patch(
    `/v1/member/consent/${userId}`,
    updateOptData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

// 회원 탈퇴 API
export const deleteUser = async (userId: number) => {
  const response = await axiosInstance.delete(`/v1/member/${userId}`);
  return response.data;
};
