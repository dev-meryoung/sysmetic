import { useMutation, useQuery } from '@tanstack/react-query';
import {
  approveAdminStrategy,
  createAdminMethods,
  createAdminStocks,
  deleteAdminMethods,
  deleteAdminStocks,
  getAdminMethods,
  getAdminStocks,
  MethodsPaginatedResponse,
  MethodsParameterProps,
  rejectAdminStrategy,
  StocksPaginatedResponse,
  StocksParameterProps,
  updateAdminMethods,
  updateAdminStocks,
} from '@/api';

export const useApproveAdminStrategy = () =>
  useMutation({
    mutationFn: (approveData: { strategyId: number[] }) =>
      approveAdminStrategy(approveData),
  });

export const useRejectAdminStrategy = () =>
  useMutation({
    mutationFn: (rejectData: { strategyId: number; rejectReason: string }) =>
      rejectAdminStrategy(rejectData),
  });

export const useGetAdminStocks = (
  params: StocksParameterProps,
  enabled: boolean
) =>
  useQuery<StocksPaginatedResponse, Error>({
    queryKey: ['adminStocks', params],
    queryFn: () => getAdminStocks(params),
    enabled: !!enabled,
  });

export const useCreateAdminStocks = () =>
  useMutation({
    mutationFn: createAdminStocks,
  });

export const useDeleteAdminStocks = () =>
  useMutation({
    mutationFn: deleteAdminStocks,
  });

export const useUpdateAdminStocks = () =>
  useMutation({
    mutationFn: updateAdminStocks,
  });

export const useGetAdminMethods = (
  params: MethodsParameterProps,
  enabled: boolean
) =>
  useQuery<MethodsPaginatedResponse, Error>({
    queryKey: ['adminMethods', params],
    queryFn: () => getAdminMethods(params),
    enabled: !!enabled,
  });

export const useCreateAdminMethods = () =>
  useMutation({
    mutationFn: createAdminMethods,
  });

export const useDeleteAdminMethods = () =>
  useMutation({
    mutationFn: deleteAdminMethods,
  });

export const useUpdateAdminMethods = () =>
  useMutation({
    mutationFn: updateAdminMethods,
  });
