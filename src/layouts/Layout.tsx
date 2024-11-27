import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import ToTopButton from '@/components/ToTopButton';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';
import useAuthStore from '@/stores/useAuthStore';

const Layout = () => {
  const { nickname } = useAuthStore();

  return (
    <div css={containerStyle}>
      <Header nickname={nickname} />
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
