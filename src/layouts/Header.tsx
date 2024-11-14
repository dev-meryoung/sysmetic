import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import { COLOR } from '@/constants/color';
import { FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const Header = () => (
  <header css={wrapperStyle}>
    <div css={headerTopBgStyle}>
      <div css={headerTopStyle}>
        <div className='top-links'>
          <Link to={PATH.SIGN_UP}>회원가입</Link>
          <Link to={PATH.SIGN_IN}>로그인</Link>
        </div>
      </div>
    </div>
    <div css={headerBottomStyle}>
      <Link to={PATH.ROOT}>
        <img className='bottom-logo' src={logo} />
      </Link>
      <div className='bottom-links'>
        <Link to={PATH.STRATEGIES_LIST}>전략탐색</Link>
        <Link to={PATH.STRATEGIES_INFO_TRADER}>전략등록</Link>
        <Link to={PATH.NOTICES}>공지사항</Link>
        <a>회사소개</a>
      </div>
    </div>
  </header>
);

const wrapperStyle = css`
  width: 100%;
  margin: 0 auto;
  box-shadow: 0px 4px 2px 0px #0000000d;
`;

const headerTopBgStyle = css`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLOR.PRIMARY};
`;

const headerTopStyle = css`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: flex-end;
  padding: 0 10px;

  .top-links {
    display: flex;
    gap: 24px;

    a {
      color: ${COLOR.WHITE};
      text-decoration: none;
    }
  }
`;

const headerBottomStyle = css`
  width: 100%;
  max-width: 1200px;
  height: 96px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin: 0 auto;

  .bottom-logo {
    width: 80px;
  }

  .bottom-links {
    display: flex;
    gap: 32px;

    a {
      color: ${COLOR.BLACK};
      font-weight: ${FONT_WEIGHT.BOLD};
      text-decoration: none;
    }
  }
`;

export default Header;
