import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';

const Layout = () => (
  <div css={containerStyle}>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

const containerStyle = css`
  width: 100%;
  height: 100%;
  margin: 0 auto;
`;

export default Layout;
