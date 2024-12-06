import { useMutation, useQuery } from '@tanstack/react-query';
import {
  approveAdminStrategy,
  createAdminStocks,
  deleteAdminStocks,
  getAdminStocks,
  rejectAdminStrategy,
  StocksPaginatedResponse,
  StocksParameterProps,
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
