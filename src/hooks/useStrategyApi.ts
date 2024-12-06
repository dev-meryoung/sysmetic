import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  cancelApproveStrategy,
  changePrivateStrategy,
  createMyStrategyAccount,
  createMyStrategyDaily,
  deleteMyStrategyAccount,
  deleteMyStrategyDaily,
  getExampleExcelLink,
  getStrategyAccount,
  getStrategyDaily,
  getStrategyInfo,
  getStrategyMonthly,
  requestApproveStrategy,
  updateMyStrategyDaily,
  updateStrategy,
  uploadDailyExcel,
  getMethodAndStockList,
  getStrategyList,
  createStrategy,
  deleteTraderAddStrategyList,
  getFilterdTrader,
  getTradersStrategyList,
  createStrategyItemFilter,
  getStrategyAlgorithm,
  getFilterdStrategy,
  getUserFolderList,
  createFolder,
  getAvailabilityFolder,
  updateFolderName,
  deleteFolder,
  getInterestStrategy,
  updateMoveFolder,
  createFollowFolder,
  deleteSingleInterestStrategy,
  deleteInterestStrategy,
  getTraderAddStrategyList,
  getStrategyComment,
  createStrategyComment,
  deleteStrategyComment,
  getStrategyAnalysis,
  getStrategyStatistics,
  getDailyExcelLink,
  getDailyDataExcelLink,
  getMonthlyExcelLink,
  getMyStrategyInfo,
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
  monthlyRecord: {
    year: number;
    data: { month: number; value: number }[];
  }[];
  analysis: null;
  fileWithInfoResponse: {
    id: number;
    url: string;
    originalName: string;
    fileSize: number;
  };
}>;

export type getStrategyAnalysisResponse = BaseResponse<{
  standardAmounts: number[];
  currentBalance: number[];
  principal: number[];
  accumulatedDepositWithdrawalAmount: number[];
  depositWithdrawalAmount: number[];
  dailyProfitLossAmount: number[];
  dailyProfitLossRate: number[];
  accumulatedProfitLossAmount: number[];
  currentCapitalReductionAmount: number[];
  currentCapitalReductionRate: number[];
  averageProfitLossAmount: number[];
  averageProfitLossRate: number[];
  winningRate: number[];
  profitFactor: number[];
  roa: number[];
  xaxis: string[];
  [key: string]: any;
}>;

export type getStrategyStatisticsResponse = BaseResponse<{
  currentBalance: number;
  accumulatedDepositWithdrawalAmount: number;
  principal: number;
  operationPeriod: string;
  startDate: string;
  endDate: string;
  accumulatedProfitLossAmount: number;
  accumulatedProfitLossRate: number;
  maximumAccumulatedProfitLossAmount: number;
  maximumAccumulatedProfitLossRate: number;
  currentCapitalReductionAmount: number;
  currentCapitalReductionRate: number;
  maximumCapitalReductionAmount: number;
  maximumCapitalReductionRate: number;
  averageProfitLossAmount: number;
  averageProfitLossRate: number;
  maximumDailyProfitAmount: number;
  maximumDailyProfitRate: number;
  maximumDailyLossAmount: number;
  maximumDailyLossRate: number;
  totalTradingDays: number;
  totalProfitDays: number;
  totalLossDays: number;
  currentContinuousProfitLossDays: number;
  maxContinuousProfitDays: number;
  maxContinuousLossDays: number;
  winningRate: number;
  profitFactor: number;
  roa: number;
  highPointRenewalProgress: number;
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

export type GetFolderListResponse = BaseResponse<
  {
    id: number;
    name: string;
    latestInterestStrategyAddedDate: number;
  }[]
>;

export type UpdateFolderListResponse = BaseResponse<{
  folderId: number;
  folderName: string;
}>;

export type CreateFolderListResponse = BaseResponse<
  {
    data: null;
  }[]
>;

export type CreateStrategyItemFilterResponse = BaseResponse<{
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  content: [
    {
      strategyId: number;
      traderId: number;
      traderNickname: string;
      methodId: number;
      methodName: string;
      name: string;
      cycle: string;
      stockList: {
        stockIds: [number];
        stockNames: [string];
      };
      accumulatedProfitLossRate: number;
      mdd: number;
      smScore: number;
    },
  ];
}>;

export type GetStrategyCommentResponse = BaseResponse<{
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  content: [
    {
      strategyId: number;
      replyId: number;
      memberId: number;
      memberNickname: string;
      content: string;
      createdAt: string;
      memberProfilePath: string;
    },
  ];
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

export interface CreateStrategyItemFilterRequest {
  methods: string[];
  cycle: string[];
  stockNames: string[];
  accumulatedProfitLossRateRangeStart: string;
  accumulatedProfitLossRateRangeEnd: string;
}

export interface UpdateFolderNameRequest {
  folderId: number;
  folderName: string;
  checkDupl: boolean;
}

export interface UpdateMoveFolderRequest {
  originFolderId: number;
  toFolderId: number;
  strategyId: number;
}

export interface CreateFollowFolderRequest {
  folderId: number;
  strategyId: number;
}

export interface DeleteTraderAddStrategyListRequest {
  idList: number[];
}

export interface CreateFolderRequest {
  name: string;
  checkDupl: boolean;
}

export interface DeleteFollowFolderRequest {
  strategyId: number[];
}

export interface CreateStrategyCommentRequest {
  strategyId: number;
  content: string;
}

export interface DeleteStrategyCommentRequest {
  strategyId: number;
  replyId: number;
}

export const useGetStrategyList = (pageNum: number) =>
  useQuery({
    queryKey: ['strategies', pageNum],
    queryFn: () => getStrategyList(pageNum),
  });

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

export const useGetFilterdTrader = (nickname: string, pageNum: number) =>
  useQuery({
    queryKey: ['filterdTrader', nickname, pageNum],
    queryFn: () => getFilterdTrader(nickname, pageNum),
  });

export const useGetTradersStrategyList = (traderId: number, pageNum: number) =>
  useQuery({
    queryKey: ['tradersStrategyList', traderId, pageNum],
    queryFn: () => getTradersStrategyList(traderId, pageNum),
  });

export const useCreateStrategyItemFilter = () => {
  const mutation = useMutation<
    CreateStrategyItemFilterResponse,
    Error,
    { pageNum: number; requestBody: CreateStrategyItemFilterRequest }
  >({
    mutationFn: ({ pageNum, requestBody }) =>
      createStrategyItemFilter(pageNum, requestBody),
  });

  return mutation;
};

export const useGetStrategyAlgorithmFilter = (
  pageNum: number,
  algorithm: string
) =>
  useQuery({
    queryKey: ['filterdStrategyAlgorithm', pageNum, algorithm],
    queryFn: () => getStrategyAlgorithm(pageNum, algorithm),
  });

export const useGetFilterdStrategy = (
  keyword: string,
  pageNum: number,
  enabled: boolean
) =>
  useQuery({
    queryKey: ['filterdStrategy', keyword, pageNum],
    queryFn: () => getFilterdStrategy(keyword, pageNum),
    enabled,
  });

export const useGetUserFolderList = () =>
  useQuery({
    queryKey: ['folderList'],
    queryFn: () => getUserFolderList(),
  });

export const useCreatFolder = () => {
  const mutation = useMutation<
    CreateFolderListResponse[],
    Error,
    CreateFolderRequest
  >({
    mutationFn: (requestData: CreateFolderRequest) => createFolder(requestData),
  });

  return mutation;
};

export const useCheckFolderAvailability = (folderName: string) =>
  useMutation<any, Error, string>({
    mutationKey: ['checkFolderAvailability', folderName],
    mutationFn: (name: string) => getAvailabilityFolder(name),
  });

export const useUpdateFolderName = () => {
  const mutation = useMutation<
    UpdateFolderListResponse,
    Error,
    UpdateFolderNameRequest
  >({
    mutationFn: (requestData: UpdateFolderNameRequest) =>
      updateFolderName(requestData),
  });

  return mutation;
};

export const useDeleteFolder = () => {
  const mutation = useMutation<any, Error, number>({
    mutationFn: (id: number) => deleteFolder(id),
  });

  return mutation;
};

export const useInterestStrategy = (folderId: number, page: number) =>
  useQuery({
    queryKey: ['interestStrategy', folderId, page],
    queryFn: async () => {
      try {
        const response = await getInterestStrategy(folderId, page);
        return response;
      } catch (error) {
        if (error instanceof AxiosError) {
          switch (error.response?.status) {
            case 404:
              throw new Error('해당 페이지에 관심 전략이 존재하지 않습니다.');
            case 500:
              throw new Error(
                '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
              );
            default:
              throw new Error('알 수 없는 오류가 발생했습니다.');
          }
        }
        throw error;
      }
    },
  });

export const useUpdateMoveFolder = () => {
  const mutation = useMutation<
    GetFolderListResponse[],
    Error,
    UpdateMoveFolderRequest
  >({
    mutationFn: (requestData: UpdateMoveFolderRequest) =>
      updateMoveFolder(requestData),
  });

  return mutation;
};

export const useCreateFollowFolder = () => {
  const mutation = useMutation<any, Error, CreateFollowFolderRequest>({
    mutationFn: (requestData: CreateFollowFolderRequest) =>
      createFollowFolder(requestData),
  });

  return mutation;
};

export const useDeleteSingleInterestStrategy = () => {
  const mutation = useMutation<any[], Error, number>({
    mutationFn: (strategyId: number) =>
      deleteSingleInterestStrategy(strategyId),
  });

  return mutation;
};

export const useDeleteInterestStrategy = () => {
  const mutation = useMutation<any, Error, DeleteFollowFolderRequest>({
    mutationFn: (requestData: DeleteFollowFolderRequest) =>
      deleteInterestStrategy(requestData),
  });

  return mutation;
};

export const useGetTraderAddStrategyList = (page: number) =>
  useQuery({
    queryKey: ['traderAddStrategyList', page],
    queryFn: () => getTraderAddStrategyList(page),
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

export const useGetStrategyAnalysis = (strategyId: string) => {
  const { data, isSuccess, refetch } = useQuery<getStrategyAnalysisResponse>({
    queryKey: ['strategyAnalysis', strategyId],
    queryFn: () => getStrategyAnalysis(strategyId),
    retry: 0,
  });

  return {
    data: isSuccess && data?.code === 200 ? data.data : undefined,
    isError: isSuccess && data?.code !== 200,
    refetch,
  };
};

export const useGetStrategyStatistics = (strategyId: string) => {
  const { data, isSuccess, refetch } = useQuery<getStrategyStatisticsResponse>({
    queryKey: ['strategyStatistics', strategyId],
    queryFn: () => getStrategyStatistics(strategyId),
  });

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

export const useGetMyStrategyInfo = (strategyId: string) => {
  const { data, isSuccess, refetch } = useQuery<GetStrategyInfoResponse, Error>(
    {
      queryKey: ['myStrategyInfo'],
      queryFn: () => getMyStrategyInfo(strategyId),
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: isSuccess && data?.code === 200 ? data.data : undefined,
    isError: isSuccess && data?.code !== 200,
    refetch,
  };
};

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

export const useGetStrategyComment = (strategyId: string, page: number) => {
  const { data, isSuccess, refetch } = useQuery<GetStrategyCommentResponse>({
    queryKey: ['strategyComment', strategyId, page],
    queryFn: () => getStrategyComment(strategyId, page),
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

export const useCreateStrategyComment = () =>
  useMutation({
    mutationFn: (commentData: CreateStrategyCommentRequest) =>
      createStrategyComment(commentData),
  });

export const useDeleteStrategyComment = () =>
  useMutation({
    mutationFn: (commentData: DeleteStrategyCommentRequest) =>
      deleteStrategyComment(commentData),
  });

export const useGetDailyExcelLink = (strategyId: string) => {
  const { data, isSuccess } = useQuery<Blob>({
    queryKey: ['dailyExcelLink'],
    queryFn: () => getDailyExcelLink(strategyId),
  });

  if (isSuccess && data) {
    return { data };
  }

  return { data: undefined };
};

export const useGetDailyDataExcelLink = (strategyId: string) => {
  const { data, isSuccess } = useQuery<Blob>({
    queryKey: ['dailyDataExcelLink'],
    queryFn: () => getDailyDataExcelLink(strategyId),
  });

  if (isSuccess && data) {
    return { data };
  }

  return { data: undefined };
};

export const useGetMonthlyExcelLink = (strategyId: string) => {
  const { data, isSuccess } = useQuery<Blob>({
    queryKey: ['monthlyExcelLink'],
    queryFn: () => getMonthlyExcelLink(strategyId),
  });

  if (isSuccess && data) {
    return { data };
  }

  return { data: undefined };
};
