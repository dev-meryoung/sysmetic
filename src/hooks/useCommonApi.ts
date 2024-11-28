import { useMutation } from '@tanstack/react-query';
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

export const useGetEditInquiry = () =>
  useMutation({
    mutationFn: (params: GetInquiryDetailData) => getEditInquiry(params),
  });

export const useUpdateInquiry = () =>
  useMutation({
    mutationFn: (editData: UpdateInquiryData) => updateInquiry(editData),
  });

export const useCreateAnswer = () =>
  useMutation({
    mutationFn: (answerData: CreateAnswerData) => createAnswer(answerData),
  });

export const useGetCreateInquiry = () =>
  useMutation({
    mutationFn: (strategyId: number) => getCreateInquiry(strategyId),
  });

export const useCreateInquiry = () =>
  useMutation({
    mutationFn: (inquiryData: CreaeteInquiryData) => createInquiry(inquiryData),
  });

export const useGetInquiryListTrader = () =>
  useMutation({
    mutationFn: (params: GetInquiryData) => getInquiryListTrader(params),
  });

export const useGetInquiryDetailTrader = () =>
  useMutation({
    mutationFn: (params: GetInquiryDetailData) =>
      getInquiryDetailTrader(params),
  });

export const useGetInquiryListUser = () =>
  useMutation({
    mutationFn: (params: GetInquiryData) => getInquiryListUser(params),
  });

export const useGetInquiryDetailUser = () =>
  useMutation({
    mutationFn: (params: GetInquiryDetailData) => getInquiryDetailUser(params),
  });

export const useDeleteInquiry = () =>
  useMutation({
    mutationFn: (inquiryId: number) => deleteInquiry(inquiryId),
  });
