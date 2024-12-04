import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import {
  cancelApproveStrategy,
  changePrivateStrategy,
  createMyStrategyAccount,
  createMyStrategyDaily,
  createStrategy,
  deleteMyStrategyAccount,
  deleteMyStrategyDaily,
  deleteTraderAddStrategyList,
  getExampleExcelLink,
  getMethodAndStockList,
  getStrategyAccount,
  getStrategyDaily,
  getStrategyInfo,
  getStrategyMonthly,
  requestApproveStrategy,
  updateMyStrategyDaily,
  updateStrategy,
  uploadDailyExcel,
} from '@/api';

export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export type GetMethodAndStockResponse = BaseResponse<{
  methodList: {
    id: number;
    name: string;
    filePath: string;
  }[];
  stockList: {
    id: number;
    name: string;
    filePath: string;
  }[];
}>;

export type GetStrategyInfoResponse = BaseResponse<{
  id: number;
  traderId: number;
  traderNickname: string;
  traderProfileImage: string;
  methodId: number;
  methodName: string;
  methodIconPath: string;
  stockList: {
    stockIds: number[];
    stockNames: string[];
    stockIconPath: string[];
  };
  isFollow: boolean;
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
  fileWithInfoResponse: {
    id: number;
    url: string;
    originalName: string;
    fileSize: number;
  };
}>;

export type GetStrategyDailyResponse = BaseResponse<{
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  content: {
    dailyId: number;
    date: string;
    principal: number;
    depositWithdrawalAmount: number;
    profitLossAmount: number;
    profitLossRate: number;
    accumulatedProfitLossAmount: number;
    accumulatedProfitLossRate: number;
  }[];
}>;

export type GetStrategyMonthlyResponse = BaseResponse<{
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  content: {
    monthId: number;
    yearMonth: string;
    averagePrincipal: number;
    depositWithdrawalAmount: number;
    profitLossAmount: number;
    profitLossRate: number;
    accumulatedProfitLossAmount: number;
    accumulatedProfitLossRate: number;
  }[];
}>;

export type GetStrategyAccountResponse = BaseResponse<{
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  content: {
    accountImageId: number;
    title: string;
    imageUrl: string;
  }[];
}>;

export type CreateMyStrategyDailyRequest = {
  date: string;
  depositWithdrawalAmount: number;
  dailyProfitLossAmount: number;
};

export type DeleteMyStrategyAccountRequest = {
  accountImageId: number[];
};

export interface DeleteTraderAddStrategyListRequest {
  idList: number[];
}

export const useGetMethodAndStock = () => {
  const { data, isSuccess } = useQuery<GetMethodAndStockResponse, Error>({
    queryKey: ['methodAndStock'],
    queryFn: getMethodAndStockList,
  });

  if (isSuccess && data) {
    return { data: data.data };
  }

  return { data: undefined };
};

export const useCreateStrategy = () =>
  useMutation({
    mutationFn: (formData: FormData) => createStrategy(formData),
  });

export const useUpdateStrategy = () =>
  useMutation({
    mutationFn: ({
      strategyId,
      formData,
    }: {
      strategyId: string;
      formData: FormData;
    }) => updateStrategy(strategyId, formData),
  });

export const useDeleteTraderAddStrategyList = () => {
  const mutation = useMutation<any, Error, DeleteTraderAddStrategyListRequest>({
    mutationFn: (requestData: DeleteTraderAddStrategyListRequest) =>
      deleteTraderAddStrategyList(requestData),
  });

  return mutation;
};

export const useGetStrategyInfo = (strategyId: string) => {
  const { data, isSuccess, refetch } = useQuery<GetStrategyInfoResponse, Error>(
    {
      queryKey: ['strategyInfo'],
      queryFn: () => getStrategyInfo(strategyId),
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: isSuccess && data?.code === 200 ? data.data : undefined,
    isError: isSuccess && data?.code !== 200,
    refetch,
  };
};

export const useGetStrategyDaily = (
  strategyId: string,
  page: number,
  startDate?: string,
  endDate?: string
) => {
  const { data, isSuccess, refetch } = useQuery<GetStrategyDailyResponse>({
    queryKey: ['strategyDaily', strategyId, page, startDate, endDate],
    queryFn: () => getStrategyDaily(strategyId, page, startDate, endDate),
    placeholderData: keepPreviousData,
    retry: 0,
  });

  const processedData =
    isSuccess && data?.code === 200
      ? data.data
      : {
          currentPage: 0,
          pageSize: 0,
          totalElement: 0,
          totalPages: 0,
          content: [],
        };

  return {
    data: processedData,
    refetch,
  };
};

export const useGetStrategyMonthly = (
  strategyId: string,
  page: number,
  startYearMonth?: string,
  endYearMonth?: string
) => {
  const { data, isSuccess, refetch } = useQuery<GetStrategyMonthlyResponse>({
    queryKey: [
      'strategyMonthly',
      strategyId,
      page,
      startYearMonth,
      endYearMonth,
    ],
    queryFn: () =>
      getStrategyMonthly(strategyId, page, startYearMonth, endYearMonth),
    placeholderData: keepPreviousData,
    retry: 0,
  });

  const processedData =
    isSuccess && data?.code === 200
      ? data.data
      : {
          currentPage: 0,
          pageSize: 0,
          totalElement: 0,
          totalPages: 0,
          content: [],
        };

  return {
    data: processedData,
    refetch,
  };
};

export const useGetStrategyAccount = (strategyId: string, page: number) => {
  const { data, isSuccess, refetch } = useQuery<GetStrategyAccountResponse>({
    queryKey: ['strategyAccount', strategyId, page],
    queryFn: () => getStrategyAccount(strategyId, page),
    placeholderData: keepPreviousData,
    retry: 0,
  });

  const processedData =
    isSuccess && data?.code === 200
      ? data.data
      : {
          currentPage: 0,
          pageSize: 0,
          totalElement: 0,
          totalPages: 0,
          content: [],
        };

  return {
    data: processedData,
    refetch,
  };
};

export const useRequestApproveStrategy = () =>
  useMutation({
    mutationFn: (strategyId: string) => requestApproveStrategy(strategyId),
  });

export const useCancelApproveStrategy = () =>
  useMutation({
    mutationFn: (strategyId: string) => cancelApproveStrategy(strategyId),
  });

export const useChangePrivateStrategy = () =>
  useMutation({
    mutationFn: (strategyId: string) => changePrivateStrategy(strategyId),
  });

export const useGetExampleExcelLink = () => {
  const { data, isSuccess } = useQuery<BaseResponse<string>>({
    queryKey: ['exampleExcelLink'],
    queryFn: getExampleExcelLink,
  });

  if (isSuccess && data) {
    return { data };
  }

  return { data: undefined };
};

export const useUploadDailyExcel = () =>
  useMutation({
    mutationFn: ({
      strategyId,
      formData,
    }: {
      strategyId: number;
      formData: FormData;
    }) => uploadDailyExcel(strategyId, formData),
  });

export const useCreateMyStrategyDaily = () =>
  useMutation({
    mutationFn: ({
      strategyId,
      dailyData,
    }: {
      strategyId: number;
      dailyData: CreateMyStrategyDailyRequest[];
    }) => createMyStrategyDaily(strategyId, dailyData),
  });

export const useUpdateMyStrategyDaily = () =>
  useMutation({
    mutationFn: ({
      dailyId,
      updatedData,
    }: {
      dailyId: number;
      updatedData: CreateMyStrategyDailyRequest;
    }) => updateMyStrategyDaily(dailyId, updatedData),
  });

export const useDeleteMyStrateDaily = () =>
  useMutation({
    mutationFn: (dailyId: number) => deleteMyStrategyDaily(dailyId),
  });

export const useCreateMyStrategyAccount = () =>
  useMutation({
    mutationFn: ({
      strategyId,
      formData,
    }: {
      strategyId: string;
      formData: FormData;
    }) => createMyStrategyAccount(strategyId, formData),
  });

export const useDeleteMyStrateAccount = () =>
  useMutation({
    mutationFn: (deletedData: DeleteMyStrategyAccountRequest) =>
      deleteMyStrategyAccount(deletedData),
  });
