import axiosInstance from '@/api/axiosInstance';

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
