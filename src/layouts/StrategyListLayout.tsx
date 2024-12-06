import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TabButton from '@/components/TabButton';
import { COLOR } from '@/constants/color';
import { PATH } from '@/constants/path';

const TAB_NAME = ['전략 목록', '트레이더 목록'];

const StrategyListLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.pathname.includes('/traders')) {
      setCurrentTab(1);
    } else {
      setCurrentTab(0);
    }
  }, [location.pathname]);

  // TabButton에 전달할 핸들러
  const handleTabChange: Dispatch<SetStateAction<number>> = (value) => {
    // value가 함수일 경우와 숫자일 경우를 모두 처리
    const newIndex = typeof value === 'function' ? value(currentTab) : value;
    setCurrentTab(newIndex);

    if (newIndex === 0) {
      navigate(PATH.STRATEGIES_LIST);
    } else {
      navigate(PATH.TRADERS);
    }
  };

  return (
    <div css={LayoutWrapperStyle}>
      <section className='common-area'>
        <div className='title'>
          <h5>전략 탐색</h5>
          <span>
            시스메틱 트레이더에서 당신이 원하는 투자 상품을 찾아 보세요!
            <br />
            전략 목록을 통해 인기 있는 상품을 선택하거나, 전략 탐색을 통해
            투자를 할 수도 있고, 실력 있는 트레이더를 선택하여 투자 기록을
            확인할 수 있습니다.
          </span>
        </div>
        <span className='line'></span>
        <TabButton
          tabs={TAB_NAME}
          currentTab={currentTab}
          handleTabChange={handleTabChange}
        />
      </section>
      <Outlet />
    </div>
  );
};

const LayoutWrapperStyle = css`
  max-width: 1200px;
  width: 100%;
  padding: 100px 10px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  .common-area {
    display: flex;
    flex-direction: column;
    gap: 40px;

    .title {
      display: flex;
      flex-direction: column;
      gap: 14px;

      span {
        line-height: 160%;
      }
    }

    .line {
      width: 100%;
      height: 1px;
      background-color: ${COLOR.TEXT_BLACK};
    }
  }
`;

export default StrategyListLayout;
