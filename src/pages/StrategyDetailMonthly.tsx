import { css } from '@emotion/react';
import { COLOR } from '@/constants/color';

const StrategyDetailMonthly = () => (
  <div css={wrapperStyle}>
    <div></div>
  </div>
);

const wrapperStyle = css`
  display: flex;
  width: 100%;
  height: 400px;
  background-color: ${COLOR.POINT};
`;
export default StrategyDetailMonthly;
