import axiosInstance from '@/api/axiosInstance';
import {
  CreateMyStrategyDailyRequest,
  DeleteMyStrategyAccountRequest,
  DeleteTraderAddStrategyListRequest,
} from '@/hooks/useStrategyApi';

// 전략 목록 조회 API
export const getStrategyList = async () => {};

// 트레이더 목록 조회 API
export const getTraderList = async () => {};

// 특정 트레이더 전략 조회 API
export const getTradersStrategyList = async () => {};

// 매매방식 및 운용 종목 목록 조회 API
export const getMethodAndStockList = async () => {
  const response = await axiosInstance.get(
    '/v1/trader/strategy/method-and-stock'
  );

  return response.data;
};

// 전략 등록 API
export const createStrategy = async (formData: FormData) => {
  const response = await axiosInstance.post('/v1/trader/strategy', formData);

  return response.data;
};

// 전략 수정 API
export const updateStrategy = async (
  strategyId: string,
  formData: FormData
) => {
  const response = await axiosInstance.patch(
    `/v1/trader/strategy/${strategyId}`,
    formData
  );

  return response.data;
};

// 전략 삭제 API
export const deleteTraderAddStrategyList = async (
  requestData: DeleteTraderAddStrategyListRequest
) => {
  const response = await axiosInstance.delete('/v1/trader/strategy', {
    data: requestData,
  });

  return response.data;
};

// 전략 상세 정보 조회 API
export const getStrategyInfo = async (strategyId: string) => {
  const response = await axiosInstance.get(`/v1/strategy/detail/${strategyId}`);

  return response.data;
};

// 전략 일간분석 정보 조회 API
export const getStrategyDaily = async (
  strategyId: string,
  page: number,
  startDate?: string,
  endDate?: string
) => {
  const response = await axiosInstance.get(`/v1/strategy/daily/${strategyId}`, {
    params: {
      page,
      startDate,
      endDate,
    },
  });

  return response.data;
};

// 전략 월간분석 정보 조회 API
export const getStrategyMonthly = async (
  strategyId: string,
  page: number,
  startYearMonth?: string,
  endYearMonth?: string
) => {
  const response = await axiosInstance.get(
    `/v1/strategy/monthly/${strategyId}`,
    {
      params: {
        page,
        startYearMonth,
        endYearMonth,
      },
    }
  );

  return response.data;
};

// 전략 실계좌정보 조회 API
export const getStrategyAccount = async (strategyId: string, page: number) => {
  const response = await axiosInstance.get(
    `/v1/strategy/account-image/${strategyId}`,
    {
      params: {
        page,
      },
    }
  );

  return response.data;
};

// 전략(관리) 승인 요청 API
export const requestApproveStrategy = async (strategyId: string) => {
  const response = await axiosInstance.post(
    `/v1/strategy/approve-open/${strategyId}`
  );

  return response.data;
};

// 전략(관리) 승인 요청 취소 API
export const cancelApproveStrategy = async (strategyId: string) => {
  const response = await axiosInstance.patch(
    `/v1/strategy/approve-cancel/${strategyId}`
  );

  return response.data;
};

// 전략(관리) 비공개 전환 API
export const changePrivateStrategy = async (strategyId: string) => {
  const response = await axiosInstance.patch(
    `/v1/trader/strategy/${strategyId}/visibility`
  );

  return response.data;
};

// 전략(관리) 양식 엑셀 다운로드 API
export const getExampleExcelLink = async () => {
  const response = await axiosInstance.get('/v1/excel/daily');

  return response.data;
};

// 전략(관리) 엑셀 업로드 API
export const uploadDailyExcel = async (
  strategyId: number,
  formData: FormData
) => {
  const response = await axiosInstance.post(
    `/v1/excel/daily/${strategyId}`,
    formData
  );

  return response.data;
};

// 전략(관리) 일간분석 정보 등록 API
export const createMyStrategyDaily = async (
  strategyId: number,
  dailyData: CreateMyStrategyDailyRequest[]
) => {
  const response = await axiosInstance.post(
    `/v1/trader/strategy/daily/${strategyId}`,
    JSON.stringify(dailyData),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

// 전략(관리) 일간분석 정보 수정 API
export const updateMyStrategyDaily = async (
  dailyId: number,
  updatedData: CreateMyStrategyDailyRequest
) => {
  const response = await axiosInstance.patch(
    `/v1/trader/strategy/daily/${dailyId}`,
    updatedData
  );

  return response.data;
};

// 전략(관리) 일간분석 정보 삭제 API
export const deleteMyStrategyDaily = async (dailyId: number) => {
  const response = await axiosInstance.delete(
    `/v1/trader/strategy/daily/${dailyId}`
  );

  return response.data;
};

// 전략(관리) 실계좌정보 등록 API
export const createMyStrategyAccount = async (
  strategyId: string,
  formData: FormData
) => {
  const response = await axiosInstance.post(
    `/v1/trader/strategy/account-image/${strategyId}`,
    formData
  );

  return response.data;
};

// 전략(관리) 실계좌정보 삭제 API
export const deleteMyStrategyAccount = async (
  deletedData: DeleteMyStrategyAccountRequest
) => {
  const response = await axiosInstance.delete(
    '/v1/trader/strategy/account-image',
    {
      data: deletedData,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};
