import axiosInstance from '@/api/axiosInstance';

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

export interface MethodsPaginatedResponse {
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  content: MethodsData[];
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

// 회원 목록 조회 API
export const getAdminUserList = async () => {};

// 회원 등급 변경 API
export const updateAdminUserRole = async () => {};

// 회원 강제 탈퇴 API
export const deleteAdminUser = async () => {};

// 공지사항 등록 API
export const createAdminNotice = async () => {};

// 공지사항 목록 조회 API
export const getAdminNoticeList = async () => {};

// 공지사항 상세 정보 조회 API
export const getAdminNotice = async () => {};

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

// 종목 목록 API
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
