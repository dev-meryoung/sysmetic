import axiosInstance from '@/api/axiosInstance';

export interface LoginRequestData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// 로그인 API
export const login = async (loginData: LoginRequestData) => {
  const response = await axiosInstance.post('/auth/login', loginData);

  return response.data;
};

// 이메일 찾기 API
export const findEmail = async () => {};

// 이메일 인증 코드 전송(비밀번호 찾기) API
export const sendEmailCodeForPassword = async () => {};

// 이메일 인증 코드 확인(비밀번호 찾기) API
export const checkEmailCodeForPassword = async () => {};

// 비밀번호 재설정 API
export const resetPassword = async () => {};

// 로그아웃 API
export const logout = async () => {};

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
