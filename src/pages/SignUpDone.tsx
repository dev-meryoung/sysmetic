import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';
import congratulation from '@/assets/images/congratulation.png';
import Button from '@/components/Button';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const SignUpDone = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const handleMainBtnClick = () => {
    navigate(PATH.ROOT);
  };

  const handleLoginBtnClick = () => {
    navigate(PATH.SIGN_IN);
  };

  return (
    <div css={wrapperStyle}>
      <div css={profileDivStyle}>
        <img src={congratulation} alt='congratulation' />
      </div>
      <div css={contentsDivStyle}>
        <h2>축하합니다. Sysmetic 회원가입이 완료되었습니다!</h2>
        {type === 'investor' ? (
          <p>
            Sysmetic과 함께 다양한 투자 전략들을 만나보세요. <br />
            좋은 전략을 Follow 하고, 문의하기를 통해 직접 트레이더에게 문의하실
            수 있습니다.
          </p>
        ) : (
          <p>
            Sysmetic을 통해 다양한 투자 전략들을 관리해 보세요. <br />
            회원님의 전략을 공유하고, 문의 및 댓글을 통해 직접 투자자들과
            소통하실 수 있습니다.
          </p>
        )}
      </div>
      <div css={buttonDivStyle}>
        <Button
          border={true}
          width={120}
          label='메인가기'
          handleClick={handleMainBtnClick}
        />
        <Button width={120} label='로그인' handleClick={handleLoginBtnClick} />
      </div>
    </div>
  );
};

const wrapperStyle = css`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  padding: 0 10px;
  margin: 0 auto;
  letter-spacing: -0.4px;
  display: flex;
  flex-direction: column;
`;

const profileDivStyle = css`
  width: 330px;
  height: 300px;
  margin: 96px auto 0;
  font-size: ${FONT_SIZE.TITLE_LG};
  letter-spacing: -0.72px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const contentsDivStyle = css`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 12px;
  margin-top: 40px;

  h2 {
    font-size: ${FONT_SIZE.TITLE_XS};
    font-weight: ${FONT_WEIGHT.BOLD};
  }

  p {
    line-height: 160%;
    letter-spacing: -0.32px;
  }
`;

const buttonDivStyle = css`
  display: flex;
  margin: 80px auto 96px;
  gap: 16px;
`;

export default SignUpDone;
