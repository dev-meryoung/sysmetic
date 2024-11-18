import { useState } from 'react';
import { css } from '@emotion/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

interface SelectBoxProps {
  width?: number;
}

const SelectBox: React.FC<SelectBoxProps> = ({ width = 175 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenOption = () => {
    setIsOpen(!isOpen);
  };
  console.log(isOpen);

  return (
    <div css={selectWrppaerStyle(width)} onClick={handleOpenOption}>
      <div css={selectDefaultStyle(isOpen)}>
        <p>선택</p>
        <KeyboardArrowDownIcon css={iconStyle(isOpen)} />
      </div>
      {isOpen && (
        <ul css={optionStyle}>
          <li>naver.com</li>
          <li>hanmail.net</li>
          <li>nate.com</li>
        </ul>
      )}
    </div>
  );
};

const selectWrppaerStyle = (width: number) => css`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${width ? `${width}px` : 'inherit'};
  cursor: pointer;
`;

const selectDefaultStyle = (isOpen: boolean) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 48px;
  padding: 0 16px;
  border: 1px solid ${isOpen ? COLOR.BLACK : COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;
`;

const iconStyle = (isOpen: boolean) => css`
  font-size: 24px;
  color: ${COLOR.TEXT_BLACK};
  border-radius: 50%;

  transform: rotate(${isOpen ? '180deg' : '0deg'});
  transition: 0.3s;

  &:hover {
    background-color: ${COLOR_OPACITY.PRIMARY_OPACITY10};
    transition: 0.3s;
  }
`;

const optionStyle = css`
  position: absolute;
  top: 56px;
  z-index: 1;

  display: flex;
  width: inherit;
  height: auto;
  flex-direction: column;
  padding: 8px 0;
  background-color: ${COLOR.WHITE};

  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;

  li {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 16px;

    &:hover {
      background-color: ${COLOR.PRIMARY100};
      cursor: pointer;
    }
  }
`;

export default SelectBox;
