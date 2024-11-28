import axiosInstance from '@/api/axiosInstance';

export interface GetInquiryData {
  sort?: string;
  closed?: string;
  page?: number;
}

export interface GetInquiryDetailData extends GetInquiryData {
  inquiryId: number;
}

export interface CreateAnswerData {
  inquiryId: number;
  answerTitle: string;
  answerContent: string;
}

export interface CreaeteInquiryData {
  memberId: number;
  strategyId: number;
  inquiryTitle: string;
  inquiryContent: string;
}

export interface UpdateInquiryData {
  inquiryId: number;
  inquiryTitle: string;
  inquiryContent: string;
}

// 공지사항 목록 조회 API
export const getNoticeList = async () => {};

// 공지사항 상세 정보 조회 API
export const getNotice = async () => {};

// 질문자 문의 수정 화면 조회 API
export const getEditInquiry = async (params: GetInquiryDetailData) => {
  const { inquiryId, sort, closed, page } = params;

  const response = await axiosInstance.get(
    `/v1/member/inquiry/${inquiryId}/modify`,
    {
      params: { sort, closed, page },
    }
  );

  return response.data;
};

// 질문자 문의 수정 API
export const updateInquiry = async (editInquiryUserData: UpdateInquiryData) => {
  const response = await axiosInstance.put(
    `/v1/member/inquiry/${editInquiryUserData.inquiryId}/modify`,
    editInquiryUserData
  );
  return response.data;
};

// 트레이더 문의 답변 등록 API
export const createAnswer = async (answerData: CreateAnswerData) => {
  const response = await axiosInstance.post(
    `/v1/trader/inquiry/${answerData.inquiryId}/write`,
    answerData
  );
  return response.data;
};

// 질문자 문의 등록 화면 조회 API
export const getCreateInquiry = async (strategyId: number) => {
  const response = await axiosInstance.get(
    `/v1/strategy/${strategyId}/inquiry`
  );
  return response.data;
};

// 질문자 문의 등록 API
export const createInquiry = async (inquiryData: CreaeteInquiryData) => {
  const response = await axiosInstance.post(
    `/v1/strategy/${inquiryData.strategyId}/inquiry`,
    inquiryData
  );
  return response.data;
};

// 트레이더 문의 조회 API
export const getInquiryListTrader = async (params: GetInquiryData) => {
  const response = await axiosInstance.get(`/v1/trader/inquiry`, {
    params,
  });
  return response.data;
};

// 트레이더 문의 상세 조회 API
export const getInquiryDetailTrader = async (params: GetInquiryDetailData) => {
  const { inquiryId, sort, closed, page } = params;

  const response = await axiosInstance.get(
    `/v1/trader/inquiry/${inquiryId}/view`,
    {
      params: { sort, closed, page },
    }
  );
  return response.data;
};

// 질문자 문의 조회 및 검색 API
export const getInquiryListUser = async (params: GetInquiryData) => {
  const response = await axiosInstance.get(`/v1/member/inquiry`, {
    params,
  });
  return response.data;
};

// 질문자 문의 상세 조회 API
export const getInquiryDetailUser = async (params: GetInquiryDetailData) => {
  const { inquiryId, sort, closed, page } = params;

  const response = await axiosInstance.get(
    `/v1/member/inquiry/${inquiryId}/view`,
    {
      params: { sort, closed, page },
    }
  );
  return response.data;
};

// 질문자 문의 삭제 API
export const deleteInquiry = async (inquiryId: number) => {
  const response = await axiosInstance.delete(
    `/v1/member/inquiry/${inquiryId}/delete`
  );
  return response.data;
};
