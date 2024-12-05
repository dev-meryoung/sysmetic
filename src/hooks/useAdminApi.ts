import { useMutation, useQuery } from '@tanstack/react-query';
import {
  approveAdminStrategy,
  createAdminStocks,
  getAdminStocks,
  rejectAdminStrategy,
  StocksPaginatedResponse,
  StocksParameterProps,
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
