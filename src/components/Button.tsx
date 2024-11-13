import React from 'react';
import { css } from '@emotion/react';
import { COLOR, COLOR_OPACITY } from '@/constants/color';

type ButtonShapeTypes = 'block' | 'line' | 'round' | 'text';
type ButtonSizeTypes = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type ButtonColorTypes =
  | 'primary'
  | 'point'
  | 'primary600'
  | 'black'
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
}

type ButtonColors = {
  color: string;
  hoverColor?: string;
  disabledColor?: string;
  opacity?: number;
};

const buttonColors: Record<ButtonColorTypes, ButtonColors> = {
  primary: {
    color: COLOR.PRIMARY,
    hoverColor: COLOR.PRIMARY500,
    disabledColor: COLOR.GRAY500,
  },
  point: {
    color: COLOR.PRIMARY,
    hoverColor: COLOR.POINT500,
    disabledColor: COLOR.POINT200,
  },
  primary600: { color: COLOR.PRIMARY600, hoverColor: COLOR.PRIMARY700 },
  black: { color: COLOR.BLACK, hoverColor: COLOR.GRAY800 },
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
  xxs: css`
    width: 80px;
    height: 32px;
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
  /* 인풋, 표스퀘어, 아이디찾기, 요청하기, 인증확인 버튼용 (넓이유동적) */
  xxl: css`
    padding: 16px 17px;
  `,
};

const Button: React.FC<ButtonProps> = ({
  label,
  handleClick,
  shape = 'block',
  size = 'md',
  color = 'primary',
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
      css={buttonStyle(
        shape,
        selectSizes,
        selectColors,
        fullWidth,
        disabled,
        fontWeight,
        fontSize
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
  fontSize: string
) => {
  const backgroundColor = disabled
    ? selectColors.disabledColor
    : shape === 'text' || shape === 'line'
      ? 'transparent'
      : selectColors.color;

  const textColor =
    disabled || selectColors.color === COLOR.GRAY500
      ? COLOR.WHITE
      : shape === 'text' || shape === 'line'
        ? selectColors.color
        : COLOR.WHITE;

  const borderColor =
    shape === 'line' ? `1px solid ${selectColors.color}` : 'none';
  const hoverStyles =
    !disabled &&
    css`
      background-color: ${selectColors.hoverColor};
      color: ${shape === 'text' || shape === 'line'
        ? selectColors.color
        : COLOR.WHITE};
      ${shape === 'line' && `border-color: ${selectColors.color}`};
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
