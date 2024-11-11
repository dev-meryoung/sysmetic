import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';

const SignupStepLayout = () => (
  <div css={signUpStepLayoutWrapperStyle}>
    <h1 className='title'>회원가입</h1>
    <div className='step-inner-layout'>
      <div css={signUpStepStyle}>
        <div className='step'>
          <h2>STEP 1</h2>
          <h3>약관동의</h3>
        </div>
        <div className='step'>
          <h2>STEP 2</h2>
          <h3>정보입력</h3>
        </div>
        <div className='step'>
          <h2>STEP 3</h2>
          <h3>가입완료</h3>
        </div>
      </div>
    </div>
    <Outlet />
  </div>
);

const signUpStepLayoutWrapperStyle = css`
  width: 100%;
  margin: 0 auto;
  color: #000;
  letter-spacing: -0.4px;

  h1 {
    max-width: 1200px;
  }

  .step-inner-layout {
    width: 100%;
    height: 120px;
    background-color: #ccc;
  }

  .title {
    height: 24px;
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;
    margin: 96px auto 40px;
    padding: 0 10px;
  }
`;

const signUpStepStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 0 10px;

  .step {
    width: 160px;
    height: 120px;
    padding: 17px 54px 33px 24px;
    flex-shrink: 0;
    background-color: #1261c4;
    color: #fff;
    line-height: 160%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h2 {
      font-size: 18px;
      letter-spacing: -0.36px;
    }

    h3 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.48px;
    }
  }
`;

export default SignupStepLayout;
