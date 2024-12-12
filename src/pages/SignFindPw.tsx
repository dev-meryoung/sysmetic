import { useState } from 'react';
import { css } from '@emotion/react';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import {
  useSendEmailCodeForPassword,
  useCheckEmailCodeForPassword,
  useReset,
} from '@/hooks/useAuthApi';

type StatusTypes = 'normal' | 'warn';

const SignFindPw = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    checkPassword: '',
    verificationCode: '',
  });
  const [statuses, setStatuses] = useState<{
    email: StatusTypes;
    password: StatusTypes;
    checkPassword: StatusTypes;
    verificationCode: StatusTypes;
  }>({
    email: 'normal',
    password: 'normal',
    checkPassword: 'normal',
    verificationCode: 'normal',
  });

  const [messages, setMessages] = useState({
    emailError: '',
    verificationCodeError: '',
    passwordError: '',
    checkPasswordError: '',
  });
  const [showResetSection, setShowResetSection] = useState(false);
  const [showCheckBtn, setShowCheckBtn] = useState(false);
  const sendEmailCodeForPassword = useSendEmailCodeForPassword();
  const checkEmailCodeForPassword = useCheckEmailCodeForPassword();
  const resetMutation = useReset();
  const navigate = useNavigate();

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
  const passwordRegEx =
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/;

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      setMessages({ ...messages, [`${field}Error`]: '' });
    };

  const handleSendEmail = () => {
    if (!emailRegEx.test(formData.email)) {
      setShowCheckBtn(true);
      setStatuses({ ...statuses, email: 'warn' });
      setMessages({
        ...messages,
        emailError: '유효하지 않은 이메일 주소입니다.',
      });
      return;
    }

    setStatuses({ ...statuses, email: 'normal' });
    setMessages({ ...messages, emailError: '' });

    sendEmailCodeForPassword.mutate(formData.email, {
      onSuccess: () => {
        setShowCheckBtn(true);
      },
      onError: () => {
        setMessages({
          ...messages,
          emailError: '해당 이메일로 가입된 계정이 존재하지 않습니다.',
        });
      },
    });
  };

  const handleVerifyCode = () => {
    checkEmailCodeForPassword.mutate(
      { email: formData.email, authCode: formData.verificationCode },
      {
        onSuccess: (response) => {
          if (response?.code === 200) {
            setShowResetSection(true);
            setMessages({ ...messages, verificationCodeError: '' });
            setStatuses({ ...statuses, verificationCode: 'normal' });
          } else {
            setShowResetSection(false);
            setMessages({
              ...messages,
              verificationCodeError: '잘못된 인증번호입니다.',
            });
            setStatuses({ ...statuses, verificationCode: 'warn' });
          }
        },
        onError: () => {
          setShowResetSection(false);
          setMessages({
            ...messages,
            verificationCodeError: '잘못된 인증번호입니다.',
          });
          setStatuses({ ...statuses, verificationCode: 'warn' });
        },
      }
    );
  };

  const handleComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isPasswordValid = passwordRegEx.test(formData.password);
    const isPasswordMatch = formData.password === formData.checkPassword;

    setStatuses({
      ...statuses,
      password: isPasswordValid ? 'normal' : 'warn',
      checkPassword: isPasswordMatch ? 'normal' : 'warn',
    });

    setMessages({
      ...messages,
      passwordError: isPasswordValid
        ? ''
        : '6~20자의 영대/소문자, 숫자, 특수문자를 모두 포함해야 합니다.',
      checkPasswordError: isPasswordMatch
        ? ''
        : '비밀번호가 일치하지 않습니다.',
    });

    if (isPasswordValid && isPasswordMatch) {
      resetMutation.mutate({
        email: formData.email,
        authCode: formData.verificationCode,
        password: formData.password,
        rewritePassword: formData.checkPassword,
      });
      navigate(PATH.SIGN_IN);
    }
  };

  const handleClearEmail = () => {
    setFormData({
      email: '',
      password: '',
      checkPassword: '',
      verificationCode: '',
    });
    setStatuses({
      email: 'normal',
      password: 'normal',
      checkPassword: 'normal',
      verificationCode: 'normal',
    });
    setMessages({
      emailError: '',
      verificationCodeError: '',
      passwordError: '',
      checkPasswordError: '',
    });
    setShowResetSection(false);
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
              <TextInput
                value={formData.email}
                status={statuses.email}
                placeholder='이메일 주소(abc@abc.com)'
                handleChange={handleChange('email')}
              />

              <IconButton
                IconComponent={CancelOutlined}
                handleClick={handleClearEmail}
                color='point'
                iconBgSize='md'
                shape='none'
                css={noneIconStyle}
              />
            </div>
            <div css={buttonStyle}>
              <Button
                label='요청하기'
                handleClick={handleSendEmail}
                color='primary'
                size='md'
                width={80}
                shape='square'
              />
            </div>
          </div>
          {messages.emailError && (
            <span className='message'>{messages.emailError}</span>
          )}
        </div>

        <div className='verificationCode-form'>
          <div>이메일 인증번호</div>
          <div className='input-row'>
            <div className='input-wrapper'>
              <TextInput
                value={formData.verificationCode}
                status={statuses.verificationCode}
                placeholder='6자리'
                handleChange={handleChange('verificationCode')}
              />
            </div>
            <div css={buttonStyle}>
              <Button
                label='인증확인'
                handleClick={handleVerifyCode}
                color='primary'
                size='md'
                width={80}
                shape='square'
                disabled={!showCheckBtn}
              />
            </div>
          </div>
          {messages.verificationCodeError && (
            <span className='message'>{messages.verificationCodeError}</span>
          )}
        </div>

        {showResetSection && (
          <>
            <div className='reset-pw-form'>
              <div>비밀번호 재설정</div>
              <div className='input-row'>
                <div className='input-wrapper'>
                  <TextInput
                    type='password'
                    value={formData.password}
                    status={statuses.password}
                    placeholder='새 비밀번호'
                    handleChange={handleChange('password')}
                  />
                  {messages.passwordError && (
                    <span className='message'>{messages.passwordError}</span>
                  )}
                </div>
              </div>
            </div>

            <div className='check-pw-form'>
              <div>비밀번호 확인</div>
              <div className='input-row'>
                <div className='input-wrapper'>
                  <TextInput
                    type='password'
                    value={formData.checkPassword}
                    status={statuses.checkPassword}
                    placeholder='비밀번호 확인'
                    handleChange={handleChange('checkPassword')}
                  />
                  {messages.checkPasswordError && (
                    <span className='message'>
                      {messages.checkPasswordError}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div css={linkStyle}>
              <Button
                label='메인가기'
                handleClick={() => navigate(PATH.ROOT)}
                color='primaryOpacity10'
                size='md'
                width={120}
                shape='square'
                border
              />
              <Button
                label='설정 완료'
                handleClick={handleComplete}
                color='primary'
                size='md'
                width={120}
                shape='square'
              />
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
  min-height: 627px;
`;

const pageInfoStyle = css`
  width: 100%;
  border-bottom: 1px solid ${COLOR.BLACK};
  .info {
    div {
      font-size: ${FONT_SIZE.TITLE_SM};
      font-weight: ${FONT_WEIGHT.BOLD};
      margin-bottom: 16px;
    }
    span {
      font-size: ${FONT_SIZE.TEXT_MD};
      line-height: 24px;
      margin-bottom: 40px;
      display: inline-block;
    }
  }
`;

const inputSectionStyle = css`
  width: 100%;
  margin-top: 40px;

  .email-form,
  .verificationCode-form,
  .reset-pw-form,
  .check-pw-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
  }

  .check-pw-form {
    margin-bottom: 80px;
  }

  div {
    font-size: ${FONT_SIZE.TEXT_SM};
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
    display: flex;
    flex-direction: column;
  }

  .message {
    color: ${COLOR.POINT};
    font-size: ${FONT_SIZE.TEXT_SM};
    margin-top: 4px;
    display: block;
  }
`;

const buttonStyle = css`
  margin-left: 16px;
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

const noneIconStyle = css`
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;
`;
