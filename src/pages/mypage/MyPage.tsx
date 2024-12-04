import { css } from '@emotion/react';
import {
  ContentCopyOutlined,
  FavoriteBorderOutlined,
} from '@mui/icons-material';
import ProfileImage from '@/components/ProfileImage';
import { COLOR } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';
import MyInterestList from '@/pages/mypage/MyInterestList';
import MyStrategyList from '@/pages/mypage/MyStrategyList';
import useAuthStore from '@/stores/useAuthStore';

const MyPage = () => {
  const {
    nickname,
    roleCode,
    profileImage,
    totalFollowerCount,
    totalStrategyCount,
  } = useAuthStore((state) => state);

  return (
    <div css={mypageWrapperStyle}>
      <section css={infoStyle}>
        <div className='info-area'>
          <ProfileImage src={profileImage || ''} alt='profile' />
          <div className='info'>
            {roleCode === 'TRADER' ? <span>트레이더</span> : ''}
            <h6>{nickname}</h6>
          </div>
        </div>
        <div className='button-area'>
          <div className='button'>
            <span>관심수</span>
            <div className='icon-btn'>
              <FavoriteBorderOutlined />
              {totalFollowerCount}
            </div>
          </div>
          <div className='button'>
            <span>전략수</span>
            <div className='icon-btn'>
              <ContentCopyOutlined />
              {totalStrategyCount}
            </div>
          </div>
        </div>
      </section>
      <section className='contents'>
        {roleCode === 'USER' ? (
          <MyInterestList />
        ) : roleCode === 'TRADER' ? (
          <MyStrategyList />
        ) : null}
      </section>
    </div>
  );
};

const mypageWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const infoStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 35px 24px;
  border-radius: 4px;
  border: 1px solid ${COLOR.GRAY};

  .info-area {
    display: flex;
    align-items: center;
    gap: 16px;

    .info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      span {
        color: ${COLOR.PRIMARY};
        font-size: ${FONT_SIZE.TEXT_XS};
      }
    }
  }

  .button-area {
    display: flex;
    gap: 40px;

    .button {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${COLOR.POINT};

      svg {
        color: ${COLOR.POINT};
        font-size: ${FONT_SIZE.TITLE_XS};
      }
    }
  }
`;

export default MyPage;
