import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';

const RequireAuth: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const location = useLocation();

  if (!isLoggedIn && isAuthInitialized) {
    return <Navigate to={PATH.SIGN_IN} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
