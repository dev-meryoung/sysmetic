import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/constants/path';

const SignFindPw = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showCheckPasswordError, setShowCheckPasswordError] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
// sendEmail 나중에 추가 예정
  const [showMessage, setShowMessage] = useState(false);
  const [checkNumber, setCheckNumber] = useState(false);
  const [showCheckBtn, setShowCheckBtn] = useState(false);
  const [showResetSection, setShowResetSection] = useState(false);
  const navigate = useNavigate();

  const correctCode = '1'; // 임시 인증번호

  const handleClearEmail = () => {
    setEmail('');
    setPassword('');
    setCheckPassword('');
    setShowPasswordError(false);
    setShowCheckPasswordError(false);
  };

  const handleSendEmailBtn = () => {
    if (email.trim() === '') {
      setShowMessage(true);
      setShowCheckBtn(false);
    } else {
      setShowMessage(false);
      setShowCheckBtn(true);
      setShowPasswordError(false);
      setShowCheckPasswordError(false);
    }
  };

  const handleVerificationCodeBtn = () => {
    if (verificationCode.trim() === '') {
      setCheckNumber(false);
      setShowResetSection(false);
    } else if (verificationCode === correctCode) {
      setCheckNumber(false);
      setShowResetSection(true);
      setShowPasswordError(false);
      setShowCheckPasswordError(false);
    } else {
      setCheckNumber(true);
      setShowResetSection(false);
    }
  };

  useEffect(() => {
    if (email.trim() === '' || verificationCode.trim() === '') {
      setShowCheckBtn(false);
      setShowResetSection(false);
    } else {
      setShowCheckBtn(true);
    }
  }, [email, verificationCode]);

  const handleComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isPasswordEmpty = password.trim() === '';
    const isCheckPasswordEmpty =
      checkPassword.trim() === '' || password !== checkPassword;

    setShowPasswordError(isPasswordEmpty);
    setShowCheckPasswordError(isCheckPasswordEmpty);

    if (isPasswordEmpty || isCheckPasswordEmpty) {
      return;
    }
    navigate(PATH.SIGN_IN);
  };

  return (
    <div css={wrapperStyle}>
      <div css={pageInfoStyle}>
        <div className='info'>
          <div>비밀번호 재설정</div>
          <br />
          <span>
            시스메틱에 가입된 계정(이메일)의 비밀번호를 찾기 위해
            <br />
            계정(이메일)을 입력해주세요.
          </span>
        </div>
      </div>

      <div css={inputSectionStyle}>
        <div className='email-form'>
          <div>계정(이메일)</div>
          <div className='input-row'>
            <div className='input-wrapper'>
              <input
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='이메일 주소(abc@abc.com)'
              />
              <button className='clear-btn' onClick={handleClearEmail}>
                <CancelOutlined style={{ color: '#C84A31', fontSize: 24 }} />
              </button>
            </div>
            <button className='send-btn' onClick={handleSendEmailBtn}>
              요청하기
            </button>
          </div>
          {showMessage && (
            <span className='message'>
              해당 이메일로 가입된 계정이 존재하지 않습니다.
            </span>
          )}
        </div>
        <div className='verificationCode-form'>
          <div>이메일 인증번호</div>
          <div className='input-row'>
            <div className='input-wrapper'>
              <input
                type='text'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder='6자리'
              />
            </div>
            <button
              css={numberCheckBtnStyle(showCheckBtn)}
              onClick={handleVerificationCodeBtn}
              disabled={!showCheckBtn}
            >
              인증 확인
            </button>
          </div>
          {checkNumber && (
            <span className='message'>잘못된 인증번호입니다.</span>
          )}
        </div>
        {showResetSection && (
          <>
            <div className='reset-pw-form'>
              <div>비밀번호 재설정</div>
              <div className='input-row'>
                <div className='input-wrapper'>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='새 비밀번호'
                  />
                  {showPasswordError && (
                    <span className='message'>비밀번호를 입력해주세요.</span>
                  )}
                </div>
              </div>
            </div>

            <div className='check-pw-form'>
              <div>비밀번호 확인</div>
              <div className='input-row'>
                <div className='input-wrapper'>
                  <input
                    type='password'
                    value={checkPassword}
                    onChange={(e) => setCheckPassword(e.target.value)}
                    placeholder='비밀번호 확인'
                  />
                  {showCheckPasswordError && (
                    <span className='message'>
                      비밀번호가 일치하지 않습니다.
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div css={linkStyle}>
              <a href='/' css={goMainStyle}>
                메인가기
              </a>
              <button onClick={handleComplete} css={signinStyle}>
                설정완료
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignFindPw;

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
  height: auto;
  min-height: 627px;
`;

const pageInfoStyle = css`
  width: 100%;
  border-bottom: 1px solid #000;

  .info {
    div {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
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

const inputSectionStyle = css`
  width: 100%;
  margin-top: 40px;

  .email-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
  }

  .verificationCode-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
  }

  .reset-pw-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
  }

  .check-pw-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 80px;
  }

  div {
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
  }

  .input-row {
    display: flex;
    align-items: center;
    margin-top: 8px;
  }

  .input-wrapper {
    position: relative;
    width: 360px;
    display: flex;
    flex-direction: column;

    input {
      width: 100%;
      height: 48px;
      padding-left: 12px;
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.3);
      outline: none;
      &:focus {
        border: 1px solid #1261c4;
      }
      &::placeholder {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.3);
      }
    }

    .clear-btn {
      position: absolute;
      top: 50%;
      right: 4px;
      transform: translateY(-50%);
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
  }

  .send-btn {
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    width: 96px;
    height: 48px;
    margin-left: 16px;
    border: none;
    border-radius: 4px;
    background-color: #1261c4;
    color: white;
    cursor: pointer;
  }

  .message {
    color: #c84a31;
    font-size: 14px;
    font-weight: 400;
    margin-top: 4px;
    display: block;
  }
`;

const numberCheckBtnStyle = (isActive: boolean) => css`
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  width: 96px;
  height: 48px;
  border: none;
  margin-left: 16px;
  border-radius: 4px;
  background-color: ${isActive ? '#1261C4' : '#ccc'};
  color: white;
  cursor: ${isActive ? 'pointer' : 'not-allowed'};
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
