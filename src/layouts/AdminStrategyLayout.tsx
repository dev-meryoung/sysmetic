import { SetStateAction, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TabButton from '@/components/TabButton';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';

const AdminStrategyLayout = () => {
  const [tab, setTab] = useState(0);
  const [explanation, setExplanation] = useState('');
  const path = useLocation().pathname;
  const navigate = useNavigate();

  const handleTabChange = (value: SetStateAction<number>) => {
    setTab(value);
    if (value === 0) {
      navigate(PATH.ADMIN_STRATEGIES);
    } else if (value === 1) {
      navigate(PATH.ADMIN_METHODS);
    } else {
      navigate(PATH.ADMIN_STOCKS);
    }
  };
  //각 페이지 별 설명 업데이트
  useEffect(() => {
    switch (path) {
      case PATH.ADMIN_STRATEGIES:
        setExplanation('트레이더의 전략을 승인, 반려, 수정하는 페이지입니다.');
        break;
      case PATH.ADMIN_METHODS:
        setExplanation('매매방식을 관리하는 페이지입니다.');
        break;
      case PATH.ADMIN_STOCKS:
        setExplanation('종목을 관리하는 페이지입니다.');
        break;
      default:
        setExplanation('');
    }
  }, [path]);

  return (
    <>
      <div css={adminStrategyWrapperStyle}>
        <div css={adminStrategyHeaderStyle}>
          <h1>전략관리</h1>
          <p>{explanation}</p>
        </div>
        <div css={adminStrategyCategoryDivStyle}>
          <TabButton
            tabs={['전략목록', '매매방식 관리', '종목 관리']}
            handleTabChange={handleTabChange}
            currentTab={tab}
            shape='round'
          />
        </div>
      </div>
      <Outlet />
    </>
  );
};

const adminStrategyWrapperStyle = css`
  display: flex;
  flex-direction: column;
  margin: 96px auto 0;
  padding: 0 10px;
  max-width: 1200px;
`;

const adminStrategyHeaderStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};

  h1 {
    font-size: ${FONT_SIZE.TITLE_SM};
    font-weight: ${FONT_WEIGHT.BOLD};
    letter-spacing: -0.48px;
  }

  p {
    line-height: 160%;
    letter-spacing: -0.32px;
  }
`;

const adminStrategyCategoryDivStyle = css`
  display: flex;
  gap: 16px;
  margin: 40px 0;
`;

export default AdminStrategyLayout;
