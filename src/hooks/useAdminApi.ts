import { useQuery } from '@tanstack/react-query';
import { AdminUserData } from '@/api';
import { getAdminUserList, PaginatedResponse } from '@/api/adminApi';

export const useGetAdminUserList = (params: AdminUserData, enabled: boolean) =>
  useQuery<PaginatedResponse, Error>({
    queryKey: ['adminUserList', params],
    queryFn: () => getAdminUserList(params),
    enabled: !!enabled,
  });
