import { useState } from 'react';
import { css } from '@emotion/react';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useNavigate } from 'react-router-dom';
import ProfileImageTest from '@/assets/images/test-profile.png';
import Button from '@/components/Button';
import ProfileImage from '@/components/ProfileImage';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

type InputStateTypes = 'normal' | 'warn';

const ProfileEdit: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nicknameStatus, setNicknameStatus] =
    useState<InputStateTypes>('normal');
  const [phoneStatus, setPhoneStatus] = useState<InputStateTypes>('normal');
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    setStatus: React.Dispatch<React.SetStateAction<InputStateTypes>>
  ) => {
    setValue(value);
    setStatus(value.length < 6 ? 'warn' : 'normal');
  };

  const handleCheckNicknameBtn = () => {
    if (nickname.trim() === '') {
      setShowMessage(true);
    } else {
      setShowMessage(false);
    }
  };

  const handleBtn = () => {
    navigate(PATH.MYPAGE_PROFILE());
  };

  return (
    <div css={wrapperStyle}>
      <div css={indexStyle}>
        <div css={titleStyle}>계정정보 변경</div>
        <div css={descriptionStyle}>계정정보 변경 페이지입니다!</div>
      </div>

      <div css={editWrapperStyle}>
        <span css={textStyle}>프로필 이미지 설정</span>
        <div css={profileImgStyle}>
          <ProfileImage src={ProfileImageTest} alt='profileImage' size='xxl' />
          <div css={iconWrapperStyle}>
            <CameraAltOutlinedIcon css={iconStyle} />
          </div>
        </div>

        <div className='input-section' css={inputSectionStyle}>
          <div>
            <span>닉네임</span>
            <div className='input-row'>
              <TextInput
                value={nickname}
                status={nicknameStatus}
                handleChange={(e) =>
                  handleChange(e.target.value, setNickname, setNicknameStatus)
                }
              />
              <Button
                label='중복확인'
                handleClick={handleCheckNicknameBtn}
                color='primary'
                size='md'
                width={80}
                shape='square'
              />
            </div>
            {showMessage && (
              <span className='message'>중복된 닉네임입니다.</span>
            )}
          </div>

          <div>
            <span>휴대번호</span>
            <div className='input-row'>
              <TextInput
                value={phoneNumber}
                status={phoneStatus}
                handleChange={(e) =>
                  handleChange(e.target.value, setPhoneNumber, setPhoneStatus)
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div css={buttonStyle}>
        <Button
          label='이전'
          handleClick={handleBtn}
          color='primaryOpacity10'
          size='md'
          shape='square'
          width={120}
          border
        />
        <Button
          label='수정완료'
          handleClick={handleBtn}
          color='primary'
          size='md'
          shape='square'
          width={120}
        />
      </div>
    </div>
  );
};

export default ProfileEdit;

const wrapperStyle = css`
  padding-top: 96px;
  padding-bottom: 186px;
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
  margin-bottom: 41px;
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

const textStyle = css`
  display: block;
  margin-bottom: 16px;
`;

const editWrapperStyle = css`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 40px;
`;

const inputSectionStyle = css`
  span {
    display: block;
    margin-bottom: 8px;
    font-size: ${FONT_SIZE.TEXT_MD};
    margin-top: 32px;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .message {
    color: ${COLOR.POINT};
    margin-top: 8px;
    font-size: ${FONT_SIZE.TEXT_SM};
  }
`;

const profileImgStyle = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const iconWrapperStyle = css`
  position: absolute;
  bottom: 0;
  left: 80px;
  background-color: ${COLOR.GRAY400};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
`;

const iconStyle = css`
  font-size: 24px;
  color: ${COLOR.BLACK};
`;

const buttonStyle = css`
  margin-top: 80px;
  display: flex;
  align-items: center;
  gap: 16px;
`;
