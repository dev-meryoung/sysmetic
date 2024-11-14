import { css } from '@emotion/react';
import { SvgIconComponent } from '@mui/icons-material';
import SvgIcon from '@mui/icons-material/CancelOutlined';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const INPUT_COLOR = {
  LIGHT_SKY_BLUE: '#AECAED',
};

type InputTypes = 'text' | 'password' | 'email' | 'tel';
type InputColorTypes = 'default' | 'skyblue';
export type InputStateTypes = 'normal' | 'warn' | 'success';

interface InputProps {
  type?: InputTypes;
  placeholder?: string;
  color?: InputColorTypes;
  firstIcon?: SvgIconComponent;
  secondIcon?: SvgIconComponent;
  status: InputStateTypes;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFIconClick?: () => void;
  onSIconClick?: () => void;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  color = 'default',
  firstIcon,
  secondIcon,
  status,
  value,
  onFIconClick,
  onSIconClick,
  onChange,
}) => (
  <div css={inputWrapperStyle(color, status)}>
    <input
      css={inputStyle}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {firstIcon && <SvgIcon css={iconStyle} onClick={onFIconClick} />}
    {secondIcon && <SvgIcon css={iconStyle} onClick={onSIconClick} />}
  </div>
);

const inputWrapperStyle = (
  color: string | undefined,
  status: InputStateTypes | undefined
) => css`
  display: flex;
  width: 100%;
  border: 1px solid
    ${status === 'warn'
      ? COLOR.ERROR_RED
      : status === 'success'
        ? COLOR.CHECK_GREEN
        : color === 'skyblue'
          ? INPUT_COLOR.LIGHT_SKY_BLUE
          : COLOR_OPACITY.BLACK_OPACITY30};
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
    color: ${COLOR_OPACITY.BLACK_OPACITY30};
  }
`;

const iconStyle = css`
  width: 48px;
  height: 48px;
  padding: 12px;
  color: ${COLOR.TEXT_BLACK};
  cursor: pointer;
`;

export default Input;
