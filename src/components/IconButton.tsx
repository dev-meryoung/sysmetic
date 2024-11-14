import React from 'react';
import { css } from '@emotion/react';
import { COLOR } from '@/constants/color';

type IconButtonSizeType = 'xs' |'sm' | 'md' | 'lg' | 'xl';
type IconButtonColorType = 'primary' | 'primary100'| 'primary600' | 'point' | 'white' | 'black';

interface IconProps {
  style?: React.CSSProperties;
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  IconComponent: React.ComponentType<IconProps>;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
  size?: IconButtonSizeType;
  color?: IconButtonColorType;
  hoverColor?: IconButtonColorType;
  labelColor?: IconButtonColorType;
  backgroundColor?: IconButtonColorType | 'transparent';
  hoverBackgroundColor?: IconButtonColorType;
}

const iconButtonColors: Record<IconButtonColorType, { color: string }> = {
  primary: { color: COLOR.PRIMARY },
  primary100: { color: COLOR.PRIMARY100 },
  primary600: { color: COLOR.PRIMARY600 },
  point: { color: COLOR.POINT },
  white: { color: COLOR.WHITE },
  black: { color: COLOR.BLACK },
};

const iconFontSizes = {
  xs: 14,
  sm: 20,
  md: 30,
  lg: 40,
  xl: 48
};

const IconButton: React.FC<IconButtonProps> = ({
  IconComponent,
  handleClick,
  label = '',
  size = 'md',
  color = 'black',
  hoverColor,
  labelColor,
  backgroundColor = 'transparent',
  hoverBackgroundColor,
  ...rest
}) => {
  const selectColor = iconButtonColors[color].color;
  const selectHoverColor = hoverColor? iconButtonColors[hoverColor].color : selectColor;
  const selectLabelColor = labelColor ? iconButtonColors[labelColor].color : selectColor;
  const selectBackgroundColor = backgroundColor !== 'transparent' ? iconButtonColors[backgroundColor as IconButtonColorType]?.color : 'transparent';
  const selectHoverBackgroundColor = hoverBackgroundColor ? iconButtonColors[hoverBackgroundColor].color : selectBackgroundColor;

  return (
      <button
        css={iconButtonStyle(selectColor, selectHoverColor, selectBackgroundColor, selectHoverBackgroundColor)}
        onClick={handleClick}
        {...rest}
      >
        <IconComponent style={{ color: selectColor, fontSize: iconFontSizes[size] }} />
        {label && <span css={labelStyle(selectLabelColor)}>{label}</span>}
      </button>
  );
};

const iconButtonStyle = (
  color: string,
  hoverColor: string,
  backgroundColor: string,
  hoverBackgroundColor: string
) => css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: ${backgroundColor};
  outline: none;
  color: ${color};
  cursor: pointer;

  & :hover {
    color: ${hoverColor};
    background-color: ${hoverBackgroundColor};
  }
`;

const labelStyle = (color: string) => css`
  color: ${color};
`;

export default IconButton;
