import { useState } from 'react';
import { css } from '@emotion/react';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClearEmail = () => {
    setEmail('');
  };
  const handleClearPassword = () => {
    setPassword('');
  };

  const handleSignin = () => {
    navigate('/');
  };

  return (
    <div css={wrapperStyle}>
      <div css={signInTextStyle}>로그인</div>

      <div css={containerInputStyle}>
        <div css={inputWrapperStyle}>
          <input
            type='text'
            placeholder='이메일 주소 (abc@abc.com)'
            css={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant='text'
            onClick={handleClearEmail}
            css={deleteIconBtnStyle}
            disableRipple
          >
            <CancelOutlined style={{ color: '#C84A31', fontSize: 24 }} />
          </Button>
        </div>
        <div css={inputWrapperStyle}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='비밀번호'
            css={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant='text'
            onClick={handlePasswordVisibility}
            css={showIconBtnStyle}
            disableRipple
          >
            {showPassword ? (
              <VisibilityOffOutlined style={{ color: '#333', fontSize: 24 }} />
            ) : (
              <VisibilityOutlined style={{ color: '#333', fontSize: 24 }} />
            )}
          </Button>
          <Button
            variant='text'
            onClick={handleClearPassword}
            css={deleteIconBtnStyle}
            disableRipple
          >
            <CancelOutlined style={{ color: '#C84A31', fontSize: 24 }} />
          </Button>
        </div>
      </div>

      <div css={staySignInContainerStyle}>
        <input type='checkbox' css={staySignInStyle} /> 로그인 유지
      </div>

      <div>
        <button onClick={handleSignin} css={accessBtnStyle}>
          로그인
        </button>
      </div>

      <div css={linksStyle}>
        <a href='/signup' css={accountStyle}>
          회원가입
        </a>
        <a href='/signin/find/id'>계정(이메일) 찾기</a> |{' '}
        <a href='/signin/find/pw'>비밀번호 재설정</a>
      </div>
    </div>
  );
};

export default SignIn;

const wrapperStyle = css`
  padding-top: 124px;
  padding-bottom: 124px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  box-sizing: border-box;
  height: 627px;
`;

const signInTextStyle = css`
  font-size: 32px;
  font-weight: 700;
  align-self: center;
`;

const staySignInContainerStyle = css`
  display: flex;
  align-items: center;
  width: 360px;
  margin-top: 16px;
  margin-bottom: 24px;
  font-size: 14px;
`;

const containerInputStyle = css`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  gap: 16px;
  align-items: center;
`;

const inputWrapperStyle = css`
  position: relative;
  display: flex;
  align-items: center;
`;

const inputStyle = css`
  width: 360px;
  height: 48px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  outline: none;
  box-sizing: border-box; /* box-sizing 추가 */

  &:focus {
    border: 1px solid #1261c4;
  }

  &::placeholder {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.3);
  }
`;

const showIconBtnStyle = css`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  min-width: auto;
`;

const deleteIconBtnStyle = css`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  min-width: auto;
`;

const accessBtnStyle = css`
  border: none;
  cursor: pointer;
  background-color: #1261c4;
  color: white;
  width: 360px;
  height: 56px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
`;

const staySignInStyle = css`
  margin-right: 8px;
  cursor: pointer;
`;

const linksStyle = css`
  margin-top: 16px;
  display: flex;
  gap: 8px;
  font-size: 14px;
  font-weight: 400;

  a {
    color: #333;
    text-decoration: none;
  }
`;

const accountStyle = css`
  margin-right: 100px;
`;
