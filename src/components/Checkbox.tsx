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
  handleChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label = '',
  size = 'md',
  checked = false,
  handleChange,
}) => {
  const handleClick = () => {
    handleChange(!checked);
  };

  return (
    <div css={checkboxWrapperStyle}>
      <div css={checkboxStyle(size)} onClick={handleClick}>
        {checked ? (
          <CheckBoxIcon
            sx={{
              color: COLOR.WHITE,
              fill: COLOR.PRIMARY,
            }}
          />
        ) : (
          <CheckBoxOutlineBlankIcon
            sx={{
              color: COLOR.GRAY800,
            }}
          />
        )}
      </div>
      {label && <span>{label}</span>}
    </div>
  );
};

const checkboxWrapperStyle = css`
  display: flex;
  align-items: center;

  span {
    font-size: ${FONT_SIZE.TEXT_SM};
    color: ${COLOR.BLACK};
  }
`;

const checkboxStyle = (size: SizeTypes) => css`
  margin: ${size === 'lg' ? '4px' : size === 'md' ? '2px' : '0px'};
  border-radius: 50%;

  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${FONT_SIZE.TITLE_SM};
    cursor: pointer;
    margin: ${size === 'lg' ? '8px' : size === 'md' ? '6px' : '2px'};
  }

  :hover {
    background-color: ${COLOR_OPACITY.PRIMARY_OPACITY10};
    transition: 0.3s;
  }
`;

export default Checkbox;
