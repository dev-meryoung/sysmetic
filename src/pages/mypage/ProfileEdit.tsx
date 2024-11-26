import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DefaultProfileImg from '@/assets/images/default-profile.png';
import Button from '@/components/Button';
import ProfileImage from '@/components/ProfileImage';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

type InputStateTypes = 'normal' | 'warn';

const ProfileEdit: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [nicknameStatus, setNicknameStatus] =
    useState<InputStateTypes>('normal');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneStatus, setPhoneStatus] = useState<InputStateTypes>('normal');
  const [profileImage, setProfileImage] = useState<string>(DefaultProfileImg);
  const [_isNicknameChecked, setIsNicknameChecked] = useState(false);
  const navigate = useNavigate();

  const handleNicknameCheck = async () => {
    const nicknameRegex = /^[가-힣0-9]{3,10}$/;

    if (!nicknameRegex.test(nickname.trim())) {
      setNicknameStatus('warn');
      return;
    }

    try {
      await axios.get('https://3.39.211.122.nip.io/auth/check-nickname', {
        params: { nickname: nickname.trim() },
        headers: { accept: 'application/json' },
      });

      setIsNicknameChecked(true);
      setNicknameStatus('normal');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const statusCode = err.response?.status;
        const errorMessage =
          err.response?.data?.message || '알 수 없는 오류가 발생했습니다.';

        if (statusCode === 400 || statusCode === 409) {
          setNicknameStatus('warn');
          console.error(errorMessage);
        } else {
          console.error('닉네임 중복 검사 실패:', err.message);
        }
      } else {
        console.error('알 수 없는 에러 발생:', err);
      }
    }
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setIsNicknameChecked(false);

    if (value.trim() === '' || value.length < 3 || value.length > 10) {
      setNicknameStatus('warn');
    } else {
      setNicknameStatus('normal');
    }
  };

  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    setPhoneNumber(numbersOnly);

    if (/^010\d{8}$/.test(numbersOnly)) {
      setPhoneStatus('normal');
    } else {
      setPhoneStatus('warn');
    }
  };

  const handleComplete = () => {
    let isValid = true;

    const nicknameRegex = /^[가-힣0-9]{3,10}$/;

    if (!nicknameRegex.test(nickname.trim())) {
      setNicknameStatus('warn');
      isValid = false;
    }

    if (!/^010\d{8}$/.test(phoneNumber)) {
      setPhoneStatus('warn');
      isValid = false;
    }

    if (!_isNicknameChecked) {
      setNicknameStatus('warn');
      console.error('닉네임 중복 확인을 완료해주세요.');
      isValid = false;
    }

    if (isValid) {
      navigate(PATH.MYPAGE_PROFILE());
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
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
          <label css={labelStyle}>
            <ProfileImage src={profileImage} alt='profileImage' size='xxl' />
            <div css={iconWrapperStyle}>
              <CameraAltOutlinedIcon css={iconStyle} />
            </div>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              css={fileInputStyle}
            />
          </label>
        </div>

        <div css={inputSectionStyle}>
          <div>
            <span>닉네임</span>
            <div className='input-row'>
              {
                <TextInput
                  value={nickname}
                  handleChange={(e) => handleNicknameChange(e.target.value)}
                  status={nicknameStatus}
                />
              }
              <Button
                label='중복확인'
                handleClick={handleNicknameCheck}
                color='primary'
                size='md'
                width={80}
                shape='square'
              />
            </div>
            {nicknameStatus === 'warn' && (
              <span className='message'>유효한 닉네임을 입력해주세요.</span>
            )}
          </div>

          <div>
            <span>휴대번호</span>
            <div className='input-row'>
              <TextInput
                value={phoneNumber}
                handleChange={(e) => handlePhoneChange(e.target.value)}
                status={phoneStatus}
              />
            </div>
            {phoneStatus === 'warn' && (
              <span className='message'>
                '-'를 제외한 휴대번호를 입력해주세요.
              </span>
            )}
          </div>
        </div>
      </div>

      <div css={buttonStyle}>
        <Button
          label='이전'
          handleClick={() => navigate(PATH.MYPAGE_PROFILE())}
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

const profileImgStyle = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  object-fit: cover;
`;

const labelStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
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
  cursor: pointer;
`;

const iconStyle = css`
  font-size: 24px;
  color: ${COLOR.BLACK};
`;

const fileInputStyle = css`
  display: none;
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

const buttonStyle = css`
  margin-top: 80px;
  display: flex;
  align-items: center;
  gap: 16px;
`;
