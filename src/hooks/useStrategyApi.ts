import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { createStrategy, getStrategyInfo } from '@/api';

export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface StrategyInfo {
  id: number;
  traderNickname: string;
  methodId: number;
  methodName: string;
  stockList: {
    stockIds: number[];
    stockNames: string[];
  };
  name: string;
  statusCode: string;
  cycle: string;
  content: string;
  followerCount: number;
  mdd: number;
  kpRatio: number;
  smScore: number;
  accumulatedProfitLossRate: number;
  maximumCapitalReductionAmount: number;
  averageProfitLossRate: number;
  profitFactor: number;
  winningRate: number;
  monthlyRecord: number[];
  analysis: null;
}


export const useCreateStrategy = () =>
  useMutation({
    mutationFn: (formData: FormData) => createStrategy(formData),
  });

  export type GetStrategyInfoResponse = BaseResponse<{
    id: number;
    traderNickname: string;
    methodId: number;
    methodName: string;
    stockList: {
      stockIds: number[];
      stockNames: string[];
    };
    name: string;
    statusCode: string;
    cycle: string;
    content: string;
    followerCount: number;
    mdd: number;
    kpRatio: number;
    smScore: number;
    accumulatedProfitLossRate: number;
    maximumCapitalReductionAmount: number;
    averageProfitLossRate: number;
    profitFactor: number;
    winningRate: number;
    monthlyRecord: number[];
    analysis: null;
  }>;
  
  export const useGetStrategyInfo = (strategyId: string) => {
    const { data, isSuccess } = useQuery<GetStrategyInfoResponse, Error>({
      queryKey: ['strategyInfo'],
      queryFn: () => getStrategyInfo(strategyId),
    });
  
    return {
      data: isSuccess && data?.code === 200 ? data.data : undefined,
      isError: isSuccess && data?.code !== 200,
    };
  };
