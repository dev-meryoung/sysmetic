import { useState } from 'react';
import { css } from '@emotion/react';

const SignFindId = () => {
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleFindBtn = () => {
    if (email.trim() === '') {
      setShowMessage(true);
      setShowEmail(false);
    } else {
      setShowMessage(false);
      setShowEmail(true);
    }
  };

  return (
    <div css={wrapperStyle}>
      <div css={pageInfoStyle}>
        <div className='info'>
          <div>계정(이메일) 찾기</div>
          <br />
          <span>
            가입된 계정(이메일) 을 찾기 위해 휴대폰 번호 확인이 필요합니다.
            <br />
            회원가입 시 입력한 휴대폰 번호를 입력해주세요.
          </span>
        </div>
      </div>
      <div css={findFormStyle}>
        <div className='writting-layout'>
          <div>휴대번호</div>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="' - ' 를 제외하고 입력해주세요."
          />
          <button onClick={handleFindBtn}>아이디 찾기</button>
          <br />
          {showMessage && (
            <span>해당 휴대번호로 가입한 이메일이 존재하지않습니다.</span>
          )}
        </div>
      </div>
      {showEmail && (
        <>
          <div css={showEmailStyle}>
            <div className='show-email'>
              <p>
                해당 휴대폰 번호로 가입된 계정(이메일)은
                <br />
                <span>fast@fastcampus.com</span> 입니다.
              </p>
            </div>
          </div>
          <div css={linkStyle}>
            <a href='/' css={goMainStyle}>
              메인가기
            </a>
            <a href='/signin' css={signinStyle}>
              로그인
            </a>
          </div>
        </>
      )}
    </div>
  );
};
export default SignFindId;

const wrapperStyle = css`
  padding-top: 96px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  min-height: 627px;
`;

const pageInfoStyle = css`
  width: 100%;
  border-bottom: 1px solid #000;

  .info {
    div {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    span {
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      margin-bottom: 40px;
      display: inline-block;
    }
  }
`;

const findFormStyle = css`
  width: 100%;
  margin-top: 40px;

  .writting-layout {
    div {
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      margin-bottom: 8px;
    }

    input {
      width: 360px;
      height: 48px;
      padding: 8px 12px;
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      outline: none;

      &:focus {
        border: 1px solid #1261c4;
      }

      &::placeholder {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.3);
      }
    }

    button {
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      margin-left: 12px;
      width: 96px;
      height: 48px;
      border: none;
      border-radius: 4px;
      background-color: #1261c4;
      color: white;
      cursor: pointer;
    }

    span {
      position: absolute;
      margin-top: 8px;
      color: #c84a31;
      font-size: 14px;
      font-weight: 400;
    }
  }
`;

const showEmailStyle = css`
  width: 100%;
  height: 120px;
  margin-top: 80px;
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .show-email {
    p {
      font-size: 18px;
      font-weight: 400;
      line-height: 26px;
    }
    span {
      color: red;
    }
  }
`;

const linkStyle = css`
  width: 100%;
  text-align: center;
  margin-top: 80px;
  margin-bottom: 96px;
`;

const goMainStyle = css`
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  width: 120px;
  height: 48px;
  border-radius: 4px;
  text-align: center;
  line-height: 48px;
  background-color: white;
  border: 1px solid #1261c4;
  color: #1261c4;
  cursor: pointer;
  text-decoration: none;
  margin-left: 16px;
`;

const signinStyle = css`
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  width: 120px;
  height: 48px;
  border-radius: 4px;
  text-align: center;
  line-height: 48px;
  background-color: #1261c4;
  color: white;
  border: none;
  cursor: pointer;
  text-decoration: none;
  margin-left: 16px;
`;
