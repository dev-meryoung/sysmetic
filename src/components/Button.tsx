import React from 'react';
import { css } from '@emotion/react';
import COLOR from '@/constants/color';

type ButtonShapeType = 'block' | 'line' | 'round' | 'text';
type ButtonSizeType = 'xxxs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type ButtonColorType = 'PRIMARY_NORMAL' | 'POINT_NORMAL' | 'SIGN_UP_TRADER' | 'EMAIL_AUTHENTICATION' |'CHECK_GREEN' | 'WARN_YELLOW' | 'ERROR_RED'| 'INFO_BLUE';
type ButtonActionType = 'submit' | 'button';

interface ButtonProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  shape?: ButtonShapeType;
  size?: ButtonSizeType;
  color?: ButtonColorType;
  fullWidth?: boolean;
  type?: ButtonActionType;
  disabled?: boolean;
  fontWeight?: number;
  fontSize?: string;
}

type ButtonColors = {
  color: string;
  hoverColor?: string;
  disabledColor?: string;
  opacity?: number;
};

const buttonColors: Record<ButtonColorType, ButtonColors> = {
  PRIMARY_NORMAL: { color: COLOR.PRIMARY_NORMAL, hoverColor: COLOR.PRIMARY_500, disabledColor: COLOR.GRAY_600},
  POINT_NORMAL: { color: COLOR.POINT_NORMAL, hoverColor: COLOR.POINT_500, disabledColor: COLOR.POINT_200},
  SIGN_UP_TRADER: { color: COLOR.PRIMARY_600, hoverColor: COLOR.PRIMARY_700},
  EMAIL_AUTHENTICATION: { color: COLOR.BLACK, hoverColor: COLOR.GRAY_800},
  CHECK_GREEN: { color: COLOR.CHECK_GREEN},
  WARN_YELLOW: { color: COLOR.WARN_YELLOW},
  ERROR_RED: { color: COLOR.ERROR_RED},
  INFO_BLUE: { color: COLOR.INFO_BLUE}
};

const buttonSizes: Record<ButtonSizeType, ReturnType<typeof css>> = {
  xxxs: css`
    width: 80px;
    height: 32px;
  `,
  xxs: css`
    width: 96px;
    height: 48px;
  `,
  xs: css`
    width: 120px;
    height: 48px;
  `,
  sm: css`
    width: 144px;
    height: 48px;
  `,
  md: css`
    width: 160px;
    height: 48px;
  `,
  lg: css`
    width: 360px;
    height: 56px;
  `,
  xl: css`
    width: 580px;
    height: 136px;
  `,
  /* 인풋, 표스퀘어 버튼용 (넓이유동적)  */
  xxl: css`
  padding: 16px 17px;
  height: 48px;
`
};

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  shape = 'block',
  size = 'md',
  color = 'PRIMARY_NORMAL',
  type = 'button',
  fullWidth = false,
  disabled = false,
  fontWeight = 400,
  fontSize = '16px',
}) => {
  const selectColors = buttonColors[color];
  const selectSizes = buttonSizes[size];

  return (
    <button
      css={buttonStyle(shape, selectSizes, selectColors, fullWidth, disabled, fontWeight, fontSize)}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

const buttonStyle = (
  shape: ButtonShapeType,
  selectSizes: ReturnType<typeof css>,
  selectColors: ButtonColors,
  fullWidth: boolean,
  disabled: boolean,
  fontWeight: number,
  fontSize: string,
) => {
  const backgroundColor = disabled
    ? selectColors.disabledColor
    : shape === 'text' || shape === 'line'
      ? 'transparent'
      : selectColors.color;

  const textColor =
    disabled || selectColors.color === COLOR.GRAY_500
      ? COLOR.WHITE
      : shape === 'text' || shape === 'line'
        ? selectColors.color
        : COLOR.WHITE;

  const borderColor = shape === 'line' ? `1px solid ${selectColors.color}` : 'none';
  const hoverStyles =
    !disabled &&
    css`
      background-color: ${shape === 'text' || shape === 'line'
        ? 'transparent'
        : selectColors.hoverColor};
      color: ${shape === 'text' || shape === 'line'
      ? selectColors.hoverColor
      : COLOR.WHITE};
      ${shape === 'line' && `border-color: ${selectColors.hoverColor}`};
    `;

  return css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    border: ${borderColor};
    outline: none;
    width: ${fullWidth ? '100%' : 'auto'};
    border-radius: ${shape === 'round' ? '50px' : '4px'};
    font-weight: ${fontWeight};
    font-size: ${fontSize};

    ${selectSizes}

    background-color: ${backgroundColor};
    color: ${textColor};

    &:hover {
      ${hoverStyles}
    }

    span {
      display: inline-flex;
    }
  `;
};

export default Button;
