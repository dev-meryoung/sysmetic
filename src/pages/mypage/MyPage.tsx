import { css } from '@emotion/react';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import tempImage from '@/assets/images/test-profile.png';
import ProfileImage from '@/components/ProfileImage';
import { COLOR } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';
import MyInterestList from '@/pages/mypage/MyInterestList';
// import MyStrategyList from '@/pages/mypage/MyStrategyList';

const MyPage = () => (
  <div css={mypageWrapperStyle}>
    <section css={userInfoStyle}>
      <section className='profile-box'>
        <div className='info-area'>
          <ProfileImage src={tempImage} alt='profile' />
          <span>ABC가나다라883</span>
        </div>
        <div className='button-area'>
          <span>관심수</span>
          <div className='icon-btn'>
            <FavoriteBorderOutlinedIcon />
            10,000
          </div>
        </div>
        <div className='button-area'>
          <span>전략수</span>
          <div className='icon-btn'>
            <ContentCopyOutlinedIcon />
            8,000
          </div>
        </div>
      </section>
      <div className='btn-box'></div>
    </section>
    <section className='contents'>
      {/* TODO:권한에 따른 조건부 랜더링 */}
      <MyInterestList />
      {/* <MyStrategyList /> */}
    </section>
  </div>
);

const mypageWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const userInfoStyle = css`
  display: flex;
  justify-content: space-between;
  padding: 35px 24px;
  border: 1px solid ${COLOR.GRAY};
  border-radius: 4px;

  .profile-box {
    display: flex;
    gap: 32px;

    .info-area {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .button-area {
      display: flex;
      flex-direction: column;
      gap: 16px;

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
  }

  .btn-box {
    display: flex;
    gap: 16px;
  }
`;

export default MyPage;
