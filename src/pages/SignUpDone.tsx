import { css } from '@emotion/react';

const SignUpDone = () => (
  <div css={WrapperStyle}>
    <div css={ProfileDivStyle}>
      <img
        src='https://img.animalplanet.co.kr/news/2020/08/06/700/yaj83kp9p731j819tcda.jpg'
        alt='my-profile'
      />
    </div>
    <div css={ContentsDivStyle}>
      <h2>축하합니다. Sysmetic 회원가입이 완료되었습니다!</h2>
      <p>
        Sysmetic과 함께 투자하는 전략들을 만나보세요. <br />
        좋은 전략을 Follow 하고, 문의하기를 통해 직접 트레이더에게 문의하실 수
        있습니다.
      </p>
    </div>
    <div css={ButtonDivStyle}>
      <button className='main-btn'>메인가기</button>
      <button className='login-btn'>로그인</button>
    </div>
  </div>
);

const WrapperStyle = css`
  width: 100%;
  height: 100%;
  max-width: 1200px;
  padding: 0 10px;
  margin: 0 auto;
  color: #000;
  letter-spacing: -0.4px;
  font-weight: 400;
  display: flex;
  flex-direction: column;
`;

const ProfileDivStyle = css`
  width: 300px;
  height: 300px;
  margin: 96px auto 0;
  border-radius: 300px;
  background-color: #f9f9f9;
  font-size: 36px;
  color: #000;
  letter-spacing: -0.72px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ContentsDivStyle = css`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 12px;
  margin-top: 40px;

  h2 {
    font-size: 20px;
    font-weight: 700;
  }

  p {
    line-height: 160%;
    letter-spacing: -0.32px;
  }
`;

const ButtonDivStyle = css`
  display: flex;
  margin: 64px auto 96px;
  gap: 16px;

  button {
    width: 120px;
    height: 48px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.28px;
    border-radius: 4px;
    cursor: pointer;
  }

  .main-btn {
    border: 1px solid #1261c4;
    background-color: rgba(18, 97, 196, 0);
    color: #1261c4;
  }

  .login-btn {
    border: none;
    background-color: #1261c4;
    color: #fff;
  }
`;

export default SignUpDone;
