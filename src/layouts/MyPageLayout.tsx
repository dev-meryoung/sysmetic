import { Outlet } from 'react-router-dom';

const MyPageLayout = () => (
  <div>
    마이페이지 인덱스입니다.
    <Outlet />
  </div>
);

export default MyPageLayout;
