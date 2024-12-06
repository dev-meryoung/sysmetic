import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';

const RequireAdmin: React.FC = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const roleCode = useAuthStore((state) => state.roleCode);
  const location = useLocation();

  const isAdmin = roleCode === 'MANAGER' || roleCode === 'ADMIN';

  if (!isLoggedIn) {
    return <Navigate to={PATH.ROOT} replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to={PATH.ROOT} replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
