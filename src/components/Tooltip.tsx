import React from 'react';
import { css } from '@emotion/react';
import { COLOR } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  width: number;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, width }) => (
  <div css={tooltipStyle(width)}>
    {children}
    <span className='tooltip-text'>{text}</span>
  </div>
);

const tooltipStyle = (width: number) => css`
  position: relative;
  display: inline-block;
  width: fit-content;
  cursor: pointer;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));

  .tooltip-text {
    font-size: ${FONT_SIZE.TEXT_XS};
    min-width: ${width}px;
    background-color: ${COLOR.WHITE};
    color: ${COLOR.TEXT_BLACK};
    text-align: center;
    border-radius: 4px;
    padding: 16px;
    position: absolute;
    z-index: 1;
    bottom: 155%;
    left: 50%;
    margin-left: -${width / 2}px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tooltip-text::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${COLOR.WHITE};
  }

  &:hover .tooltip-text {
    opacity: 1;
  }
`;

export default Tooltip;
