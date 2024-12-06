import React from 'react';
import { css } from '@emotion/react';
import { COLOR, COLOR_OPACITY } from '@/constants/color';

type ButtonShapeTypes = 'square' | 'round' | 'none';
type ButtonSizeTypes = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonColorTypes =
  | 'primary'
  | 'point'
  | 'black'
  | 'blackToPrimary'
  | 'blackToPrimary700'
  | 'textBlack'
  | 'gray200'
  | 'white'
  | 'transparent'
  | 'primaryOpacity10'
  | 'pointOpacity10'
  | 'primary700';
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
  border?: boolean;
}

type ButtonColors = {
  color: string;
  hoverColor?: string;
  disabledColor?: string;
};

// 피그마에 없는 disabled 은 임시로 넣었습니다!
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
  black: {
    color: COLOR.BLACK,
    hoverColor: COLOR.GRAY800,
    disabledColor: COLOR.GRAY600,
  },
  textBlack: {
    color: COLOR.TEXT_BLACK,
    hoverColor: COLOR.GRAY800,
    disabledColor: COLOR.GRAY600,
  },
  //nav 텍스트
  blackToPrimary: {
    color: COLOR.BLACK,
    hoverColor: COLOR.PRIMARY,
    disabledColor: COLOR.GRAY600,
  },
  //그래프버튼
  blackToPrimary700: {
    color: COLOR.BLACK,
    hoverColor: COLOR.PRIMARY700,
    disabledColor: COLOR.GRAY600,
  },
  gray200: {
    color: COLOR.GRAY200,
    hoverColor: COLOR.PRIMARY,
    disabledColor: COLOR.GRAY600,
  },
  white: {
    color: COLOR.WHITE,
    hoverColor: COLOR.PRIMARY,
    disabledColor: COLOR.GRAY600,
  },
  transparent: {
    color: 'transparent',
    hoverColor: COLOR.PRIMARY700,
    disabledColor: COLOR.GRAY600,
  },
  primaryOpacity10: {
    color: COLOR.PRIMARY,
    hoverColor: COLOR_OPACITY.PRIMARY_OPACITY10,
    disabledColor: COLOR.GRAY600,
  },
  pointOpacity10: {
    color: COLOR.POINT,
    hoverColor: COLOR_OPACITY.POINT_OPACITY10,
    disabledColor: COLOR.GRAY600,
  },
  primary700: {
    color: COLOR.PRIMARY700,
    hoverColor: COLOR.PRIMARY800,
    disabledColor: COLOR.GRAY600,
  },
};

const buttonSizes: Record<ButtonSizeTypes, ReturnType<typeof css>> = {
  xxs: css`
    height: 24px;
  `,
  xs: css`
    height: 32px;
  `,
  sm: css`
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
  shape = 'square',
  size = 'md',
  color = 'primary',
  type = 'button',
  fullWidth = true,
  disabled = false,
  fontWeight = 500,
  fontSize = '14px',
  width,
  border = false,
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
        width,
        border,
        color
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
  width?: number,
  border?: boolean,
  color?: ButtonColorTypes
) => {
  const backgroundColor = disabled
    ? selectColors.disabledColor
    : border
      ? 'transparent'
      : shape === 'none'
        ? 'transparent'
        : selectColors.color;

  const textColor = disabled
    ? COLOR.WHITE
    : border
      ? selectColors.color
      : shape === 'none'
        ? selectColors.color
        : selectColors.color === 'transparent'
          ? COLOR.BLACK
          : selectColors.color === COLOR.WHITE ||
              selectColors.color === COLOR.GRAY200
            ? COLOR.BLACK
            : COLOR.WHITE;

  const borderColor = disabled
    ? 'none'
    : border
      ? `1px solid ${selectColors.color}`
      : 'none';

  const hoverStyles =
    !disabled &&
    css`
      background-color: ${border
        ? selectColors.hoverColor
        : shape === 'none'
          ? 'transparent'
          : selectColors.hoverColor};

      color: ${border
        ? color === 'primaryOpacity10' || color === 'pointOpacity10'
          ? selectColors.color
          : COLOR.WHITE
        : shape === 'none'
          ? selectColors.hoverColor
          : selectColors.color === COLOR.WHITE
            ? COLOR.WHITE
            : COLOR.WHITE};

      ${border && disabled
        ? `border: none`
        : color === 'primaryOpacity10' || color === 'pointOpacity10'
          ? `border: 1px solid ${selectColors.color}`
          : `border: none`};
    `;

  const activeStyles =
    !disabled &&
    css`
      background-color: ${shape === 'none' && color === 'blackToPrimary700'
        ? COLOR.PRIMARY
        : shape === 'none' && color !== 'blackToPrimary700'
          ? 'transparrent'
          : (shape === 'round' && color === 'primaryOpacity10') ||
              (shape === 'square' && color === 'primaryOpacity10')
            ? 'transparent'
            : selectColors.color};

      color: ${shape === 'none' && color === 'blackToPrimary700'
        ? COLOR.WHITE
        : (shape === 'round' && color === 'primaryOpacity10') ||
            (shape === 'square' && color === 'primaryOpacity10')
          ? selectColors.color
          : (shape === 'square' && color === 'white') ||
              (shape === 'square' && color === 'gray200')
            ? COLOR.BLACK
            : shape === 'none'
              ? selectColors.color
              : COLOR.WHITE};

      border-radius: ${(shape === 'none' && color === 'blackToPrimary700') ||
      shape === 'round'
        ? '50px'
        : '4px'};
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
    font-family: 'Pretendard Variable', Pretendard, 'Malgun Gothic', Helvetica,
      'Apple SD Gothic Neo', Sans-serif;
    ${selectSizes}

    background-color: ${backgroundColor};
    color: ${textColor};

    &:hover {
      ${hoverStyles}
    }

    &:active {
      ${activeStyles}
    }

    span {
      display: inline-flex;
    }
  `;
};

export default Button;
