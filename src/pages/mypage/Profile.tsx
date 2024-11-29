import { useEffect } from 'react';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import ProfileImage from '@/components/ProfileImage';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { initializeAuth, isLoggedIn, email, nickname, profileImage } =
    useAuthStore();

  // function maskPhoneNumber(phone: string): string {
  //   return phone.replace(/(\d{2})$/, '**');
  // }

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(PATH.SIGN_IN, { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <div css={wrapperStyle}>
      <div css={profileWrapperStyle}>
        <div css={sectionStyle}>
          <div css={[titleStyle, firstTitleStyle]}>
            <span>계정 정보</span>
            <Button
              label='변경하기'
              handleClick={() => navigate(PATH.MYPAGE_PROFILE_EDIT())}
              color='primary'
              size='md'
              width={80}
              shape='square'
            />
          </div>
          <div css={profileInfoStyle}>
            <div className='profile-img'>
              <ProfileImage
                src={profileImage || '/default-profile.png'}
                alt='profileImage'
                size='xxl'
              />
            </div>
            <div className='user-name-email'>
              <div css={userName}>
                <span>{nickname}</span>
              </div>
              <div css={userEmailStyle}>
                <span>계정(이메일)</span>
                <span>{email}</span>
              </div>
            </div>
            <div className='user-nickname-hp'>
              <div css={userNicknameStyle}>
                <span>닉네임</span>
                <span>{nickname}</span>
              </div>
              <div css={useHpStyle}>
                {/* 나중에 연동 */}
                <span>전화번호</span>
                <span>010-0000-0000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div css={profileWrapperStyle}>
        <div css={sectionStyle}>
          <div css={titleStyle}>
            <span>비밀번호</span>
            <Button
              label='변경하기'
              handleClick={() => navigate(PATH.MYPAGE_PASSWORD())}
              color='primary'
              size='md'
              width={80}
              shape='square'
            />
          </div>
        </div>
      </div>
      <div css={profileWrapperStyle}>
        <div css={sectionStyle}>
          <div css={titleStyle}>
            <span>정보수신동의</span>
            <Button
              label='변경하기'
              handleClick={() => navigate(PATH.MYPAGE_OPT())}
              color='primary'
              size='md'
              width={80}
              shape='square'
            />
          </div>
        </div>
      </div>
      <div css={withdrawBtnStyle}>
        <Button
          label='회원탈퇴'
          handleClick={() => navigate(PATH.MYPAGE_WITHDRAW)}
          color='gray200'
          size='sm'
          width={96}
          shape='square'
        />
      </div>
    </div>
  );
};

export default Profile;

const wrapperStyle = css`
  padding-bottom: 181px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  box-sizing: border-box;
`;

const profileWrapperStyle = css`
  width: 100%;
  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 8px;
  margin-bottom: 40px;
`;

const sectionStyle = css`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const titleStyle = css`
  width: 1118px;
  padding: 32px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: ${FONT_SIZE.TITLE_XS};
    font-weight: ${FONT_WEIGHT.BOLD};
  }
`;

const firstTitleStyle = css`
  border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
`;

const profileInfoStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 32px;
  width: 1118px;

  .profile-img {
    flex: 0 0 auto;
    margin-right: 16px;
  }

  .user-name-email {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
    margin-left: 32px;
  }

  .user-nickname-hp {
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: flex-end;
    min-width: 200px;
  }
`;

const userName = css`
  font-size: ${FONT_SIZE.TITLE_LG};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const userEmailStyle = css`
  display: flex;
  align-items: center;
  background-color: ${COLOR.GRAY200};
  border-radius: 50px;
  padding: 20px 16px;
  gap: 4px;
  margin-top: 16px;
  width: fit-content;

  span {
    font-weight: ${FONT_WEIGHT.MEDIUM};
  }
`;

const userNicknameStyle = css`
  display: flex;
  justify-content: space-between;
  width: 100%;

  span:first-of-type {
    font-weight: ${FONT_WEIGHT.BOLD};
  }

  span:last-of-type {
    font-size: ${FONT_SIZE.TEXT_MD};
  }
`;

const useHpStyle = css`
  display: flex;
  justify-content: space-between;
  width: 100%;

  span:first-of-type {
    font-weight: ${FONT_WEIGHT.BOLD};
  }

  span:last-of-type {
    font-size: ${FONT_SIZE.TEXT_MD};
  }
`;

const withdrawBtnStyle = css`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;
