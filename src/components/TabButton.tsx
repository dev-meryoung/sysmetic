import { Dispatch, SetStateAction } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/Button';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

type ButtonShapeType = 'round' | 'block' | 'line';

interface TabButtonProps {
  tabs: string[];
  currentTab: number;
  handleTabChange: Dispatch<SetStateAction<number>>;
  shape?: ButtonShapeType;
}

const TabButton: React.FC<TabButtonProps> = ({
  tabs,
  currentTab,
  handleTabChange,
  shape = 'round',
}) => {
  const handleTabClick = (idx: number) => {
    handleTabChange(idx);
  };

  return (
    <div css={tabWrapperStyle(shape)}>
      {shape === 'round'
        ? tabs.map((tab, idx) => (
            <Button
              key={idx}
              label={tab}
              width={144}
              color={currentTab === idx ? 'primary' : 'white'}
              shape='round'
              handleClick={() => handleTabClick(idx)}
            />
          ))
        : tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`tab-button ${shape} ${currentTab === idx ? 'active' : ''}`}
              css={tabBtnStyle}
              onClick={() => handleTabClick(idx)}
            >
              {tab}
            </button>
          ))}
      {shape === 'line' && (
        <div
          className='active-line'
          css={activeLineStyle}
          style={{ left: `${currentTab * 90}px` }}
        />
      )}
    </div>
  );
};

const tabWrapperStyle = (shape: ButtonShapeType) => css`
  position: relative;
  display: flex;
  gap: ${shape === 'round' ? '16px' : '0'};
  width: 100%;
`;

const tabBtnStyle = css`
  color: ${COLOR.GRAY700};
  width: 90px;
  height: 48px;
  font-size: ${FONT_SIZE.TEXT_SM};
  font-weight: ${FONT_WEIGHT.MEDIUM};
  border: 0;

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
      color: ${COLOR.PRIMARY600};
      border-top: 1px solid ${COLOR.GRAY200};
      border-left: 1px solid ${COLOR.GRAY200};
      border-right: 1px solid ${COLOR.GRAY200};
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
        right: 0;
        width: calc(100% - 90px);
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
