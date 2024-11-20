import { useState } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const MypagePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showCheckPasswordError, setShowCheckPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isCurrentPasswordEmpty = currentPassword.trim() === '';
    const isCheckPasswordInvalid =
      checkPassword.trim() === '' || newPassword !== checkPassword;

    setShowPasswordError(isCurrentPasswordEmpty);
    setShowCheckPasswordError(isCheckPasswordInvalid);

    if (isCurrentPasswordEmpty || isCheckPasswordInvalid) {
      return;
    }
    navigate(PATH.MYPAGE_PROFILE());
  };

  const handleBack = () => {
    navigate(PATH.MYPAGE_PROFILE());
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
              />
            </div>
            {showPasswordError && (
              <span className='message'>현재 비밀번호를 입력해주세요.</span>
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
              />
            </div>
            {showPasswordError && (
              <span className='message'>새 비밀번호를 입력해주세요.</span>
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
              />
            </div>
            {showCheckPasswordError && (
              <span className='message'>비밀번호가 일치하지 않습니다.</span>
            )}
          </div>
        </div>
      </div>

      <div css={buttonStyle}>
        <Button
          label='이전'
          handleClick={handleBack}
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
    </div>
  );
};

export default MypagePassword;

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
