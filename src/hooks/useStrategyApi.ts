import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  CreateFolderRequest,
  getUserFolderList,
  createFolder,
  UpdateFolderNameRequest,
  deleteFolder,
  getAvailabilityFolder,
  getInterestStrategy,
  UpdateMoveFolderRequest,
  updateMoveFolder,
  CreateFollowFolderRequest,
  createFollowFolder,
  deleteSingleInterestStrategy,
  updateFolderName,
  getMethodAndStockList,
  getStrategyList,
  createStrategyItemFilter,
  CreateStrategyItemFilterRequest,
  getFilterdTrader,
  getTradersStrategyList,
  createStrategy,
  getFilterdStrategy,
  getStrategyAlgorithm,
  deleteInterestStrategy,
  DeleteFollowFolderRequest,
} from '@/api/strategyApi';

export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

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

// 전략 목록 조회
export const useGetStrategyList = (pageNum: number) =>
  useQuery({
    queryKey: ['strategies', pageNum],
    queryFn: () => getStrategyList(pageNum),
  });

// 매매방식, 종목 조회
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
// 전략 등록
export const useCreateStrategy = () =>
  useMutation({
    mutationFn: (formData: FormData) => createStrategy(formData),
  });

// 트레이더명 검색결과 조회
export const useGetFilterdTrader = (nickname: string, pageNum: number) =>
  useQuery({
    queryKey: ['filterdTrader', nickname, pageNum],
    queryFn: () => getFilterdTrader(nickname, pageNum),
  });

// 특정 트레이더 전략 조회
export const useGetTradersStrategyList = (traderId: number, pageNum: number) =>
  useQuery({
    queryKey: ['tradersStrategyList', traderId, pageNum],
    queryFn: () => getTradersStrategyList(traderId, pageNum),
  });

// 전략 상세 조건 필터링
export const useCreateStrategyItemFilter = () => {
  const mutation = useMutation<
    CreateStrategyItemFilterResponse,
    Error,
    { pageNum: number; requestBody: CreateStrategyItemFilterRequest }
  >({
    // API 호출 함수 연결
    mutationFn: ({ pageNum, requestBody }) =>
      createStrategyItemFilter(pageNum, requestBody),
  });

  return mutation;
};

// 알고리즘별 전략 필터링
export const useGetStrategyAlgorithmFilter = (
  pageNum: number,
  algorithm: string
) =>
  useQuery({
    queryKey: ['filterdStrategyAlgorithm', pageNum, algorithm],
    queryFn: () => getStrategyAlgorithm(pageNum, algorithm),
  });

// 전략명 검색
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

// 폴더 목록 조회
export const useGetUserFolderList = () =>
  useQuery({
    queryKey: ['folderList'],
    queryFn: () => getUserFolderList(),
  });

// 폴더 생성
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

// 폴더명 중복 검사
export const useCheckFolderAvailability = (folderName: string) =>
  useMutation<any, Error, string>({
    mutationKey: ['checkFolderAvailability', folderName],
    mutationFn: (name: string) => getAvailabilityFolder(name),
  });

// 폴더명 수정
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

// 폴더 삭제
export const useDeleteFolder = () => {
  const mutation = useMutation<any, Error, number>({
    mutationFn: (id: number) => deleteFolder(id),
  });

  return mutation;
};

// 폴더 내 관심전략 조회
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

// 관심전략 조회 훅

// 관심전략 폴더 이동
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

// 관심전략 등록
export const useCreateFollowFolder = () => {
  const mutation = useMutation<any, Error, CreateFollowFolderRequest>({
    mutationFn: (requestData: CreateFollowFolderRequest) =>
      createFollowFolder(requestData),
  });

  return mutation;
};

// 관심전략 단일 삭제
export const useDeleteSingleInterestStrategy = () => {
  const mutation = useMutation<any[], Error, number>({
    mutationFn: (strategyId: number) =>
      deleteSingleInterestStrategy(strategyId),
  });

  return mutation;
};

// 관심전략 선택 삭제 API
export const useDeleteInterestStrategy = () => {
  const mutation = useMutation<any, Error, DeleteFollowFolderRequest>({
    mutationFn: (requestData: DeleteFollowFolderRequest) =>
      deleteInterestStrategy(requestData),
  });

  return mutation;
};
