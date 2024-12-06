import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import TabButton from '@/components/TabButton';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import useAuthStore from '@/stores/useAuthStore';

const MyPageLayout = () => {
  const [tab, setTab] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const { memberId } = useAuthStore();
  const userId =
    paramUserId && !isNaN(Number(paramUserId)) ? Number(paramUserId) : memberId;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.pathname === PATH.MYPAGE) {
      setTab(0);
    } else if (
      location.pathname.startsWith(PATH.MYPAGE_PROFILE(String(userId)))
    ) {
      setTab(1);
    } else if (location.pathname.startsWith(PATH.MYPAGE_QNA(String(userId)))) {
      setTab(2);
    }
  }, [location.pathname, userId]);

  const handleTabChange: React.Dispatch<React.SetStateAction<number>> = (
    index
  ) => {
    setTab(index);

    switch (index) {
      case 0:
        navigate(PATH.MYPAGE);
        break;
      case 1:
        navigate(PATH.MYPAGE_PROFILE(String(userId)));
        break;
      case 2:
        navigate(PATH.MYPAGE_QNA(String(userId)));
        break;
      default:
        break;
    }
  };

  const discriptionTab = () => {
    switch (tab) {
      case 0:
        return '시스메틱 마이페이지에서는 내 관심 전략 관리, 개인정보 수정, 상담 문의 등 다양한 서비스를 편리하게 이용하실 수 있습니다.';
      case 1:
        return '시스메틱 마이페이지에서는 내 관심 전략 관리, 개인정보 수정, 상담 문의 등 다양한 서비스를 편리하게 이용하실 수 있습니다.';
      case 2:
        return '시스메틱 마이페이지에서는 내 관심 전략 관리, 개인정보 수정, 상담 문의 등 다양한 서비스를 편리하게 이용하실 수 있습니다.';

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
