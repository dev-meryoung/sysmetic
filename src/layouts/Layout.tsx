import { Outlet } from 'react-router-dom';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';

const Layout = () => (
  <main>
    <Header />
    <Outlet />
    <Footer />
  </main>
);

export default Layout;
