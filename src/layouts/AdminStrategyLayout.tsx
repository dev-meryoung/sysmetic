import { useState } from 'react';
import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import TabButton from '@/components/TabButton';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const AdminStrategyLayout = () => {
  const [tab, setTab] = useState(0);

  return (
    <>
      <div css={adminStrategyWrapperStyle}>
        <div css={adminStrategyHeaderStyle}>
          <h1>전략관리</h1>
          <p>
            트레이더 회원들의 전략 상태를 관리하는 페이지입니다.
            <br />
            승인 요청된 전략을 승인/반려할 수 있습니다.
          </p>
        </div>
        <div css={adminStrategyCategoryDivStyle}>
          <TabButton
            tabs={['전략목록', '매매방식 관리', '종목 관리']}
            handleTabChange={setTab}
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
