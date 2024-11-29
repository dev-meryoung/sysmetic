import { useState } from 'react';
import { css } from '@emotion/react';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import IconButton from '@/components/IconButton';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { useLogin } from '@/hooks/useAuthApi';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const loginMutation = useLogin();

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
  const passwordRegEx =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;

  const handlePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleClear =
    (setter: React.Dispatch<React.SetStateAction<string>>) => () =>
      setter('');

  const validateEmail = (value: string) => {
    setEmail(value);
    setEmailError(!emailRegEx.test(value));
  };

  const validatePassword = (value: string) => {
    setPassword(value);
    setPasswordError(!passwordRegEx.test(value));
  };

  const handleSignIn = () => {
    const isEmailValid = emailRegEx.test(email);
    const isPasswordValid = passwordRegEx.test(password);

    if (!isEmailValid) setEmailError(true);
    if (!isPasswordValid) setPasswordError(true);

    if (isEmailValid && isPasswordValid) {
      loginMutation.mutate(
        { email, password, rememberMe },
        {
          onError: () => {
            setEmailError(true);
            setPasswordError(true);
          },
        }
      );
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe((prev) => !prev);
  };

  return (
    <div css={wrapperStyle}>
      <div css={signInTextStyle}>로그인</div>

      <div css={containerInputStyle}>
        <div css={inputWrapperStyle}>
          <div css={emailStyle}>
            <TextInput
              value={email}
              status={emailError ? 'warn' : 'normal'}
              placeholder='이메일 주소(test@example.com)'
              handleChange={(e) => validateEmail(e.target.value)}
            />
            <IconButton
              IconComponent={CancelOutlined}
              handleClick={handleClear(setEmail)}
              color='point'
              iconBgSize='md'
              shape='none'
              css={deleteIconBtnStyle}
            />
          </div>
          {emailError && (
            <span css={messageStyle}>
              올바른 이메일 주소 방식으로 입력하셔야 합니다.
            </span>
          )}
        </div>

        <div css={inputWrapperStyle}>
          <div css={passwordStyle}>
            <TextInput
              type={showPassword ? 'text' : 'password'}
              value={password}
              status={passwordError ? 'warn' : 'normal'}
              placeholder='비밀번호'
              handleChange={(e) => validatePassword(e.target.value)}
            />
            <IconButton
              IconComponent={
                showPassword ? VisibilityOffOutlined : VisibilityOutlined
              }
              handleClick={handlePasswordVisibility}
              color='black'
              iconBgSize='md'
              shape='none'
              css={showIconBtnStyle}
            />
            <IconButton
              IconComponent={CancelOutlined}
              handleClick={handleClear(setPassword)}
              color='point'
              iconBgSize='md'
              shape='none'
              css={deleteIconBtnStyle}
            />
          </div>
          {passwordError && (
            <span css={messageStyle}>
              비밀번호는 8~20자의 영문, 숫자로 구성되어야 합니다.
            </span>
          )}
        </div>
      </div>

      <div css={staySignInContainerStyle}>
        <Checkbox checked={rememberMe} handleChange={handleRememberMeChange} />
        로그인 유지
      </div>

      <div>
        <Button
          label='로그인'
          handleClick={handleSignIn}
          color='primary'
          size='lg'
          shape='square'
          width={360}
        />
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
  font-size: ${FONT_SIZE.TITLE_LG};
  font-weight: ${FONT_WEIGHT.BOLD};
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

const emailStyle = css`
  position: relative;
  width: 360px;
`;

const passwordStyle = css`
  position: relative;
  width: 360px;
`;

const deleteIconBtnStyle = css`
  position: absolute;
  right: 0;
  padding-right: 16px;
  top: 50%;
  transform: translateY(-50%);
`;

const showIconBtnStyle = css`
  position: absolute;
  right: 3.5rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
`;

const staySignInContainerStyle = css`
  display: flex;
  align-items: center;
  width: 360px;
  margin-top: 16px;
  margin-bottom: 24px;
  font-size: ${FONT_SIZE.TEXT_SM};
`;

const linksStyle = css`
  margin-top: 16px;
  display: flex;
  gap: 8px;
  font-size: ${FONT_SIZE.TEXT_SM};

  a {
    color: ${COLOR.BLACK};
    text-decoration: none;
  }
`;

const accountStyle = css`
  margin-right: 100px;
`;

const messageStyle = css`
  color: ${COLOR.POINT};
  font-size: ${FONT_SIZE.TEXT_SM};
  margin-top: 4px;
  display: block;
`;
