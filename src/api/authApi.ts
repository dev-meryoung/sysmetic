import axiosInstance from '@/api/axiosInstance';

export interface LoginRequestData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface FindEmailData {
  name: string;
  phoneNumber: string;
}

export interface EmailCodeData {
  email: string;
  authCode: string;
}

export interface ResetPwData {
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
export const checkEmailCodeForPassword = async (codeData: EmailCodeData) => {
  const response = await axiosInstance.post('/v1/auth/email-code', codeData);
  return response.data;
};

// 비밀번호 재설정 API
export const resetPassword = async (passwordData: ResetPwData) => {
  const response = await axiosInstance.post(
    '/v1/auth/reset-password',
    passwordData
  );
  return response.data;
};

// 회원가입 API
export const register = async () => {};

// 닉네임 중복 확인 API
export const checkNickname = async () => {};

// 이메일 중복 확인 API
export const checkEmail = async () => {};

// 이메일 인증 코드 전송(회원가입) API
export const sendEmailCode = async () => {};

// 이메일 인증 코드 확인(회원가입) API
export const checkEmailCode = async () => {};
