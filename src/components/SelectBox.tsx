import { Fragment, useState, useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';

type SelectColorTypes = 'skyblue';
interface SelectOptionProps {
  label: string;
  value: string;
}
interface SelectBoxProps {
  width?: number;
  placeholder?: string;
  color?: SelectColorTypes;
  value?: string;
  options: SelectOptionProps[];
  handleChange: (value: string) => void;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  width = 175,
  options,
  color,
  placeholder = '선택하세요.',
  value,
  handleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState('');
  const clickRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOther = (e: MouseEvent) => {
      if (clickRef.current && !clickRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOther);
    return () => {
      document.removeEventListener('click', handleClickOther);
    };
  }, []);

  const handleOpenOptions = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (option: SelectOptionProps) => {
    setIsSelected(option.label);
    setIsOpen(false);
    handleChange?.(option.value);
  };

  useEffect(() => {
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      setIsSelected(selectedOption.label);
    }
  }, [value, options]);

  return (
    <div
      css={selectWrppaerStyle(width)}
      onClick={handleOpenOptions}
      ref={clickRef}
    >
      <div css={selectDefaultStyle(isOpen, color)}>
        {isSelected ? <p>{isSelected}</p> : <p>{placeholder}</p>}
        <KeyboardArrowDownIcon css={iconStyle(isOpen)} />
      </div>
      {isOpen && (
        <ul css={optionStyle}>
          {options.map((option) => (
            <Fragment key={option.value}>
              <li onClick={() => handleSelectOption(option)}>{option.label}</li>
            </Fragment>
          ))}
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
  background-color: ${COLOR.WHITE};
  border-radius: 4px;
  font-size: ${FONT_SIZE.TEXT_SM};
  letter-spacing: -0.28px;
  cursor: pointer;
`;

const selectDefaultStyle = (isOpen: boolean, color?: SelectColorTypes) => css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 48px;
  padding: 0 16px;
  border: 1px solid
    ${isOpen
      ? COLOR.BLACK
      : color === 'skyblue'
        ? COLOR.PRIMARY100
        : COLOR_OPACITY.BLACK_OPACITY30};
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
