import axiosInstance from '@/api/axiosInstance';
import {
  CreateMyStrategyDailyRequest,
  DeleteMyStrategyAccountRequest,
  DeleteTraderAddStrategyListRequest,
  CreateFolderRequest,
  CreateFollowFolderRequest,
  CreateStrategyItemFilterRequest,
  DeleteFollowFolderRequest,
  UpdateFolderNameRequest,
  UpdateMoveFolderRequest,
} from '@/hooks/useStrategyApi';

// 매매방식 및 운용 종목 목록 조회 API
export const getMethodAndStockList = async () => {
  const response = await axiosInstance.get(
    '/v1/trader/strategy/method-and-stock'
  );

  return response.data;
};

// 전략 목록 조회 API
export const getStrategyList = async (pageNum: number) => {
  const response = await axiosInstance.get('/v1/strategy/list', {
    params: {
      pageNum,
    },
  });

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

// 관심전략 폴더 이동 API
export const updateMoveFolder = async (
  requestData: UpdateMoveFolderRequest
) => {
  const response = await axiosInstance.put('/v1/strategy/follow', requestData);

  return response.data;
};

// 관심전략 등록 API
export const createFollowFolder = async (
  requestData: CreateFollowFolderRequest
) => {
  const response = await axiosInstance.post('/v1/strategy/follow', requestData);

  return response.data;
};

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

// 트레이더 전략 목록 조회 API
export const getTraderAddStrategyList = async (page: number) => {
  const response = await axiosInstance.get(
    `/v1/trader/member/strategy/${page}`
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

// 전략 분석 그래프 데이터 조회 API
export const getStrategyAnalysis = async (strategyId: string) => {
  const response = await axiosInstance.get(
    `/v1/strategy/detail/analysis/${strategyId}`
  );

  return response.data;
};

// 전략 통계 정보 조회 API
export const getStrategyStatistics = async (strategyId: string) => {
  const response = await axiosInstance.get(
    `/v1/strategy/statistics/${strategyId}`
  );

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

// 전략 일간분석 엑셀 다운로드 API
export const getDailyExcelLink = async (strategyId: string) => {
  const response = await axiosInstance.get(`/v1/excel/daily/${strategyId}`, {
    responseType: 'blob',
  });

  return response.data;
};

// 전략 일간분석 엑셀 다운로드 API
export const getDailyDataExcelLink = async (strategyId: string) => {
  const response = await axiosInstance.get(
    `/v1/excel/daily/statistics/${strategyId}`,
    {
      responseType: 'blob',
    }
  );

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

// 전략 월간분석 엑셀 다운로드 API
export const getMonthlyExcelLink = async (strategyId: string) => {
  const response = await axiosInstance.get(`/v1/excel/monthly/${strategyId}`, {
    responseType: 'blob',
  });

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

// 전략(관리) 상세 정보 조회 API
export const getMyStrategyInfo = async (strategyId: string) => {
  const response = await axiosInstance.get(`/v1/strategy/${strategyId}`);

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

// 전략 댓글 조회 API
export const getStrategyComment = async (strategyId: string, page: number) => {
  const response = await axiosInstance.get(
    `/v1/strategy/${strategyId}/replies`,
    {
      params: {
        page,
      },
    }
  );

  return response.data;
};

// 전략 댓글 등록 API
export const createStrategyComment = async (commentData: {
  strategyId: number;
  content: string;
}) => {
  const response = await axiosInstance.post(
    `/v1/strategy/reply`,
    JSON.stringify(commentData),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

// 전략 댓글 삭제 API
export const deleteStrategyComment = async (commentData: {
  strategyId: number;
  replyId: number;
}) => {
  const response = await axiosInstance.delete(`/v1/strategy/reply`, {
    data: commentData,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
