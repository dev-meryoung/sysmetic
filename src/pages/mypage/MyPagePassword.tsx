import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useUpdatePassword } from '@/hooks/useUserApi';
import useModalStore from '@/stores/useModalStore';

type InputStateTypes = 'normal' | 'warn';

const MypagePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [currentPasswordStatus, setCurrentPasswordStatus] =
    useState<InputStateTypes>('normal');
  const [newPasswordStatus, setNewPasswordStatus] =
    useState<InputStateTypes>('normal');
  const [checkPasswordStatus, setCheckPasswordStatus] =
    useState<InputStateTypes>('normal');
  const { openModal } = useModalStore();

  const navigate = useNavigate();
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/;

  const { userId: paramUserId } = useParams<{ userId: string }>();

  const userId = paramUserId ? Number(paramUserId) : 0;

  const updatePassword = useUpdatePassword();

  const isPasswordValid = (password: string) =>
    PASSWORD_REGEX.test(password.trim());

  const handleComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const isCurrentPasswordValid = isPasswordValid(currentPassword);
    const isNewPasswordValid = isPasswordValid(newPassword);
    const isCheckPasswordValid = newPassword === checkPassword;

    setCurrentPasswordStatus(isCurrentPasswordValid ? 'normal' : 'warn');
    setNewPasswordStatus(isNewPasswordValid ? 'normal' : 'warn');
    setCheckPasswordStatus(isCheckPasswordValid ? 'normal' : 'warn');

    if (
      !isCurrentPasswordValid ||
      !isNewPasswordValid ||
      !isCheckPasswordValid
    ) {
      return;
    }

    if (currentPassword === newPassword) {
      openModal('same-confirm');
      return;
    }

    updatePassword.mutate(
      {
        userId,
        currentPassword,
        newPassword,
        newPasswordConfirm: newPassword,
      },
      {
        onSuccess: () => {
          navigate(PATH.MYPAGE_PROFILE(String(userId)));
        },
        onError: () => {
          openModal('update-confirm');
        },
      }
    );
  };

  return (
    <div css={wrapperStyle}>
      <div css={indexStyle}>
        <div css={titleStyle}>비밀번호 변경</div>
        <div css={descriptionStyle}>비밀번호를 재설정하세요.</div>
      </div>

      <div css={editWrapperStyle}>
        <div css={inputSectionStyle}>
          <div className='current-pw-form'>
            <span>
              현재 비밀번호<span css={requiredStyle}>*</span>
            </span>
            <div className='input-row'>
              <TextInput
                type='password'
                value={currentPassword}
                handleChange={(e) => setCurrentPassword(e.target.value)}
                status={currentPasswordStatus}
              />
            </div>
            {currentPasswordStatus === 'warn' && (
              <span className='message'>
                현재 비밀번호를 정확히 입력해주세요.
              </span>
            )}
          </div>

          <div className='new-pw-form'>
            <span>
              새 비밀번호<span css={requiredStyle}>*</span>
            </span>
            <div className='input-row'>
              <TextInput
                type='password'
                value={newPassword}
                handleChange={(e) => setNewPassword(e.target.value)}
                status={newPasswordStatus}
              />
            </div>
            {newPasswordStatus === 'warn' && (
              <span className='message'>
                새 비밀번호는 6~20자의 영대/소문자, 숫자, 특수문자를 포함해야
                합니다.
              </span>
            )}
          </div>

          <div className='check-pw-form'>
            <span>
              비밀번호 확인<span css={requiredStyle}>*</span>
            </span>
            <div className='input-row'>
              <TextInput
                type='password'
                value={checkPassword}
                handleChange={(e) => setCheckPassword(e.target.value)}
                status={checkPasswordStatus}
              />
            </div>
            {checkPasswordStatus === 'warn' && (
              <span className='message'>비밀번호가 일치하지 않습니다.</span>
            )}
          </div>
        </div>
      </div>

      <div css={buttonStyle}>
        <Button
          label='이전'
          handleClick={() => navigate(PATH.MYPAGE_PROFILE(String(userId)))}
          color='primaryOpacity10'
          size='md'
          shape='square'
          width={120}
          border
        />
        <Button
          label='수정완료'
          handleClick={handleComplete}
          color='primary'
          size='md'
          shape='square'
          width={120}
        />
      </div>

      <Modal
        id='same-confirm'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>현재 비밀번호와 같습니다.</p>
          </div>
        }
      />
      <Modal
        id='update-confirm'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>비밀번호 변경에 실패했습니다.</p>
          </div>
        }
      />
    </div>
  );
};

export default MypagePassword;

// 스타일 정의는 기존 코드와 동일

const wrapperStyle = css`
  padding-top: 96px;
  padding-bottom: 238px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
`;

const indexStyle = css`
  width: 100%;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};
  height: 127px;
  margin-bottom: 40px;
`;

const titleStyle = css`
  font-size: ${FONT_SIZE.TITLE_SM};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const descriptionStyle = css`
  margin-top: 16px;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
`;

const editWrapperStyle = css`
  width: 100%;
  border-radius: 4px;
`;

const inputSectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 40px;

  span {
    display: inline;
    font-size: ${FONT_SIZE.TEXT_MD};
    font-weight: ${FONT_WEIGHT.REGULAR};
    margin-bottom: 8px;
  }

  .input-row {
    display: flex;
    flex-direction: column;
  }

  .message {
    color: ${COLOR.POINT};
    font-size: ${FONT_SIZE.TEXT_SM};
    margin-top: 8px;
  }

  .current-pw-form,
  .new-pw-form,
  .check-pw-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const buttonStyle = css`
  margin-top: 40px;
  display: flex;
  gap: 16px;
`;

const requiredStyle = css`
  color: ${COLOR.POINT};
  font-size: ${FONT_SIZE.TEXT_MD};
  margin-left: 4px;
  display: inline;
`;

const modalContentStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const modalTextStyle = css`
  font-size: ${FONT_SIZE.TEXT_LG};
  text-align: center;
  margin-top: 32px;
  margin-bottom: 24px;
`;
