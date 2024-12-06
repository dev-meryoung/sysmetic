import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const SignUp = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(PATH.SIGN_UP_TYPE('investor'));
  };

  const handleTraderClick = () => {
    navigate(PATH.SIGN_UP_TYPE('trader'));
  };

  return (
    <div css={wrapperStyle}>
      <h1 css={titleStyle}>회원가입</h1>
      <div css={contentsDivStyle}>
        <h2>
          <span>시스메틱</span>에 오신 것을 환영합니다.
        </h2>
        <p>
          시스메틱 홈페이지의 회원이 되시면 전략탐색, 전략등록 등 다양한
          서비스를 이용하실 수 있습니다.
        </p>
        <p>투자자로 가입 시, 관심있는 전략만 별도로 관리할 수 있습니다.</p>
        <p>트레이더로 가입 시, 자신의 전략을 저장하고 공유할 수 있습니다.</p>
      </div>
      <div css={buttonDivStyle}>
        <Button
          size='xl'
          fontWeight={700}
          fontSize='32px'
          width={580}
          label='투자자 가입'
          handleClick={handleClick}
        />
        <Button
          size='xl'
          fontWeight={700}
          fontSize='32px'
          width={580}
          color='primary700'
          label='트레이더 가입'
          handleClick={handleTraderClick}
        />
      </div>
      <div css={alertDivStyle}>
        <p>* 일반회원은 투자자로 가입하시면 됩니다.</p>
      </div>
    </div>
  );
};

const wrapperStyle = css`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1200px;
  padding: 0 10px;
  margin: 96px auto 96px;
  letter-spacing: -0.4px;
`;

const titleStyle = css`
  width: 82px;
  height: 24px;
  font-weight: ${FONT_WEIGHT.BOLD};
  font-size: ${FONT_SIZE.TITLE_SM};
  line-height: 24px;
  margin-bottom: 40px;
`;

const contentsDivStyle = css`
  border: 1px solid ${COLOR_OPACITY.PRIMARY_OPACITY10};
  padding: 30px 26px;

  h2 {
    font-size: ${FONT_SIZE.TITLE_XS};
    margin-bottom: 11px;
  }

  h2 > span {
    color: ${COLOR.PRIMARY};
    font-weight: ${FONT_WEIGHT.BOLD};
  }

  p {
    line-height: 160%;
  }
`;

const buttonDivStyle = css`
  display: flex;
  gap: 20px;
  margin-top: 40px;

  p {
    color: ${COLOR.POINT};
  }
`;

const alertDivStyle = css`
  color: ${COLOR.POINT};
  font-size: ${FONT_SIZE.TEXT_MD};
  line-height: 160%;
  letter-spacing: -0.32px;
  padding-top: 8px;
`;

export default SignUp;
