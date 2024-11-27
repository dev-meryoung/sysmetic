import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import Breadcrumb from '@/components/Breadcrumb';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useLogout } from '@/hooks/useAuthApi';
import { parseUserToken } from '@/utils/authUtils';

const Header = () => {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!parseUserToken());
  const [nickname, setNickname] = useState<string>('');

  useEffect(() => {
    const token = parseUserToken();
    setIsLoggedIn(!!token);

    if (token) {
      setNickname(token['nickname']);
    }
  }, []);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate(PATH.ROOT);
      },
    });
  };

  return (
    <header css={wrapperStyle}>
      <div css={headerStyle}>
        <div css={headerTopBgStyle}>
          <div css={headerTopStyle}>
            <div className='top-links'>
              {isLoggedIn ? (
                <>
                  <span>
                    <span className='nickname'>{nickname}</span>
                    님! 승승장구하는 하루 보내세요
                  </span>
                  <Link to={PATH.MYPAGE}>마이페이지</Link>
                  <a onClick={handleLogout}>로그아웃</a>
                </>
              ) : (
                <>
                  <Link to={PATH.SIGN_UP}>회원가입</Link>
                  <Link to={PATH.SIGN_IN}>로그인</Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div css={headerBottomStyle}>
          <Link to={PATH.ROOT}>
            <img className='bottom-logo' src={logo} />
          </Link>
          <div className='bottom-links'>
            <Link to={PATH.STRATEGIES_LIST}>전략탐색</Link>
            <Link to={PATH.STRATEGIES_ADD}>전략등록</Link>
            <Link to={PATH.NOTICES}>공지사항</Link>
            <Link to={PATH.FAQ}>자주묻는질문</Link>
          </div>
        </div>
      </div>
      <Breadcrumb />
    </header>
  );
};

const wrapperStyle = css`
  width: 100%;
  margin: 0 auto;
`;

const headerStyle = css`
  width: 100%;
  height: 100%;
  position: relative;
  margin: 0 auto;
  box-shadow: 0px 4px 2px 0px ${COLOR_OPACITY.BLACK_OPACITY5};
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
      cursor: pointer;
    }

    span {
      color: ${COLOR.WHITE};

      .nickname {
        font-weight: ${FONT_WEIGHT.BOLD};
      }
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
