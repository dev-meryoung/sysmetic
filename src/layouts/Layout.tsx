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
  max-width: 1200px;
  height: 100vh;
  padding: 0 10px;
  margin: 0 auto;
`;

export default Layout;
