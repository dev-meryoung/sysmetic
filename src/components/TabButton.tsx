import React, { useState } from 'react';
import { css } from '@emotion/react';
import { useSearchParams } from 'react-router-dom';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

type ButtonShapeType = 'block' | 'line';

interface TabButtonProps {
  shape?: ButtonShapeType;
  tabsData: {
    id: number;
    title: string;
    content: React.ReactNode;
  }[];
}

const TabButton: React.FC<TabButtonProps> = ({ tabsData, shape = 'block' }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');

    // tabParam 값이 없거나 유효하지 않으면 첫 번째 탭(id: 0)을 자동으로 선택하도록 처리
    const tabId =
      tabParam && !isNaN(Number(tabParam)) && Number(tabParam) >= 0
        ? parseInt(tabParam)
        : 0;

    return tabId;
  });

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId.toString() });
  };

  return (
    <>
      <div css={tabWrapperStyle}>
        {tabsData.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${shape} ${activeTab === tab.id ? 'active' : ''}`}
            css={tabBtnStyle}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </button>
        ))}
        {shape === 'line' && (
          <div
            className='active-line'
            css={activeLineStyle}
            style={{ left: `${activeTab * 90}px` }}
          />
        )}
      </div>
      <div className='tab-content'>{tabsData[activeTab].content}</div>
    </>
  );
};

const tabWrapperStyle = css`
  position: relative;
  display: flex;
`;

const tabBtnStyle = css`
  color: ${COLOR.GRAY700};
  width: 90px;
  height: 48px;
  font-size: ${FONT_SIZE.TEXT_SM};
  font-weight: ${FONT_WEIGHT.MEDIUM};
  border: 0;
  position: relative;

  :hover {
    cursor: pointer;
  }

  &.block {
    background-color: ${COLOR.GRAY200};
    border-radius: 4px 4px 0px 0px;
    border-top: 1px solid ${COLOR.GRAY200};
    border-left: 1px solid ${COLOR.GRAY200};
    border-right: 1px solid ${COLOR.GRAY200};

    :hover {
      background-color: ${COLOR.WHITE};
      color: ${COLOR.PRIMARY600};
      border-top: 1px solid ${COLOR.WHITE};
      border-left: 1px solid ${COLOR.WHITE};
      border-right: 1px solid ${COLOR.WHITE};
    }

    &.active {
      background-color: ${COLOR.WHITE};
      border-top: 1px solid ${COLOR.PRIMARY100};
      border-left: 1px solid ${COLOR.PRIMARY100};
      border-right: 1px solid ${COLOR.PRIMARY100};
      color: ${COLOR.PRIMARY};

      &::after {
        content: '';
        display: block;
        position: absolute;
        bottom: -1px;
        left: 100%;
        width: calc(100vw - 90px);
        height: 1px;
        background-color: ${COLOR.PRIMARY100};
      }
    }
  }

  &.line {
    background-color: ${COLOR.WHITE};

    :hover {
      background-color: ${COLOR.GRAY200};
      color: ${COLOR.BLACK};
      transition: 0.3s;
    }

    &.active {
      color: ${COLOR.PRIMARY};
    }
  }
`;

const activeLineStyle = css`
  position: absolute;
  bottom: -2px;
  width: 90px;
  height: 2px;
  background-color: ${COLOR.PRIMARY};
  transition: left 0.4s ease;
`;

export default TabButton;
