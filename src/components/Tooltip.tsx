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
  <div css={tooltipWrapperStyle}>
    <div css={tooltipTriggerStyle}>
      {children}
      <span className='tooltip-text' css={tooltipTextStyle(width)}>
        {text}
      </span>
    </div>
  </div>
);

const tooltipWrapperStyle = css`
  position: relative;
  display: inline-block;
`;

const tooltipTriggerStyle = css`
  position: relative;
  display: inline-block;
  cursor: pointer;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));

  &:hover .tooltip-text {
    opacity: 1;
    visibility: visible;
  }
`;

const tooltipTextStyle = (width: number) => css`
  font-size: ${FONT_SIZE.TEXT_XS};
  min-width: ${width}px;
  background-color: ${COLOR.WHITE};
  color: ${COLOR.TEXT_BLACK};
  text-align: center;
  border-radius: 4px;
  padding: 12px 8px;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  margin-left: -${width / 2}px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${COLOR.WHITE};
  }
`;
export default Tooltip;
