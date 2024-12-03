import axiosInstance from '@/api/axiosInstance';

// 공지사항 목록 조회 API
export const getNoticeList = async () => {};

// 공지사항 상세 정보 조회 API
export const getNotice = async () => {};

// 메인페이지 조회 API
export const getMainPage = async () => {
  const response = await axiosInstance.get('/v1/main/info');

  return response.data;
};

// 메인페이지 차트 정보 조회 API
export const getMainPageChart = async () => {};
