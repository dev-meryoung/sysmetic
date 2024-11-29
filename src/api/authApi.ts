import axiosInstance from '@/api/axiosInstance';

export interface LoginRequestData {
  email: string;
  password: string;
  rememberMe: boolean;
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
export const findEmail = async () => {};

// 이메일 인증 코드 전송(비밀번호 찾기) API
export const sendEmailCodeForPassword = async () => {};

// 이메일 인증 코드 확인(비밀번호 찾기) API
export const checkEmailCodeForPassword = async () => {};

// 비밀번호 재설정 API
export const resetPassword = async () => {};

// 회원가입 API
export const register = async () => {};

// 닉네임 중복 확인 API
export const checkNickname = async () => {};

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
export const sendEmailCode = async () => {};

// 이메일 인증 코드 확인(회원가입) API
export const checkEmailCode = async () => {};
