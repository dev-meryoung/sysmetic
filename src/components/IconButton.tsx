import React from 'react';
import { css } from '@emotion/react';
import { COLOR } from '@/constants/color';

type IconButtonShapeTypes = 'block' | 'round' | 'line';
type IconButtonSizeTypes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconButtonColorTypes = 'primary' | 'primary100' | 'primary600' | 'point' | 'white' | 'black';

interface IconProps {
  style?: React.CSSProperties;
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  IconComponent: React.ComponentType<IconProps>;
  label?: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  shape?: IconButtonShapeTypes;
  size?: IconButtonSizeTypes;
  color?: IconButtonColorTypes;
}

// hoverColor 는 임시입니다 ~ 나중에 수정필요
const iconButtonColors = {
  primary: { color: COLOR.PRIMARY, hoverColor: COLOR.PRIMARY600 },
  primary100: { color: COLOR.PRIMARY100, hoverColor: COLOR.PRIMARY200 },
  primary600: { color: COLOR.PRIMARY600, hoverColor: COLOR.PRIMARY700 },
  point: { color: COLOR.POINT, hoverColor: COLOR.POINT600 },
  white: { color: COLOR.WHITE, hoverColor: COLOR.GRAY100 },
  black: { color: COLOR.BLACK, hoverColor: COLOR.GRAY800 },
};

const iconFontSizes = {
  xs: 14,
  sm: 20,
  md: 30,
  lg: 40,
  xl: 48,
};

const IconButton: React.FC<IconButtonProps> = ({
  IconComponent,
  handleClick,
  label = '',
  size = 'md',
  color = 'black',
  shape = 'block',
  ...props
}) => {
  const { color: selectColor, hoverColor } = iconButtonColors[color];
  const fontSize = iconFontSizes[size];

  return (
    <button
      css={iconButtonStyle(shape, selectColor, hoverColor)}
      onClick={handleClick}
      {...props}
    >
      <IconComponent style={{ color: selectColor, fontSize }} />
      {label && <span css={labelStyle(shape, selectColor, hoverColor)}>{label}</span>}
    </button>
  );
};

const iconButtonStyle = (
  shape: IconButtonShapeTypes,
  color: string,
  hoverColor: string
) => css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: ${shape === 'line' ? 'transparent' : color};
  outline: none;
  color: ${color};
  cursor: pointer;
  border-radius: ${shape === 'round' ? '50%' : '4px'};
  
  & :hover {
    background-color: ${shape === 'line' ? 'transparent' : hoverColor}!important;
    color: ${shape === 'line' ? hoverColor : color}!important;
  }
`;

const labelStyle = (shape: IconButtonShapeTypes, color: string, hoverColor: string) => css`
  color: ${color};

  ${shape === 'line' && css`
    &:hover {
      color: ${hoverColor};
    }
  `}
`;

export default IconButton;
