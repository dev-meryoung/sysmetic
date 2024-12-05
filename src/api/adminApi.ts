import axiosInstance from '@/api/axiosInstance';

export interface GetAdminNoticeListData {
  noticeId?: string;
  page?: number;
  searchType?: string;
  searchText?: string;
}

export interface GetAdminNoticeData {
  noticeId?: string;
  page?: number;
  searchType?: string;
  searchText?: string;
}

export interface DeleteInquiryListRequest {
  inquiryIdList: number[];
}

// 회원 목록 조회 API
export const getAdminUserList = async () => {};

// 회원 등급 변경 API
export const updateAdminUserRole = async () => {};

// 회원 강제 탈퇴 API
export const deleteAdminUser = async () => {};

// 공지사항 목록 조회 API
export const getAdminNoticeList = async (
  getAdminNoticeListData: GetAdminNoticeListData
) => {
  const response = await axiosInstance.get(`/v1/admin/notice`, {
    params: getAdminNoticeListData,
  });
  return response.data;
};

// 공지사항 상세 정보 조회 API
export const getAdminNotice = async (params: GetAdminNoticeData) => {
  const { noticeId, ...queryParams } = params;
  const response = await axiosInstance.get(`/v1/admin/notice/${noticeId}`, {
    params: queryParams,
  });
  return response.data;
};

// 공지사항 수정 API
export const updateAdminNotice = async (noticeId: string) => {
  const response = await axiosInstance.put(`/v1/admin/notice/${noticeId}`);
  return response.data;
};

// 공지사항 삭제 API
export const deleteAdminNotice = async (noticeId: string) => {
  const response = await axiosInstance.delete(`/v1/admin/notice/${noticeId}`);
  return response.data;
};

// 공지사항 목록에서 개별 공개여부 수정 API
export const updateAdminNoticeStatus = async (noticeId: string) => {
  const response = await axiosInstance.put(
    `/v1/admin/notice/${noticeId}/open-close`
  );
  return response.data;
};

// 공지사항 등록 API
export const createAdminNotice = async () => {
  const response = await axiosInstance.put(`/v1/admin/notice`);
  return response.data;
};

// 공지사항 목록 삭제 API
export const deleteAdminNoticeList = async () => {
  const response = await axiosInstance.delete(`/v1/admin/notice`);
  return response.data;
};

// 공지사항 수정 화면 조회 API
export const getAdminNoticeEdit = async (noticeId: string) => {
  const response = await axiosInstance.get(
    `/v1/admin/notice/${noticeId}/modify`
  );
  return response.data;
};

// 전략 목록 조회 API
export const getAdminStrategyList = async () => {};

// 전략 승인 API
export const approveAdminStrategy = async (approveData: {
  strategyId: number[];
}) => {
  const response = await axiosInstance.patch(
    `/v1/admin/strategy/allow`,
    JSON.stringify(approveData),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

// 전략 반려 API
export const rejectAdminStrategy = async (rejectData: {
  strategyId: number;
  rejectReason: string;
}) => {
  const response = await axiosInstance.patch(
    `/v1/admin/strategy/reject`,
    JSON.stringify(rejectData),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

// 관리자 문의 조회 API
export const getInquiryList = async (
  page: number,
  closed: string,
  searchType: string,
  searchText: string
) => {
  const response = await axiosInstance.get('/v1/admin/qna', {
    params: {
      page,
      closed,
      searchType,
      searchText,
    },
  });

  return response.data;
};

// 관리자 문의 목록 삭제 API
export const deleteInquiryList = async (
  requestData: DeleteInquiryListRequest
) => {
  const response = await axiosInstance.delete('/v1/admin/qna', {
    data: requestData,
  });

  return response.data;
};

// 관리자 문의 상세조회 API
export const getInquiryDetail = async (
  qnaId: number,
  params: {
    page: number;
    closed: string;
    searchType: string;
    searchText: string;
  }
) => {
  const response = await axiosInstance.get(`/v1/admin/qna/${qnaId}`, {
    params,
  });

  return response.data;
};

// 관리자 문의 특정 삭제 API
export const deleteDetailInquiry = async (qnaId: number) => {
  const response = await axiosInstance.delete(`/v1/admin/qna/${qnaId}`);

  return response.data;
};
