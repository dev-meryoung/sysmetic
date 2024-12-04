import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AdminUserData,
  deleteAdminUser,
  getAdminUserList,
  PaginatedResponse,
  updateAdminUserRole,
  UpDateUserRole,
} from '@/api';

export const useGetAdminUserList = (params: AdminUserData, enabled: boolean) =>
  useQuery<PaginatedResponse, Error>({
    queryKey: ['adminUserList', params],
    queryFn: () => getAdminUserList(params),
    enabled: !!enabled,
  });

//회원 등급 변경
export const useUpdateAdminUserRole = () =>
  useMutation({
    mutationFn: (params: UpDateUserRole) => updateAdminUserRole(params),
  });

//회원 강제 탈퇴
export const useDeleteAdminUser = () =>
  useMutation({
    mutationFn: async (membersId: number[]) => deleteAdminUser(membersId),
  });
