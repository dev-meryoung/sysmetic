import axiosInstance from '@/api/axiosInstance';

// 공지사항 목록 조회 API
export const getNoticeList = async () => {};

// 공지사항 상세 정보 조회 API
export const getNotice = async () => {};

// 공통 타입 정의
export interface GetInquiryData {
  sort?: string;
  closed?: string;
  page?: number;
}

export interface GetInquiryDetailData {
  qnaId: number;
  sort?: string;
  closed?: string;
  page?: number;
}

export interface CreateAnswerData {
  qnaId: number;
  answerTitle: string;
  answerContent: string;
}

export interface CreateInquiryData {
  strategyId: number;
  inquiryTitle: string;
  inquiryContent: string;
}

export interface UpdateInquiryData {
  qnaId: number;
  inquiryTitle: string;
  inquiryContent: string;
}

// 질문자 문의 상세 조회 API
export const getInquiryDetailUser = async (params: GetInquiryDetailData) => {
  const { qnaId, ...queryParams } = params;
  const response = await axiosInstance.get(`/v1/member/qna/${qnaId}`, {
    params: queryParams,
  });
  return response.data;
};

// 트레이더 문의 상세 조회 API
export const getInquiryDetailTrader = async (params: GetInquiryDetailData) => {
  const { qnaId, ...queryParams } = params;

  const response = await axiosInstance.get(`/v1/trader/qna/${qnaId}`, {
    params: queryParams,
  });
  return response.data;
};
// 질문자 문의 수정 API
export const updateInquiry = async (editInquiryData: UpdateInquiryData) => {
  const { qnaId, ...payload } = editInquiryData;

  const response = await axiosInstance.put(`/v1/member/qna/${qnaId}`, payload);
  return response.data;
};

// 질문자 문의 삭제 API
export const deleteInquiry = async (qnaId: number) => {
  const response = await axiosInstance.delete(`/v1/member/qna/${qnaId}`);
  return response.data;
};

// 트레이더 문의 답변 등록 API
export const createAnswer = async (answerData: CreateAnswerData) => {
  const { qnaId, ...payload } = answerData;

  const response = await axiosInstance.post(`/v1/trader/qna/${qnaId}`, payload);
  return response.data;
};

// 질문자 문의 등록 API
export const createUserInquiry = async (inquiryData: CreateInquiryData) => {
  const { strategyId, ...payload } = inquiryData;

  const response = await axiosInstance.post(
    `/v1/strategy/${strategyId}/qna`,
    payload
  );
  return response.data;
};

// 트레이더 문의 목록 조회 API
export const getInquiryListTrader = async (params: GetInquiryData) => {
  const response = await axiosInstance.get('/v1/trader/qna', { params });
  return response.data;
};

// 질문자 문의 등록 화면 조회 API
export const getCreateInquiry = async (strategyId: number) => {
  const response = await axiosInstance.get(`/v1/strategy/${strategyId}/qna`);
  return response.data;
};

// 질문자 문의 목록 조회 및 검색 API
export const getInquiryListUser = async (params: GetInquiryData) => {
  const response = await axiosInstance.get('/v1/member/qna', { params });
  return response.data;
};

// 질문자 문의 수정 화면 조회 API
export const getEditInquiry = async (params: GetInquiryDetailData) => {
  const { qnaId, ...queryParams } = params;

  const response = await axiosInstance.get(`/v1/member/qna/${qnaId}/modify`, {
    params: queryParams,
  });
  return response.data;
};

// 메인페이지 조회 API
export const getMainPage = async () => {
  const response = await axiosInstance.get('/v1/main/info');

  return response.data;
};

// 메인페이지 차트 정보 조회 API
export const getMainPageChart = async () => {
  const response = await axiosInstance.get('/v1/main/analysis');

  return response.data;
};
