import { useState } from 'react';
import { css } from '@emotion/react';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';
import { PATH } from '@/constants/path';

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
    navigate(PATH.ROOT);
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
          <IconButton
            IconComponent={CancelOutlined}
            handleClick={handleClearEmail}
            color="point"
            size="sm"
            shape="line"
            css={deleteIconBtnStyle} 
          />
        </div>
        <div css={inputWrapperStyle}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='비밀번호'
            css={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <IconButton
            IconComponent={
              showPassword ? VisibilityOffOutlined : VisibilityOutlined
            }
            handleClick={handlePasswordVisibility}
            color='black'
            size='sm'
            shape='line'
            css={showIconBtnStyle}
          />
          <IconButton
            IconComponent={CancelOutlined}
            handleClick={handleClearPassword}
            color='point'
            size='sm'
            shape='line'
            css={deleteIconBtnStyle}
          />
        </div>
      </div>
      <div css={staySignInContainerStyle}>
        <input type='checkbox' css={staySignInStyle} /> 로그인 유지
      </div>
      <div>
        <Button
          label='로그인'
          handleClick={handleSignin}
          color='primary'
          size='lg'
          shape='block'
          width={360}
        ></Button>
      </div>
      <div css={linksStyle}>
        <a href='/signup' css={accountStyle}>
          회원가입
        </a>
        <a href='/signin/find/id'>계정(이메일) 찾기</a>
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

const containerInputStyle = css`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  gap: 16px;
  align-items: center;
`;

const inputWrapperStyle = css`
  position: relative;
  align-items: center;
`;

const inputStyle = css`
  width: 360px;
  height: 48px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  outline: none;
  box-sizing: border-box;

  &:focus {
    border: 1px solid ${COLOR.PRIMARY};
  }

  &::placeholder {
    font-size: 16px;
    color: ${COLOR_OPACITY.BLACK_OPACITY30};
  }
`;

const showIconBtnStyle = css`
  position: absolute;
  right: 3.5rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
`;

const deleteIconBtnStyle = css`
  position: absolute;
  right: 0;
  padding-right: 16px;
  top: 50%;
  transform: translateY(-50%);
`;

const staySignInContainerStyle = css`
  display: flex;
  align-items: center;
  width: 360px;
  margin-top: 16px;
  margin-bottom: 24px;
  font-size: ${FONT_SIZE.TEXT_SM};
`;

const staySignInStyle = css`
  margin-right: 8px;
  cursor: pointer;
`;

const linksStyle = css`
  margin-top: 16px;
  display: flex;
  gap: 8px;
  font-size: ${FONT_SIZE.TEXT_SM};
  font-weight: 400;

  a {
    color: ${COLOR.BLACK};
    text-decoration: none;
  }
`;

const accountStyle = css`
  margin-right: 100px;
`;
