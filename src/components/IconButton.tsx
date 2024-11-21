import React from 'react';
import { css } from '@emotion/react';
import { COLOR } from '@/constants/color';
type IconButtonShapeTypes = 'square' | 'round' | 'none';
type IconButtonSizeTypes = 'sm' | 'md' | 'lg';
type IconButtonColorTypes =
  | 'primary'
  | 'primary100'
  | 'primary600'
  | 'point'
  | 'white'
  | 'gray'
  | 'black';

interface IconProps {
  style?: React.CSSProperties;
}

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  IconComponent: React.ComponentType<IconProps>;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  shape?: IconButtonShapeTypes;
  iconSize?: IconButtonSizeTypes;
  iconBgSize?: IconButtonSizeTypes;
  color?: IconButtonColorTypes;
}

const iconButtonColors = {
  primary: { color: COLOR.PRIMARY, hoverColor: COLOR.PRIMARY600 },
  primary100: { color: COLOR.PRIMARY100, hoverColor: COLOR.PRIMARY200 },
  primary600: { color: COLOR.PRIMARY600, hoverColor: COLOR.PRIMARY700 },
  point: { color: COLOR.POINT, hoverColor: COLOR.POINT600 },
  white: { color: COLOR.WHITE, hoverColor: COLOR.GRAY100 },
  black: { color: COLOR.BLACK, hoverColor: COLOR.GRAY800 },
  gray: { color: COLOR.GRAY600, hoverColor: COLOR.GRAY800 },
};

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
};

const iconBgSizes = {
  sm: 30,
  md: 40,
  lg: 48,
};

const IconButton: React.FC<IconButtonProps> = ({
  IconComponent,
  handleClick,
  iconSize = 'md',
  iconBgSize = 'md',
  color = 'black',
  shape = 'square',
  ...props
}) => {
  const { color: selectColor, hoverColor } = iconButtonColors[color];
  const size = iconSizes[iconSize];
  const bgSize = iconBgSizes[iconBgSize];

  return (
    <button
      css={iconButtonStyle(shape, selectColor, hoverColor, size, bgSize)}
      onClick={handleClick}
      {...props}
    >
      <IconComponent />
    </button>
  );
};

const iconButtonStyle = (
  shape: IconButtonShapeTypes,
  color: string,
  hoverColor: string,
  iconSize: number,
  bgSize: number
) => css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: ${shape === 'none' ? 'transparent' : color};
  outline: none;
  width: ${bgSize}px;
  height: ${bgSize}px;
  cursor: pointer;
  border-radius: ${shape === 'round' ? '50%' : '4px'};

  svg {
    font-size: ${iconSize}px;
    color: ${shape === 'none'
      ? color
      : color === COLOR.WHITE
        ? COLOR.BLACK
        : COLOR.WHITE};
  }

  &:hover {
    background-color: ${shape === 'none' ? 'transparent' : hoverColor};
    color: ${shape === 'round' || shape === 'square'
      ? color === COLOR.PRIMARY
        ? COLOR.WHITE
        : color === COLOR.WHITE
          ? COLOR.BLACK
          : color
      : hoverColor};
  }
`;

export default IconButton;
