import { useEffect } from 'react';
import { css } from '@emotion/react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const SignupStepLayout = () => {
  const { type } = useParams();
  const location = useLocation().pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div css={signUpStepLayoutWrapperStyle}>
      <h1 className='title'>회원가입</h1>
      <div className='step-inner-layout'>
        <div css={signUpStepStyle(location, type)}>
          <div className='step1'>
            <h2>STEP 1</h2>
            <h3>약관동의</h3>
          </div>
          <div className='step2'>
            <h2>STEP 2</h2>
            <h3>정보입력</h3>
          </div>
          <div className='step3'>
            <h2>STEP 3</h2>
            <h3>가입완료</h3>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

const signUpStepLayoutWrapperStyle = css`
  width: 100%;
  margin: 0 auto;
  letter-spacing: -0.4px;

  h1 {
    max-width: 1200px;
  }

  .step-inner-layout {
    width: 100%;
    height: 120px;
    background-color: ${COLOR.GRAY};
  }

  .title {
    height: 24px;
    font-weight: ${FONT_WEIGHT.BOLD};
    font-size: ${FONT_SIZE.TITLE_SM};
    line-height: 24px;
    margin: 96px auto 40px;
    padding: 0 10px;
  }
`;

const signUpStepStyle = (location: string, type: string | undefined) => css`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 0 10px;

  .step1,
  .step2,
  .step3 {
    width: 160px;
    height: 120px;
    padding: 17px 54px 33px 24px;
    flex-shrink: 0;
    color: ${COLOR.WHITE};
    line-height: 160%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h2 {
      font-size: ${FONT_SIZE.TEXT_LG};
      letter-spacing: -0.36px;
    }

    h3 {
      font-size: ${FONT_SIZE.TITLE_SM};
      font-weight: ${FONT_WEIGHT.BOLD};
      letter-spacing: -0.48px;
    }
  }

  .step1 {
    background-color: ${location === `/signup/step/${type}`
      ? COLOR.PRIMARY
      : COLOR.GRAY};
  }
  .step2 {
    background-color: ${location === `/signup/step/${type}/form`
      ? COLOR.PRIMARY
      : COLOR.GRAY};
  }
  .step3 {
    background-color: ${location === `/signup/step/${type}/done`
      ? COLOR.PRIMARY
      : COLOR.GRAY};
  }
`;

export default SignupStepLayout;
