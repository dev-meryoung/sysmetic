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
} from '@/api';

// 질문자 문의 수정 화면 조회
export const useGetEditInquiry = (params: GetInquiryDetailData) =>
  useQuery({
    queryKey: ['getEditInquiry', params],
    queryFn: () => getEditInquiry(params),
  });

// 질문자 문의 등록 화면 조회
export const useGetCreateInquiry = (strategyId: number) =>
  useQuery({
    queryKey: ['getCreateInquiry', strategyId],
    queryFn: () => getCreateInquiry(strategyId),
  });

// 트레이더 문의 목록 조회
export const useGetInquiryListTrader = (params: GetInquiryData) =>
  useQuery({
    queryKey: ['getInquiryListTrader', params],
    queryFn: () => getInquiryListTrader(params),
  });

// 트레이더 문의 상세 조회
export const useGetInquiryDetailTrader = (params: GetInquiryDetailData) =>
  useQuery({
    queryKey: ['getInquiryDetailTrader', params],
    queryFn: () => getInquiryDetailTrader(params),
  });

// 질문자 문의 상세 조회
export const useGetInquiryDetailUser = (params: GetInquiryDetailData) =>
  useQuery({
    queryKey: ['getInquiryDetailUser', params],
    queryFn: () => getInquiryDetailUser(params),
  });

// 질문자 문의 목록 조회
export const useGetInquiryListUser = (params: GetInquiryData) =>
  useQuery({
    queryKey: ['getInquiryListUser', params],
    queryFn: () => getInquiryListUser(params),
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
