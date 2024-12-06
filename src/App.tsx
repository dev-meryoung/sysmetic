import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@/routes/Router';
import useAuthStore from '@/stores/useAuthStore';
import GlobalStyles from '@/styles/GlobalStyles';

const App = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
    </>
  );
};
export default App;
