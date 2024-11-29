import axiosInstance from '@/api/axiosInstance';

export interface UpdateUserData {
  userId: number;
  phoneNumber: string;
  profileImage: string | File;
  nickName: String;
  nickNameDuplCheck: boolean;
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

// 회원 정보 조회 API
// export const getUser = async () => {};

// 회원 정보 수정 API
export const updateUser = async (updateUserData: UpdateUserData | FormData) => {
  const isFormData = updateUserData instanceof FormData;

  const response = await axiosInstance.patch(
    `/v1/member/info`,
    updateUserData,
    {
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
    }
  );

  return response.data;
};

// 회원 비밀번호 수정 API
export const updatePassword = async (
  updatePasswordData: UpdatePasswordData
) => {
  const response = await axiosInstance.patch(
    `/v1/member/info/password`,
    updatePasswordData
  );
  return response.data;
};

// 회원 정보성 수신동의 변경 API
export const updateOpt = async (updateOptData: UpdateOptData) => {
  const response = await axiosInstance.patch(
    `/v1/member/consent`,
    updateOptData
  );
  return response.data;
};

// 회원 탈퇴 API
export const deleteUser = async () => {
  const response = await axiosInstance.post('/v1/member/{id}');
  return response.data;
};
