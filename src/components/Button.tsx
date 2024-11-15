import React from 'react';
import { css } from '@emotion/react';
import { COLOR, COLOR_OPACITY } from '@/constants/color';

type ButtonShapeTypes = 'block' | 'line' | 'round' | 'text';
type ButtonSizeTypes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonColorTypes =
  | 'primary'
  | 'point'
  | 'primary600'
  | 'black'
  | 'white'
  | 'transparent'
  | 'primaryOpacity10'
  | 'pointOpacity10'
  | 'checkGreen'
  | 'warnYellow'
  | 'errorRed'
  | 'infoBlue';
type ButtonActionTypes = 'submit' | 'button';

interface ButtonProps {
  label: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  shape?: ButtonShapeTypes;
  size?: ButtonSizeTypes;
  color?: ButtonColorTypes;
  fullWidth?: boolean;
  type?: ButtonActionTypes;
  disabled?: boolean;
  fontWeight?: number;
  fontSize?: string;
  width?: number;
}

type ButtonColors = {
  color: string;
  hoverColor?: string;
  disabledColor?: string;
};

const buttonColors: Record<ButtonColorTypes, ButtonColors> = {
  primary: {
    color: COLOR.PRIMARY,
    hoverColor: COLOR.PRIMARY600,
    disabledColor: COLOR.GRAY600,
  },
  point: {
    color: COLOR.POINT,
    hoverColor: COLOR.POINT600,
    disabledColor: COLOR.POINT200,
  },
  primary600: { color: COLOR.PRIMARY600, hoverColor: COLOR.PRIMARY700 },
  black: { color: COLOR.BLACK, hoverColor: COLOR.GRAY800 },
  white: { color: COLOR.WHITE, hoverColor: COLOR.PRIMARY600 },
  transparent: { color: 'transparent', hoverColor: COLOR.PRIMARY700 },
  primaryOpacity10: {
    color: COLOR.PRIMARY,
    hoverColor: COLOR_OPACITY.PRIMARY_OPACITY10,
  },
  pointOpacity10: {
    color: COLOR.POINT,
    hoverColor: COLOR_OPACITY.POINT_OPACITY10,
  },
  checkGreen: { color: COLOR.CHECK_GREEN },
  warnYellow: { color: COLOR.WARN_YELLOW },
  errorRed: { color: COLOR.ERROR_RED },
  infoBlue: { color: COLOR.INFO_BLUE },
};

const buttonSizes: Record<ButtonSizeTypes, ReturnType<typeof css>> = {
  xs: css`
    width: 120px;
    height: 32px;
  `,
  sm: css`
    width: 144px;
    height: 40px;
  `,
  md: css`
    height: 48px;
  `,
  lg: css`
    height: 56px;
  `,
  xl: css`
    height: 136px;
  `,
};

const Button: React.FC<ButtonProps> = ({
  label,
  handleClick,
  shape = 'block',
  size = 'md',
  color = 'primary',
  type = 'button',
  fullWidth = true,
  disabled = false,
  fontWeight = 400,
  fontSize = '16px',
  width,
}) => {
  const selectColors = buttonColors[color];
  const selectSizes = buttonSizes[size];

  return (
    <button
      css={buttonStyle(
        shape,
        selectSizes,
        selectColors,
        fullWidth,
        disabled,
        fontWeight,
        fontSize,
        width
      )}
      type={type}
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

const buttonStyle = (
  shape: ButtonShapeTypes,
  selectSizes: ReturnType<typeof css>,
  selectColors: ButtonColors,
  fullWidth: boolean,
  disabled: boolean,
  fontWeight: number,
  fontSize: string,
  width?: number
) => {
  const isWhiteRound = shape === 'round' && selectColors.color === COLOR.WHITE;

  const backgroundColor = disabled
    ? selectColors.disabledColor
    : isWhiteRound
      ? COLOR.WHITE
      : shape === 'text' || shape === 'line'
        ? 'transparent'
        : selectColors.color;

  const textColor = isWhiteRound
    ? COLOR.PRIMARY
    : disabled || selectColors.color === COLOR.GRAY600
      ? COLOR.WHITE
      : shape === 'text' ||
          shape === 'line' ||
          selectColors.color === 'transparent'
        ? COLOR.BLACK
        : COLOR.WHITE;

  const borderColor = isWhiteRound
    ? `1px solid ${COLOR.PRIMARY}`
    : shape === 'line'
      ? `1px solid ${selectColors.color}`
      : 'none';

  const hoverStyles =
    !disabled &&
    css`
      background-color: ${isWhiteRound
        ? COLOR.PRIMARY600
        : selectColors.color === 'transparent'
          ? 'transparent'
          : selectColors.hoverColor};
      color: ${isWhiteRound ? COLOR.WHITE : COLOR.WHITE};
      ${isWhiteRound ? 'border: none;' : ''}
      ${shape === 'line' && `border-color: ${selectColors.hoverColor}`};
    `;

  return css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    border: ${borderColor};
    outline: none;
    width: ${width ? `${width}px` : fullWidth ? '100%' : 'auto'};
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
