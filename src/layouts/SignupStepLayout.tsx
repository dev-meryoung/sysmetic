import { Outlet } from 'react-router-dom';

const SignupStepLayout = () => (
  <div>
    회원가입 공통부분 작업 영역
    <Outlet />
  </div>
);

export default SignupStepLayout;
