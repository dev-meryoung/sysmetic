import { css } from '@emotion/react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';

type SizeTypes = 'sm' | 'md' | 'lg';
interface CheckboxProps {
  label?: string;
  size?: SizeTypes;
  checked: boolean;
  disabled?: boolean;
  handleChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label = '',
  size = 'md',
  checked = false,
  disabled = false,
  handleChange,
}) => {
  const handleClick = () => {
    if (!disabled) {
      handleChange(!checked);
    }
  };

  return (
    <div css={checkboxWrapperStyle(size)}>
      <div css={checkboxBgStyle(size, disabled)} onClick={handleClick}>
        <div css={checkboxStyle(disabled)}>
          {checked || disabled ? (
            <CheckBoxIcon
              sx={{
                color: COLOR.WHITE,
                fill: COLOR.PRIMARY,
              }}
              className='blank'
            />
          ) : (
            <CheckBoxOutlineBlankIcon
              sx={{
                fill: COLOR.BLACK,
              }}
            />
          )}
        </div>
      </div>
      {label && <span>{label}</span>}
    </div>
  );
};

const checkboxWrapperStyle = (size: SizeTypes) => css`
  display: flex;
  align-items: center;
  gap: ${size === 'sm' ? '4px' : ''};

  span {
    font-size: ${FONT_SIZE.TEXT_SM};
    color: ${COLOR.BLACK};
  }
`;

const checkboxStyle = (disabled: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 15px;
  height: 15px;
  background-color: ${disabled === true ? '' : COLOR.WHITE};

  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${FONT_SIZE.TITLE_SM};
  }

  .blank {
    fill: ${disabled === true ? COLOR.GRAY600 : COLOR.PRIMARY};
  }
`;

const checkboxBgStyle = (size: SizeTypes, disabled: boolean) => css`
  width: ${size === 'sm' ? '28px' : size === 'md' ? '40px' : '48px'};
  height: ${size === 'sm' ? '28px' : size === 'md' ? '40px' : '48px'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  position: relative;

  ${disabled === false &&
  css`
    &:hover::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: ${COLOR_OPACITY.PRIMARY_OPACITY10};
    }
  `}
`;

export default Checkbox;
