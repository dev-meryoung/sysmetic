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
