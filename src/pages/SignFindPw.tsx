import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
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
    setVerificationCode('');
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

  const handleMainBtn = () => {
    navigate(PATH.ROOT);
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
                <CancelOutlined
                  style={{ color: COLOR.POINT, fontSize: '2.4rem' }}
                />
              </button>
            </div>
            <div css={buttonStyle}>
              <Button
                label='요청하기'
                handleClick={handleSendEmailBtn}
                color='primary'
                size='xxl'
                shape='block'
                fontSize='14px'
              ></Button>
            </div>
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
            <div css={buttonStyle}>
              <Button
                label='인증확인'
                handleClick={handleVerificationCodeBtn}
                color='primary'
                size='xxl'
                shape='block'
                disabled={!showCheckBtn}
                fontSize='14px'
              ></Button>
            </div>
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
              <Button
                label='메인가기'
                handleClick={handleMainBtn}
                color='primaryOpacity10'
                size='xs'
                shape='line'
                fontSize='14px'
              ></Button>
              <Button
                label='설정 완료'
                handleClick={handleComplete}
                color='primary'
                size='xs'
                shape='block'
                fontSize='14px'
              ></Button>
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
  border-bottom: 1px solid ${COLOR.BLACK};

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
      border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
      outline: none;

      &::placeholder {
        font-size: 16px;
        color: ${COLOR_OPACITY.BLACK_OPACITY30};
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
    background-color: ${COLOR.PRIMARY};
    color: white;
    cursor: pointer;
  }

  .message {
    color: ${COLOR.POINT};
    font-size: 14px;
    font-weight: 400;
    margin-top: 4px;
    display: block;
  }
`;

const linkStyle = css`
  width: 100%;
  text-align: center;
  margin-top: 80px;
  margin-bottom: 96px;
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const buttonStyle = css`
  margin-left: 16px;
`;
