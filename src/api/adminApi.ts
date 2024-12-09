import axiosInstance from '@/api/axiosInstance';

export interface GetAdminNoticeListData {
  noticeId?: string;
  page?: number;
  searchType?: string;
  searchText?: string;
  isOpen?: boolean;
}

export interface GetAdminNoticeData {
  noticeId?: string;
  page?: number;
  searchType?: string;
  searchText?: string;
}

export interface UpdateAdminNoticeData {
  noticeId?: string;
  noticeTitle: string;
  noticeContent: string;
  isOpen?: boolean;
}

export interface UpdateAdminNoticeStatusData {
  noticeId?: string;
  isOpen?: boolean;
}

export interface DeleteInquiryListRequest {
  inquiryIdList: number[];
}

export type RoleCodeTypes =
  | 'USER'
  | 'TRADER'
  | 'USER_MANAGER'
  | 'TRADER_MANAGER'
  | 'ADMIN';
export type TabButtonTypes = 'ALL' | 'USER' | 'TRADER' | 'MANAGER';
export interface AdminUserData {
  role?: TabButtonTypes;
  page?: number;
  searchType?: string;
  searchKeyword?: string;
}

export interface UserData {
  id: number;
  roleCode: RoleCodeTypes;
  email: string;
  name: string;
  nickname: string;
  birth: string;
  phoneNumber: string;
}

export interface PaginatedResponse {
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  content: UserData[];
}

export interface MethodsPaginatedResponse {
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  content: MethodsData[];
}

export interface UpDateUserRole {
  memberId: number[];
  hasManagerRights: boolean;
}

export interface MethodsData {
  id: number;
  name: string;
  filePath: string;
}

export interface MethodsParameterProps {
  page: number;
}

export interface MethodsPostRequestDtoProps {
  name: string;
  checkDupl: boolean;
}

export interface MethodsPostRequestProps {
  methodPostRequestDto: MethodsPostRequestDtoProps;
  file: File;
}

export interface MethodsPutRequestDtoProps {
  id: number | undefined;
  name: string;
  checkDuplicate: boolean;
}

export interface MethodsPutRequestProps {
  methodPutRequestDto: MethodsPutRequestDtoProps;
  file: File;
}

export interface StocksPaginatedResponse {
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  content: StocksData[];
}

export interface StocksData {
  id: number;
  name: string;
  filePath: string;
}

export interface StocksParameterProps {
  page: number;
}

export interface StocksPostRequestDtoProps {
  name: string;
  checkDuplicate: boolean;
}

export interface StocksPostRequestProps {
  stockPostRequestDto: StocksPostRequestDtoProps;
  file: File;
}

export interface StocksPutRequestDtoProps {
  id: number | undefined;
  name: string;
  checkDuplicate: boolean;
}

export interface StocksPutRequestProps {
  stockPutRequestDto: StocksPutRequestDtoProps;
  file: File;
}

export interface AdminStrategyDtoProps {
  openStatus?: string;
  approvalStatus?: string;
  keyword?: string;
  page: number;
}

// 회원 목록 조회 API
export const getAdminUserList = async (userList: AdminUserData) => {
  const queryParams = new URLSearchParams();

  if (userList.role) {
    queryParams.append('role', userList.role);
  }
  if (userList.page) {
    queryParams.append('page', String(userList.page));
  }
  if (userList.searchType) {
    queryParams.append('searchType', userList.searchType);
  }
  if (userList.searchKeyword) {
    queryParams.append('searchKeyword', userList.searchKeyword);
  }
  const response = await axiosInstance.get(
    `v1/admin/members?${queryParams.toString()}`
  );

  return response.data.data;
};

// 회원 등급 변경 API
export const updateAdminUserRole = async (params: UpDateUserRole) => {
  const response = await axiosInstance.patch('/v1/admin/members', {
    memberId: params.memberId,
    hasManagerRights: params.hasManagerRights,
  });

  return response.data;
};

// 회원 강제 탈퇴 API
export const deleteAdminUser = async (memberId: number[]) => {
  const membersId = memberId.join(',');
  const response = await axiosInstance.delete(`/v1/admin/members/${membersId}`);
  return response.data;
};

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
export const updateAdminNotice = async (formData: FormData, noticeId: string) =>
  axiosInstance.put(`/v1/admin/notice/${noticeId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

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
export const createAdminNotice = async (formData: FormData) => {
  const response = await axiosInstance.post(`/v1/admin/notice`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 공지사항 목록 삭제 API
export const deleteAdminNoticeList = async (noticeIds: number[]) => {
  const payload = { noticeIds };
  const response = await axiosInstance.delete(`/v1/admin/notice`, {
    data: payload,
  });
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
export const getAdminStrategyList = async (params: AdminStrategyDtoProps) => {
  const response = await axiosInstance.get(`/v1/admin/strategy`, {
    params: {
      openStatus: params.openStatus,
      approvalStatus: params.approvalStatus,
      keyword: params.keyword,
      page: params.page,
    },
  });

  return response.data;
};

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

export const getAdminStocks = async (params: StocksParameterProps) => {
  const response = await axiosInstance.get(
    `/v1/admin/stocklist/${params.page}`
  );

  return response.data.data;
};

// 종목 저장 API
export const createAdminStocks = async (params: StocksPostRequestProps) => {
  const formData = new FormData();

  formData.append(
    'stockPostRequestDto',
    JSON.stringify(params.stockPostRequestDto)
  );
  formData.append('file', params.file);

  const response = await axiosInstance.post(`/v1/admin/stock`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// 종목 삭제 API
export const deleteAdminStocks = async (ids: number[]) => {
  const response = await axiosInstance.delete(`/v1/admin/stock`, {
    data: { stockIdList: ids }, // body
  });

  return response.data;
};

// 종목 수정 API
export const updateAdminStocks = async (params: StocksPutRequestProps) => {
  const formData = new FormData();

  formData.append(
    'stockPutRequestDto',
    JSON.stringify(params.stockPutRequestDto)
  );
  formData.append('file', params.file);

  const response = await axiosInstance.patch(`/v1/admin/stock`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// 매매방식 조회 API
export const getAdminMethods = async (params: MethodsParameterProps) => {
  const response = await axiosInstance.get(`/v1/admin/methodlist`, {
    params: {
      page: params.page,
    },
  });

  return response.data.data;
};

// 매매방식 등록 API
export const createAdminMethods = async (params: MethodsPostRequestProps) => {
  const formData = new FormData();

  formData.append(
    'methodPostRequestDto',
    JSON.stringify(params.methodPostRequestDto)
  );
  formData.append('file', params.file);

  const response = await axiosInstance.post(`/v1/admin/method`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

//매매방식 삭제 API
export const deleteAdminMethods = async (ids: number[]) => {
  const response = await axiosInstance.delete(`/v1/admin/method`, {
    data: { methodIdList: ids },
  });

  return response.data;
};

//매매방식 수정 API
export const updateAdminMethods = async (params: MethodsPutRequestProps) => {
  const formData = new FormData();

  formData.append(
    'methodPutRequestDto',
    JSON.stringify(params.methodPutRequestDto)
  );
  formData.append('file', params.file);

  const response = await axiosInstance.put(`/v1/admin/method`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

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
export const getAdminInquiryDetail = async (
  qnaId: number,
  closed: string,
  searchType: string,
  searchText: string
) => {
  const response = await axiosInstance.get(`/v1/admin/qna/${qnaId}`, {
    params: {
      closed,
      searchType,
      searchText,
    },
  });

  return response.data;
};

// 관리자 문의 특정 삭제 API
export const deleteDetailInquiry = async (qnaId: number) => {
  const response = await axiosInstance.delete(`/v1/admin/qna/${qnaId}`);

  return response.data;
};

// 관리자 메인 조회 API
export const getAdminMain = async () => {
  const response = await axiosInstance.get(`/v1/admin/main`);

  return response.data;
};
