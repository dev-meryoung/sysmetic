import axiosInstance from '@/api/axiosInstance';

export interface LoginRequestData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface CheckEmailCodeData {
  email: string;
  authCode: string;
}

export interface FindEmailData {
  name: string;
  phoneNumber: string;
}

export interface CheckEmailCodeForPasswordData {
  email: string;
  authCode: string;
}

export interface ResetPasswordData {
  emailAuthCode: string;
  email: string;
  password: string;
  rewritePassword: string;
}

// 로그인 API
export const login = async (loginData: LoginRequestData) => {
  const response = await axiosInstance.post('/v1/auth/login', loginData);
  return response.data;
};

// Token 유효성 검증 및 회원 정보 조회 API
export const checkAuth = async () => {
  const response = await axiosInstance.get('/v1/auth');
  return response.data;
};

// 로그아웃 API
export const logout = async () => {
  const response = await axiosInstance.post('/v1/auth/logout');
  return response.data;
};

// 이메일 찾기 API
export const findEmail = async (findEmailData: FindEmailData) => {
  const response = await axiosInstance.post(
    '/v1/auth/find-email',
    findEmailData
  );
  return response.data;
};

// 이메일 인증 코드 전송(비밀번호 찾기) API
export const sendEmailCodeForPassword = async (email: string) => {
  const response = await axiosInstance.get('/v1/auth/reset-password', {
    params: { email },
  });
  return response.data;
};

// 이메일 인증 코드 확인(비밀번호 찾기) API
export const checkEmailCodeForPassword = async (
  checkEmailCodeForPasswordData: CheckEmailCodeForPasswordData
) => {
  const response = await axiosInstance.post(
    '/v1/auth/email-code',
    checkEmailCodeForPasswordData
  );
  return response.data;
};

// 비밀번호 재설정 API
export const resetPassword = async (resetPasswordData: ResetPasswordData) => {
  const response = await axiosInstance.post(
    '/v1/auth/reset-password',
    resetPasswordData
  );
  return response.data;
};

// 회원가입 API
export const register = async (registerFormData: FormData) => {
  const response = await axiosInstance.post(
    '/v1/auth/register',
    registerFormData
  );

  return response.data;
};

// 닉네임 중복 확인 API
export const checkNickname = async (nickname: string) => {
  const response = await axiosInstance.get('/v1/auth/check-nickname', {
    params: { nickname },
  });
  return response.data;
};

// 이메일 중복 확인 API
export const checkEmail = async (
  id: string,
  selectedEmail: string
): Promise<number> => {
  try {
    const email = `${id}@${selectedEmail}.com`;
    const response = await axiosInstance.get(
      `v1/auth/check-duplicate-email?email=${email}`,
      {
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 400,
      }
    );

    return response.data.code;
  } catch (error) {
    console.error('이메일 중복확인 이멀전씨', error);
    throw new Error('이메일 중복확인 임어준씨');
  }
};
// 이메일 인증 코드 전송(회원가입) API
export const sendEmailCode = async (email: string) => {
  const response = await axiosInstance.get(
    `/v1/auth/email-code?email=${email}`
  );

  return response.data;
};

// 이메일 인증 코드 확인(회원가입) API
export const checkEmailCode = async (emailData: CheckEmailCodeData) => {
  const response = await axiosInstance.post(`/v1/auth/email-code`, {
    email: emailData.email,
    authCode: emailData.authCode,
  });

  return response.data;
};
