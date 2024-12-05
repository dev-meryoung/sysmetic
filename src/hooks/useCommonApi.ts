import { useQuery, useMutation } from '@tanstack/react-query';
import {
  GetInquiryData,
  GetInquiryDetailData,
  CreateAnswerData,
  UpdateInquiryData,
  CreateInquiryData,
  getEditInquiry,
  updateInquiry,
  createAnswer,
  getCreateInquiry,
  getInquiryListTrader,
  getInquiryDetailTrader,
  getInquiryListUser,
  getInquiryDetailUser,
  deleteInquiry,
  createUserInquiry,
  getNoticeList,
  GetNoticeListData,
  getNoticeDetail,
  GetNoticeDetailData,
} from '@/api';
import { getMainPage, getMainPageChart } from '@/api/commonApi';
interface MainPageDataProps {
  data: {
    rankedTrader: {
      id: number;
      nickname: string;
      followerCount: number;
      accumProfitLossRate: number;
      traderProfileImage: string;
    }[];

    totalTraderCount: number;
    totalStrategyCount: number;

    smScoreTopFives: {
      id: number;
      traderProfileImage: string;
      traderId: number;
      nickname: string;
      name: string;
      accumulatedProfitLossRate: number;
      smScore: number;
      stocks: {
        stockIds: number[];
        stockNames: string[];
      }[];
    }[];
  };
}

// 메인페이지 조회
export const useGetMainPage = () =>
  useQuery<MainPageDataProps>({
    queryKey: ['mainPage'],
    queryFn: () => getMainPage(),
  });

// 메인페이지 차트 정보 조회
export const useGetMainPageChart = (period: string) =>
  useQuery({
    queryKey: ['mainChart', period],
    queryFn: () => getMainPageChart(),
  });

// 질문자 문의 수정 화면 조회
export const useGetEditInquiry = (
  params: GetInquiryDetailData,
  enabled: boolean = true
) =>
  useQuery({
    queryKey: ['getEditInquiry', params],
    queryFn: () => getEditInquiry(params),
    enabled,
  });

// 트레이더 문의 상세 조회
export const useGetInquiryDetailUser = (
  params: GetInquiryDetailData,
  enabled: boolean = true
) =>
  useQuery({
    queryKey: ['getInquiryDetailUser', params],
    queryFn: () => getInquiryDetailUser(params),
    enabled,
  });

// 질문자 문의 상세 조회
export const useGetInquiryDetailTrader = (
  params: GetInquiryDetailData,
  enabled: boolean = true
) =>
  useQuery({
    queryKey: ['getInquiryDetailTrader', params],
    queryFn: () => getInquiryDetailTrader(params),
    enabled,
  });

// 질문자 문의 등록 화면 조회
export const useGetCreateInquiry = (
  strategyId: number,
  enabled: boolean = true
) =>
  useQuery({
    queryKey: ['getCreateInquiry', strategyId],
    queryFn: () => getCreateInquiry(strategyId),
    enabled,
  });

// 트레이더 문의 목록 조회
export const useGetInquiryListTrader = (
  params: GetInquiryData,
  enabled: boolean = true
) =>
  useQuery({
    queryKey: ['getInquiryListTrader', params],
    queryFn: () => getInquiryListTrader(params),
    enabled,
  });

// 질문자 문의 목록 조회
export const useGetInquiryListUser = (
  params: GetInquiryData,
  enabled: boolean = true
) =>
  useQuery({
    queryKey: ['getInquiryListUser', params],
    queryFn: () => getInquiryListUser(params),
    enabled,
  });

// 질문자 문의 수정
export const useUpdateInquiry = () =>
  useMutation({
    mutationFn: (editData: UpdateInquiryData) => updateInquiry(editData),
  });

// 트레이더 답변 등록
export const useCreateAnswer = () =>
  useMutation({
    mutationFn: (answerData: CreateAnswerData) => createAnswer(answerData),
  });

// 질문자 문의 삭제
export const useDeleteInquiry = () =>
  useMutation({
    mutationFn: (qnaId: number) => deleteInquiry(qnaId),
  });

// 질문자 문의 등록
export const useCreateUserInquiry = () =>
  useMutation({
    mutationFn: (createData: CreateInquiryData) =>
      createUserInquiry(createData),
  });

// 사용자 공지 목록 조회
export const useGetNoticeList = (params: GetNoticeListData) =>
  useQuery({
    queryKey: ['getNoticeList', params],
    queryFn: () => getNoticeList(params),
  });

// 사용자 공지 상세 조회
export const useGetNoticeDetail = (params: GetNoticeDetailData) =>
  useQuery({
    queryKey: ['getNoticeDetail', params],
    queryFn: () => getNoticeDetail(params),
  });
