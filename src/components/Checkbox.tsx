import { css } from '@emotion/react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import COLOR from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label = '',
  checked = false,
  onChange,
}) => {
  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div css={checkboxWrapperStyle}>
      <div css={checkboxStyle} onClick={handleClick}>
        {checked ? (
          <CheckBoxIcon
            sx={{
              color: COLOR.WHITE,
              fill: COLOR.PRIMARY_NORMAL,
            }}
          />
        ) : (
          <CheckBoxOutlineBlankIcon
            sx={{
              color: COLOR.GRAY_800,
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

const checkboxStyle = css`
  margin: 4px;
  border-radius: 50%;

  svg {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${FONT_SIZE.TITLE_SM};
    cursor: pointer;
    margin: 8px;
  }

  :hover {
    background-color: ${COLOR.GRAY_300};
    transition: 0.3s;
  }
`;

export default Checkbox;
