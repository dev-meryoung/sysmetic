import { useQuery, useMutation } from '@tanstack/react-query';
import {
  GetInquiryData,
  GetInquiryDetailData,
  CreateAnswerData,
  CreaeteInquiryData,
  UpdateInquiryData,
  getEditInquiry,
  updateInquiry,
  createAnswer,
  getCreateInquiry,
  createInquiry,
  getInquiryListTrader,
  getInquiryDetailTrader,
  getInquiryListUser,
  getInquiryDetailUser,
  deleteInquiry,
} from '@/api';

export const useGetEditInquiry = (params: GetInquiryDetailData) =>
  useQuery({
    queryKey: ['getEditInquiry', params],
    queryFn: () => getEditInquiry(params),
    enabled: !!params,
  });

export const useGetCreateInquiry = (strategyId: number) =>
  useQuery({
    queryKey: ['getCreateInquiry', strategyId],
    queryFn: () => getCreateInquiry(strategyId),
    enabled: !!strategyId,
  });

export const useGetInquiryListTrader = (params: GetInquiryData) =>
  useQuery({
    queryKey: ['getInquiryListTrader', params],
    queryFn: () => getInquiryListTrader(params),
    enabled: !!params,
  });

export const useGetInquiryDetailTrader = (params: GetInquiryDetailData) =>
  useQuery({
    queryKey: ['getInquiryDetailTrader', params],
    queryFn: () => getInquiryDetailTrader(params),
    enabled: !!params,
  });

export const useGetInquiryListUser = (params: GetInquiryData) =>
  useQuery({
    queryKey: ['getInquiryListUser', params],
    queryFn: () => getInquiryListUser(params),
    enabled: !!params,
  });

export const useGetInquiryDetailUser = (params: GetInquiryDetailData) =>
  useQuery({
    queryKey: ['getInquiryDetailUser', params],
    queryFn: () => getInquiryDetailUser(params),
    enabled: !!params,
  });

export const useUpdateInquiry = () =>
  useMutation({
    mutationFn: (editData: UpdateInquiryData) => updateInquiry(editData),
  });

export const useCreateAnswer = () =>
  useMutation({
    mutationFn: (answerData: CreateAnswerData) => createAnswer(answerData),
  });

export const useCreateInquiry = () =>
  useMutation({
    mutationFn: (inquiryData: CreaeteInquiryData) => createInquiry(inquiryData),
  });

export const useDeleteInquiry = () =>
  useMutation({
    mutationFn: (inquiryId: number) => deleteInquiry(inquiryId),
  });
