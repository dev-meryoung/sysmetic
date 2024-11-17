import { css } from '@emotion/react';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const INPUT_COLOR = {
  LIGHT_SKY_BLUE: '#AECAED',
};

type InputTypes = 'text' | 'password' | 'email' | 'tel';
type InputColorTypes = 'default' | 'skyblue';
type InputIconNumTypes = 'none' | 'single' | 'double';
export type InputStateTypes = 'normal' | 'warn' | 'success';

interface InputProps {
  type?: InputTypes;
  placeholder?: string;
  color?: InputColorTypes;
  status?: InputStateTypes;
  fullWidth?: boolean;
  width?: number;
  iconNum?: InputIconNumTypes;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<InputProps> = ({
  type,
  placeholder,
  color = 'default',
  status = 'normal',
  value,
  fullWidth = false,
  width = 360,
  iconNum = 'none',
  onChange,
}) => (
  <>
    <input
      css={inputStyle(color, status, fullWidth, width, iconNum)}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </>
);

const inputStyle = (
  color: string,
  status: InputStateTypes,
  fullWidth: boolean,
  width: number,
  iconNum: InputIconNumTypes
) => css`
  position: relative;
  width: ${fullWidth ? '100%' : width ? `${width}px` : 'auto'};
  border: 1px solid
    ${status === 'warn'
      ? COLOR.ERROR_RED
      : status === 'success'
        ? COLOR.CHECK_GREEN
        : color === 'skyblue'
          ? INPUT_COLOR.LIGHT_SKY_BLUE
          : COLOR_OPACITY.BLACK_OPACITY30};
  height: 48px;
  outline: none;
  border-radius: 4px;
  padding: 16px;
  padding-right: ${iconNum === 'single'
    ? '48px'
    : iconNum === 'double'
      ? '96px'
      : '16px'};

  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
  letter-spacing: -0.32px;

  &:focus {
    border-color: ${status === 'warn'
      ? COLOR.ERROR_RED
      : status === 'success'
        ? COLOR.CHECK_GREEN
        : COLOR.BLACK};
  }

  &::placeholder {
    color: ${COLOR_OPACITY.BLACK_OPACITY30};
  }
`;

// const iconStyle = css`
//   position: absolute;
//   width: 48px;
//   height: 48px;
//   padding: 12px;
//   color: ${COLOR.TEXT_BLACK};
//   cursor: pointer;
// `;

export default TextInput;
