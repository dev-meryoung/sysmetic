import axiosInstance from '@/api/axiosInstance';

export interface CreateStrategyItemFilterRequest {
  methods: string[];
  cycle: string[];
  stockNames: string[];
  accumulatedProfitLossRateRangeStart: string;
  accumulatedProfitLossRateRangeEnd: string;
}

// 전략 목록 조회 API
export const getStrategyList = async (pageNum: number) => {
  const response = await axiosInstance.get('/v1/strategy/list', {
    params: {
      pageNum,
    },
  });

  return response.data;
};

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

// 전략 상세 조건 필터링 API
export const createStrategyItemFilter = async (
  pageNum: number,
  requestBody: CreateStrategyItemFilterRequest
) => {
  const response = await axiosInstance.post(
    '/v1/strategy/search/conditions',
    requestBody,
    {
      headers: {
        pageNum,
      },
    }
  );

  return response.data;
};

// 알고리즘별 전략 필터링 API
export const getStrategyAlgorithm = async (
  pageNum: number,
  algorithm: string
) => {
  const response = await axiosInstance.get('/v1/strategy/search/algorithm', {
    params: {
      pageNum,
      algorithm,
    },
  });

  return response.data;
};

// 전략명 검색 API
export const getFilterdStrategy = async (keyword: string, pageNum: number) => {
  const response = await axiosInstance.get('/v1/strategy/list/name', {
    params: {
      keyword,
      pageNum,
    },
  });

  return response.data;
};

// 트레이더명 검색결과 조회 API
export const getFilterdTrader = async (nickname: string, pageNum: number) => {
  const response = await axiosInstance.get('/v1/strategy/list/trader', {
    params: {
      nickname,
      pageNum,
    },
  });

  return response.data;
};

// 특정 트레이더 전략 조회 API
export const getTradersStrategyList = async (
  traderId: number,
  pageNum: number
) => {
  const response = await axiosInstance.get('/v1/strategy/list/pick', {
    params: {
      traderId,
      pageNum,
    },
  });

  return response.data;
};

// 폴더 목록 조회 API
export const getUserFolderList = async () => {
  const response = await axiosInstance.get('/v1/member/folder');

  return response.data;
};

export interface CreateFolderRequest {
  name: string;
  checkDupl: boolean;
}

// 폴더 생성 API
export const createFolder = async (requestData: CreateFolderRequest) => {
  const response = await axiosInstance.post('/v1/member/folder', requestData);

  return response.data;
};

// 폴더명 중복 검사 API
export const getAvailabilityFolder = async (folderName: string) => {
  const response = await axiosInstance.get('/v1/member/folder/availability', {
    params: {
      folderName,
    },
  });

  return response.data;
};

export interface UpdateFolderNameRequest {
  folderId: number;
  folderName: string;
  checkDupl: boolean;
}

// 폴더명 수정 API
export const updateFolderName = async (
  requestData: UpdateFolderNameRequest
) => {
  const response = await axiosInstance.put('/v1/member/folder', requestData);
  return response.data;
};

// 폴더 삭제 API
export const deleteFolder = async (id: number) => {
  const response = await axiosInstance.delete(`/v1/member/folder/${id}`);

  return response.data;
};

// 폴더 내 관심전략 조회 API
export const getInterestStrategy = async (folderId: number, page: number) => {
  const response = await axiosInstance.get('/v1/member/interestStrategy', {
    params: {
      folderId,
      page,
    },
  });

  return response.data;
};

export interface UpdateMoveFolderRequest {
  originFolderId: number;
  toFolderId: number;
  strategyId: number;
}

// 관심전략 폴더 이동 API
export const updateMoveFolder = async (
  requestData: UpdateMoveFolderRequest
) => {
  const response = await axiosInstance.put('/v1/strategy/follow', requestData);

  return response.data;
};

export interface CreateFollowFolderRequest {
  folderId: number;
  strategyId: number;
}

// 관심전략 등록 API
export const createFollowFolder = async (
  requestData: CreateFollowFolderRequest
) => {
  const response = await axiosInstance.post('/v1/strategy/follow', requestData);

  return response.data;
};

export interface DeleteFollowFolderRequest {
  strategyId: number[];
}

// 관심전략 단일 삭제 API
export const deleteSingleInterestStrategy = async (strategyId: number) => {
  const response = await axiosInstance.delete(
    `/v1/strategy/follow/${strategyId}`
  );

  return response.data;
};

// 관심전략 선택 삭제 API
export const deleteInterestStrategy = async (
  requestData: DeleteFollowFolderRequest
) => {
  const response = await axiosInstance.delete('/v1/strategy/followlist', {
    data: requestData,
  });

  return response.data;
};

// 트레이더 전략 목록 조회 API
export const getTraderAddStrategyList = async (page: number) => {
  const response = await axiosInstance.get(
    `/v1/trader/member/strategy/${page}`
  );

  return response.data;
};

export interface DeleteTraderAddStrategyListRequest {
  idList: number[];
}

// 트레이더가 올린 전략 삭제 API
export const deleteTraderAddStrategyList = async (
  requestData: DeleteTraderAddStrategyListRequest
) => {
  const response = await axiosInstance.delete('/v1/trader/strategy', {
    data: requestData,
  });

  return response.data;
};
