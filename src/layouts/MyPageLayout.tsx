import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import TabButton from '@/components/TabButton';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const MyPageLayout = () => {
  const [tab, setTab] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  // 질문상세페이지에서 새로고침하면 되돌아감 (상태유지가 안됨, 일단 나중에 수정예정)
  useEffect(() => {
    if (location.pathname === PATH.MYPAGE) {
      setTab(0);
    } else if (
      location.pathname.startsWith(PATH.MYPAGE_PROFILE('temp-user-id'))
    ) {
      setTab(1);
    } else if (location.pathname.startsWith(PATH.MYPAGE_QNA('temp-user-id'))) {
      setTab(2);
    }
  }, [location.pathname]);

  const handleTabChange: React.Dispatch<React.SetStateAction<number>> = (
    index
  ) => {
    setTab(index);

    switch (index) {
      case 0:
        navigate(PATH.MYPAGE);
        break;
      case 1:
        navigate(PATH.MYPAGE_PROFILE('temp-user-id'));
        break;
      case 2:
        navigate(PATH.MYPAGE_QNA('temp-user-id'));
        break;
      default:
        break;
    }
  };
  // 여기에 해당 페이지 설명 쓰세요!
  const discriptionTab = () => {
    switch (tab) {
      case 0:
        return '내 투자 전략 목록 확인!';
      case 1:
        return '내 정보 확인!';
      case 2:
        return '상담문의 목록 확인!';
      default:
        return '';
    }
  };

  return (
    <div css={wrapperStyle}>
      <div css={indexStyle}>
        <div css={titleStyle}>마이페이지</div>
        <div css={textStyle}>{discriptionTab()}</div>
      </div>
      <div css={tabBtnStyle}>
        {/* TODO: 내관심전략 조건 처리 */}
        <TabButton
          shape='round'
          tabs={['내관심전략', '내정보수정', '상담문의']}
          currentTab={tab}
          handleTabChange={handleTabChange}
        />
      </div>
      <div css={contentStyle}>
        <Outlet />
      </div>
    </div>
  );
};

export default MyPageLayout;

const wrapperStyle = css`
  padding-top: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
`;

const indexStyle = css`
  width: 100%;
  border-bottom: 1px solid black;
  height: 127px;
  margin-bottom: 41px;
`;

const titleStyle = css`
  font-size: ${FONT_SIZE.TITLE_SM};
  font-weight: ${FONT_WEIGHT.BOLD};
`;

const textStyle = css`
  margin-top: 16px;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
`;

const tabBtnStyle = css`
  width: 100%;
  display: flex;
  margin-bottom: 40px;
`;

const contentStyle = css`
  width: 100%;
`;
