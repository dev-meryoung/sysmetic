import { useState } from 'react';
import { css } from '@emotion/react';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import ProfileImage from '@/components/ProfileImage';
import TextInput from '@/components/TextInput';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useCheckNickname } from '@/hooks/useAuthApi';
import { useUpdateUser } from '@/hooks/useUserApi';
import useAuthStore from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

type InputStateTypes = 'normal' | 'warn';

const ProfileEdit: React.FC = () => {
  const {
    memberId: userId,
    nickname: storeNickname,
    profileImage: storeProfileImage,
  } = useAuthStore();
  const [nickname, setNickname] = useState(storeNickname || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [nicknameStatus, setNicknameStatus] =
    useState<InputStateTypes>('normal');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneStatus, setPhoneStatus] = useState<InputStateTypes>('normal');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const navigate = useNavigate();
  const { openModal } = useModalStore();

  const { mutate: checkNickname } = useCheckNickname();
  const { mutate: updateUser } = useUpdateUser();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleNicknameCheck = () => {
    if (!/^[가-힣0-9]{3,10}$/.test(nickname.trim())) {
      setNicknameStatus('warn');
      return;
    }

    checkNickname(nickname, {
      onSuccess: () => {
        setIsNicknameChecked(true);
        setNicknameStatus('normal');
      },
      onError: () => {
        setNicknameStatus('warn');
      },
    });
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setIsNicknameChecked(false);
    setNicknameStatus('normal');
  };

  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    setPhoneNumber(numbersOnly);
    setPhoneStatus(/^010\d{8}$/.test(numbersOnly) ? 'normal' : 'warn');
  };

  const handleComplete = () => {
    if (
      nicknameStatus === 'warn' ||
      phoneStatus === 'warn' ||
      !isNicknameChecked
    ) {
      openModal('update-confirm');
    }

    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('nickName', nickname);
    formData.append('phoneNumber', phoneNumber);
    formData.append('nickNameDuplCheck', String(true));
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    updateUser(formData, {
      onSuccess: () => {
        navigate(PATH.MYPAGE_PROFILE());
      },
      onError: () => {
        openModal('update-confirm');
      },
    });
  };

  return (
    <div css={wrapperStyle}>
      <div css={indexStyle}>
        <div css={titleStyle}>계정정보 변경</div>
        <div css={descriptionStyle}>계정정보 변경 페이지입니다.</div>
      </div>

      <div css={editWrapperStyle}>
        <span css={textStyle}>프로필 이미지 설정</span>
        <div css={profileImgStyle}>
          <label css={labelStyle}>
            <ProfileImage
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : storeProfileImage
              }
              alt='profileImage'
              size='xxl'
            />
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
              <TextInput
                value={nickname}
                handleChange={(e) => handleNicknameChange(e.target.value)}
                status={nicknameStatus}
              />
              <Button
                label='중복확인'
                handleClick={handleNicknameCheck}
                color='primary'
                size='md'
                width={80}
                shape='square'
                disabled={isNicknameChecked}
              />
            </div>
            {nicknameStatus === 'warn' && (
              <span className='error-message'>중복된 닉네임입니다.</span>
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
              <span className='error-message'>
                "-"를 제외한 유효한 휴대번호를 입력해주세요.
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
      <Modal
        id='update-confirm'
        content={
          <div css={modalContentStyle}>
            <p css={modalTextStyle}>계정정보 변경에 실패했습니다.</p>
          </div>
        }
      />
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
  background-color: ${COLOR.GRAY};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;

  &:hover {
    background-color: ${COLOR.GRAY700};
  }
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

  .error-message {
    color: ${COLOR.POINT};
    margin-top: 8px;
    font-size: ${FONT_SIZE.TEXT_SM};
  }

  .success-message {
    color: ${COLOR.CHECK_GREEN};
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
