import { css } from '@emotion/react';
import { COLOR } from '@/constants/color';

const Dot = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='4'
    height='4'
    viewBox='0 0 4 4'
    fill='none'
    css={dotStyle}
  >
    <circle cx='2' cy='2' r='2' fill={COLOR.POINT} />
  </svg>
);
const dotStyle = css`
  margin-left: 4px;
  transform: translateY(-200%);
`;

export default Dot;
