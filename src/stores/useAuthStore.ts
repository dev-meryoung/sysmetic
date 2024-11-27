import { create } from 'zustand';
import { checkAuth } from '@/api';

interface AuthConfig {
  memberId: number;
  email: string;
  nickname: string;
  role: string;
  profileImage: string | null;
}

interface AuthStateProps extends AuthConfig {
  setAuthState: (authData: AuthConfig) => void;
  resetAuthState: () => void;
  initializeAuth: () => Promise<void>;
}

const resetState = (set: Function) => {
  set({
    memberId: 0,
    email: '',
    nickname: '',
    role: '',
    profileImage: null,
  });
  localStorage.removeItem('token');
};

const updateState = (set: Function, authData: AuthConfig) => {
  set({
    memberId: authData.memberId,
    email: authData.email,
    nickname: authData.nickname,
    role: authData.role,
    profileImage: authData.profileImage,
  });
};

const useAuthStore = create<AuthStateProps>((set) => ({
  memberId: 0,
  email: '',
  nickname: '',
  role: '',
  profileImage: null,

  setAuthState: (authData) => updateState(set, authData),

  resetAuthState: () => resetState(set),

  initializeAuth: async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const authData = await checkAuth();
        updateState(set, authData);
      } catch {
        resetState(set);
      }
    }
  },
}));

export default useAuthStore;
