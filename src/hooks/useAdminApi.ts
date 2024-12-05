import { useQuery, useMutation } from '@tanstack/react-query';
import {
  approveAdminStrategy,
  rejectAdminStrategy,
  getAdminNoticeList,
  GetAdminNoticeListData,
  getAdminNotice,
  GetAdminNoticeData,
  updateAdminNotice,
  deleteAdminNotice,
  updateAdminNoticeStatus,
  createAdminNotice,
  deleteAdminNoticeList,
  getAdminNoticeEdit,
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

// 공지사항 목록 조회 API
export const useGetAdminNoticeList = (params: GetAdminNoticeListData) =>
  useQuery({
    queryKey: ['getAdminNoticeList', params],
    queryFn: () => getAdminNoticeList(params),
  });

// 공지사항 상세 정보 조회 API
export const useGetAdminNotice = (params: GetAdminNoticeData) =>
  useQuery({
    queryKey: ['getAdminNotice', params],
    queryFn: () => getAdminNotice(params),
  });

// 공지사항 수정 API
export const useUpdateAdminNotice = () =>
  useMutation({
    mutationFn: (noticeId: string) => updateAdminNotice(noticeId),
  });

// 공지사항 삭제 API
export const useDeleteAdminNotice = () =>
  useMutation({
    mutationFn: (noticeId: string) => deleteAdminNotice(noticeId),
  });

// 공지사항 목록에서 개별 공개여부 수정 API
export const useUpdateAdminNoticeStatus = () =>
  useMutation({
    mutationFn: (noticeId: string) => updateAdminNoticeStatus(noticeId),
  });

// 공지사항 등록 API
export const useCreateAdminNotice = () =>
  useMutation({
    mutationFn: () => createAdminNotice(),
  });

// 공지사항 목록 삭제 API
export const useDeleteAdminNoticeList = () =>
  useMutation({
    mutationFn: () => deleteAdminNoticeList(),
  });

// 공지사항 수정 화면 조회 API
export const useGetAdminNoticeEdit = (noticeId: string) =>
  useQuery({
    queryKey: ['adminNoticeEdit', noticeId],
    queryFn: () => getAdminNoticeEdit(noticeId),
  });
