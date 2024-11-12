import { useState } from 'react';
import { css } from '@emotion/react';
import { SvgIconComponent } from '@mui/icons-material';
import SvgIcon from '@mui/icons-material/CancelOutlined';
import COLOR from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const INPUT_COLOR = {
  FADED_GRAY_100: '#0000001A',
  FADED_GRAY_300: '#0000004D',
  LIGHT_SKY_BLUE: '#AECAED',
};

type InputTypes = 'text' | 'password' | 'email' | 'tel';
type InputColorTypes = 'lightgray' | 'skyblue';

interface InputProps {
  type?: InputTypes;
  placeholder?: string;
  color?: InputColorTypes;
  firstIcon?: SvgIconComponent;
  secondIcon?: SvgIconComponent;
  onFIconClick?: () => void;
  onSIconClick?: () => void;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  color = 'lightgray',
  firstIcon,
  secondIcon,
  onFIconClick,
  onSIconClick,
}) => {
  const [input, setInput] = useState('');

  return (
    <div css={inputWrapperStyle(color)}>
      <input
        css={inputStyle}
        type={type}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
      />
      {firstIcon && <SvgIcon css={iconStyle} onClick={onFIconClick} />}
      {secondIcon && <SvgIcon css={iconStyle} onClick={onSIconClick} />}
    </div>
  );
};

const inputWrapperStyle = (color: string | undefined) => css`
  display: flex;
  width: 100%;
  border: 1px solid
    ${color === 'skyblue'
      ? INPUT_COLOR.LIGHT_SKY_BLUE
      : INPUT_COLOR.FADED_GRAY_100};
  border-radius: 4px;
`;

const inputStyle = css`
  width: 100%;
  height: 48px;
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 16px 0 16px 16px;

  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
  letter-spacing: -0.32px;

  &::placeholder {
    color: ${INPUT_COLOR.FADED_GRAY_300};
  }
`;

const iconStyle = css`
  width: 48px;
  height: 48px;
  padding: 12px;
  color: ${COLOR.BLACK};
  cursor: pointer;
`;

export default Input;
