import axiosInstance from './axiosInstance';

export type RoleCodeTypes =
  | 'USER'
  | 'TRADER'
  | 'USER_MANAGER'
  | 'TRADER_MANAGER'
  | 'ADMIN';
export type TabButtonTypes = 'ALL' | 'USER' | 'TRADER' | 'MANAGER';
export interface AdminUserData {
  role?: TabButtonTypes;
  page?: number;
  searchType?: string;
  searchKeyword?: string;
}

export interface UserData {
  id: number;
  roleCode: RoleCodeTypes;
  email: string;
  name: string;
  nickname: string;
  birth: string;
  phoneNumber: string;
}

export interface PaginatedResponse {
  currentPage: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  content: UserData[];
}

// 회원 목록 조회 API
export const getAdminUserList = async (userList: AdminUserData) => {
  const queryParams = new URLSearchParams();

  if (userList.role) {
    queryParams.append('role', userList.role);
  }
  if (userList.page) {
    queryParams.append('page', String(userList.page));
  }
  if (userList.searchType) {
    queryParams.append('searchType', userList.searchType);
  }
  if (userList.searchKeyword) {
    queryParams.append('searchKeyword', userList.searchKeyword);
  }
  const response = await axiosInstance.get(
    `v1/admin/members?${queryParams.toString()}`
  );

  return response.data.data;
};

// 회원 등급 변경 API
export const updateAdminUserRole = async () => {};

// 회원 강제 탈퇴 API
export const deleteAdminUser = async () => {};

// 공지사항 등록 API
export const createAdminNotice = async () => {};

// 공지사항 목록 조회 API
export const getAdminNoticeList = async () => {};

// 공지사항 상세 정보 조회 API
export const getAdminNotice = async () => {};

// 전략 목록 조회 API
export const getAdminStrategyList = async () => {};
