import { css } from '@emotion/react';

const SignUpForm = () => (
  <div css={WrapperStyle}>
    <div css={SubTitleStyle}>정보입력</div>
    <div css={FormDivStyle}>
      <div className='email-form'>
        <h2>이메일</h2>
        <div>
          <input type='text' />
          <span style={{ margin: '0 6px' }}>@</span>
          <select name='email' id='email'>
            <option value='naver'>naver.com</option>
            <option value='daum'>daum.com</option>
            <option value='google'>google.com</option>
          </select>
          <button className='check-btn'>중복확인</button>
          <button className='auth-btn'>이메일 인증</button>
        </div>
        <p style={{ color: '#c84a31' }}>support message</p>
      </div>
      <div className='input-form'>
        <h2>비밀번호</h2>
        <input type='password' />
        <p style={{ color: '#c84a31' }}>support message</p>
      </div>
      <div className='input-form'>
        <h2>비밀번호 확인</h2>
        <div className='check-form'>
          <input type='password' />
          <button>중복확인</button>
        </div>
        <p style={{ color: '#c84a31' }}>support message</p>
      </div>
      <div className='input-form'>
        <h2>닉네임</h2>
        <input type='text' />
        <p style={{ color: '#c84a31' }}>support message</p>
      </div>
      <div className='input-form'>
        <h2>이름</h2>
        <input type='text' />
        <p style={{ color: '#c84a31' }}>support message</p>
      </div>
      <div className='input-form'>
        <h2>휴대번호</h2>
        <input type='tel' />
        <p style={{ color: '#c84a31' }}>support message</p>
      </div>
      <div className='img-form'>
        <h2>프로필 이미지 설정</h2>
        <img
          src='https://img.animalplanet.co.kr/news/2020/08/06/700/yaj83kp9p731j819tcda.jpg'
          alt='profile-img'
        />
      </div>
    </div>
    <div css={SubTitleStyle}>
      정보수신 동의
      <p>모든 정보수신에 동의를 하셔야 회원가입이 이루어집니다.</p>
    </div>
    <div css={AgreementDivStyle}>
      <div>
        <label>
          <input type='radio' name='agree1' />
          관심 전략과 정보 수신에 동의합니다.
        </label>
        <label>
          <input type='radio' name='agree1' />
          관심 전략과 정보 수신에 동의하지 않습니다.
        </label>
      </div>
      <div>
        <label>
          <input type='radio' name='agree2' />
          마케팅 정보 알림 수신에 동의합니다.
        </label>
        <label>
          <input type='radio' name='agree2' />
          마케팅 정보 알림 수신에 동의하지 않습니다.
        </label>
      </div>
    </div>
    <div css={ButtonDivStyle}>
      <button className='back-btn'>이전</button>
      <button className='next-btn'>다음</button>
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
  font-size: 14px;
  font-weight: 400;
  display: flex;
  flex-direction: column;
`;

const SubTitleStyle = css`
  margin-top: 80px;
  padding-bottom: 40px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
  border-bottom: 1px solid #000;

  p {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.32px;
    margin-top: 16px;
  }
`;

const FormDivStyle = css`
  margin-top: 40px;
  letter-spacing: -0.28px;

  .email-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 40px;

    input {
      width: 160px;
      height: 48px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 0 16px;
      font-size: 14px;
    }

    select {
      width: 160px;
      height: 48px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 0 16px;
      font-size: 14px;
    }

    button {
      height: 48px;
      padding: 0 16px;
      margin-left: 16px;
      letter-spacing: -0.28px;
      border: none;
      border-radius: 4px;
      color: #fff;
      font-family: Pretendard;
      font-size: 12px;
      font-weight: 400;
      border-radius: 4px;
      cursor: pointer;
    }

    .check-btn {
      width: 80px;
      background-color: #1261c4;
    }

    .auth-btn {
      width: 96px;
      background-color: #000;
    }
  }

  .input-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 40px;

    input {
      width: 360px;
      height: 48px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }

    button {
      width: 80px;
      height: 48px;
      padding: 0 16px;
      margin-left: 16px;
      letter-spacing: -0.28px;
      border: none;
      border-radius: 4px;
      background-color: #1261c4;
      color: #fff;
      font-family: Pretendard;
      font-size: 12px;
      font-weight: 400;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .img-form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    img {
      width: 120px;
      height: 120px;
      border-radius: 300px;
      overflow: hidden;
      background: lightgray 50% / cover no-repeat;
    }
  }
`;

const AgreementDivStyle = css`
  font-size: 20px;
  font-weight: 700;
  margin-top: 40px;

  p {
    font-size: 16px;
    font-weight: 400;
  }

  label {
    display: flex;
    align-items: center;
    letter-spacing: -0.32px;
  }

  div {
    display: flex;
    gap: 24px;
  }

  input[type='radio'] {
    width: 24px;
    height: 24px;
    margin: 12px;
    accent-color: #1261c4;
  }
`;

const ButtonDivStyle = css`
  display: flex;
  margin: 80px auto 96px;
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

  .back-btn {
    border: 1px solid #1261c4;
    background-color: rgba(18, 97, 196, 0);
    color: #1261c4;
  }

  .next-btn {
    border: none;
    background-color: #1261c4;
    color: #fff;
  }
`;

export default SignUpForm;
