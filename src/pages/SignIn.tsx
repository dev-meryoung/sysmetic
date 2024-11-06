import { useState } from 'react';
import { css } from '@emotion/react';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { Button } from '@mui/material';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClearEmail = () => {
    setEmail('');
  }
  const handleClearPassword = () => {
    setPassword('');
  }

  return (
    <div css={wrapperStyle}>
      <div css={signInTextStyle}>로그인</div>

      <div css={containerInputStyle}>
        <div css={inputWrapperStyle}>
          <input
            type="text"
            placeholder="이메일 주소 (abc@abc.com)"
            css={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="text"
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
            placeholder="비밀번호"
            css={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="text"
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
            variant="text"
            onClick={handleClearPassword}
            css={deleteIconBtnStyle}
            disableRipple
          >
            <CancelOutlined style={{ color: '#C84A31', fontSize: 24 }} />
          </Button>
        </div>
      </div>

      <div css={staySignInContainer}>
        <input type="checkbox" css={staySignInStyle} /> 로그인 유지
      </div>

      <div>
        <button css={accessBtnStyle}>로그인</button>
      </div>

      <div css={linksStyle}>
        <a href="#" css={accountStyle}>회원가입</a>
        <a href="#">계정(이메일) 찾기</a> | <a href="#">비밀번호 재설정</a>
      </div>
    </div>
  );
};

export default SignIn;

const wrapperStyle = css`
  margin: 0 auto;
  margin-top: 120px;
  margin-bottom: 174px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 10px;
  height: auto;
`;

const signInTextStyle = css`
  font-size: 32px;
  font-weight: 700;
  align-self: center;
`;

const staySignInContainer = css`
  display: flex;
  align-items: center;
  width: 360px;
  margin-top: 16px;
  margin-bottom: 26px;
  font-size: 14px;
`;

const containerInputStyle = css`
  display: flex;
  flex-direction: column;
  margin-top: 39px;
  gap: 16px;
  align-items: center;
`;

const inputWrapperStyle = css`
  position: relative;
  width: 360px;
  display: flex;
  align-items: center;
`;

const inputStyle = css`
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border: 1px solid gray;
  padding: 8px 12px;
  outline: none;

  :focus {
    border: 2px solid #1261C4;
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
  background-color: #1261C4;
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
