import { useEffect } from 'react';
import { css } from '@emotion/react';
import { Outlet, useLocation } from 'react-router-dom';
import ToTopButton from '@/components/ToTopButton';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';
import useAuthStore from '@/stores/useAuthStore';

const Layout = () => {
  const location = useLocation();
  const { resetAuthState } = useAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      resetAuthState();
    }
  }, [location, resetAuthState]);

  return (
    <div css={containerStyle}>
      <Header />
      <main>
        <Outlet />
      </main>
      <ToTopButton />
      <Footer />
    </div>
  );
};
const containerStyle = css`
  width: 100%;
  height: 100%;
  margin: 0 auto;
`;

export default Layout;
