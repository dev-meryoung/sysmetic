import { create } from 'zustand';
import { checkAuth } from '@/api';

type RoleCodeTypes = '' | 'USER' | 'TRADER' | 'MANAGER' | 'ADMIN';

interface AuthConfig {
  isLoggedIn: boolean;
  memberId: number;
  email: string;
  phoneNumber: string;
  name: string;
  nickname: string;
  roleCode: RoleCodeTypes;
  profileImage: string | null;
  totalFollowerCount: number;
  totalStrategyCount: number;
  receiveInfoConsent: boolean;
  receiveMarketingConsent: boolean;
}

interface AuthStateProps extends AuthConfig {
  setAuthState: (authData: AuthConfig) => void;
  resetAuthState: () => void;
  initializeAuth: () => Promise<void>;
  isAuthInitialized: boolean;
}

const resetState = (set: Function) => {
  set({
    isLoggedIn: false,
    memberId: 0,
    email: '',
    phoneNumber: '',
    name: '',
    nickname: '',
    roleCode: '',
    profileImage: null,
    totalFollowerCount: 0,
    totalStrategyCount: 0,
    receiveInfoConsent: false,
    receiveMarketingConsent: false,
    isAuthInitialized: true,
  });
  localStorage.removeItem('token');
};

const updateState = (set: Function, authData: AuthConfig) => {
  set({
    isLoggedIn: true,
    memberId: authData.memberId,
    email: authData.email,
    phoneNumber: authData.phoneNumber,
    name: authData.name,
    nickname: authData.nickname,
    roleCode: authData.roleCode,
    profileImage: authData.profileImage,
    totalFollowerCount: authData.totalFollowerCount,
    totalStrategyCount: authData.totalStrategyCount,
    receiveInfoConsent: authData.receiveInfoConsent,
    receiveMarketingConsent: authData.receiveMarketingConsent,
    isAuthInitialized: true,
  });
};

const useAuthStore = create<AuthStateProps>((set) => ({
  isLoggedIn: false,
  memberId: 0,
  email: '',
  phoneNumber: '',
  name: '',
  nickname: '',
  roleCode: '',
  profileImage: null,
  totalFollowerCount: 0,
  totalStrategyCount: 0,
  receiveInfoConsent: false,
  receiveMarketingConsent: false,
  isAuthInitialized: false,

  setAuthState: (authData) => updateState(set, authData),

  resetAuthState: () => resetState(set),

  initializeAuth: async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const authData = await checkAuth();
        updateState(set, authData.data);
      } catch {
        resetState(set);
      }
    } else {
      set({ isAuthInitialized: true });
    }
  },
}));

export default useAuthStore;