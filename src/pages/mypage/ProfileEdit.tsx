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

  const validateAndNavigate = () => {
    const isCurrentPasswordEmpty = !currentPassword.trim();
    const isCheckPasswordInvalid =
      !checkPassword.trim() || newPassword !== checkPassword;

    setShowPasswordError(isCurrentPasswordEmpty);
    setShowCheckPasswordError(isCheckPasswordInvalid);

    if (!isCurrentPasswordEmpty && !isCheckPasswordInvalid) {
      navigate(PATH.MYPAGE_PROFILE());
    }
  };

  return (
    <div css={wrapperStyle}>
      <div css={indexStyle}>
        <div css={titleStyle}>비밀번호 변경</div>
        <div css={descriptionStyle}>비밀번호를 재설정하세요.</div>
      </div>
      <div css={editWrapperStyle}>
        <div css={inputSectionStyle}>
          {[
            {
              label: '현재 비밀번호',
              value: currentPassword,
              onChange: setCurrentPassword,
              showError: showPasswordError,
              errorMessage: '현재 비밀번호를 입력해주세요.',
            },
            {
              label: '새 비밀번호',
              value: newPassword,
              onChange: setNewPassword,
              showError: showPasswordError,
              errorMessage: '새 비밀번호를 입력해주세요.',
            },
            {
              label: '비밀번호 확인',
              value: checkPassword,
              onChange: setCheckPassword,
              showError: showCheckPasswordError,
              errorMessage: '비밀번호가 일치하지 않습니다.',
            },
          ].map(({ label, value, onChange, showError, errorMessage }, index) => (
            <div key={index} className="pw-form">
              <span>
                {label}
                <span css={requiredStyle}>*</span>
              </span>
              <div className="input-row">
                <TextInput
                  type="password"
                  value={value}
                  handleChange={(e) => onChange(e.target.value)}
                />
              </div>
              {showError && <span className="message">{errorMessage}</span>}
            </div>
          ))}
        </div>
      </div>
      <div css={buttonStyle}>
        <Button
          label="이전"
          handleClick={() => navigate(PATH.MYPAGE_PROFILE())}
          color="primaryOpacity10"
          size="md"
          shape="square"
          width={120}
          border
        />
        <Button
          label="수정완료"
          handleClick={validateAndNavigate}
          color="primary"
          size="md"
          shape="square"
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

  .pw-form {
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
`;
