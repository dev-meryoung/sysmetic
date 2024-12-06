import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { COLOR } from '@/constants/color';
import { FONT_WEIGHT } from '@/constants/font';
import { useGetStrategyStatistics } from '@/hooks/useStrategyApi';
import {
  formatCurrencyNoneSpace,
  formatDate,
  formatPercent,
} from '@/utils/dataUtils';

const StrategyDetail = () => {
  const { strategyId } = useParams();

  const { data: strategyStatistics } = useGetStrategyStatistics(
    strategyId as string
  );

  return (
    <div css={wrapperStyle}>
      <table css={tableStyle}>
        <tbody>
          <tr>
            <td>잔고</td>
            <td>
              {formatCurrencyNoneSpace(
                strategyStatistics?.currentBalance as number
              )}
            </td>
            <td>운용기간</td>
            <td>{strategyStatistics?.operationPeriod}</td>
          </tr>
          <tr>
            <td>누적 입출금액</td>
            <td>
              {formatCurrencyNoneSpace(
                strategyStatistics?.accumulatedDepositWithdrawalAmount as number
              )}
            </td>
            <td>시작일자</td>
            <td>{formatDate(strategyStatistics?.startDate as string)}</td>
          </tr>
          <tr>
            <td>원금</td>
            <td>
              {formatCurrencyNoneSpace(strategyStatistics?.principal as number)}
            </td>
            <td>최종일자</td>
            <td>{formatDate(strategyStatistics?.endDate as string)}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>누적손익금</td>
            <td>
              {formatCurrencyNoneSpace(
                strategyStatistics?.accumulatedProfitLossAmount as number
              )}
            </td>
            <td>최대 누적손익금</td>
            <td>
              {formatCurrencyNoneSpace(
                strategyStatistics?.maximumAccumulatedProfitLossAmount as number
              )}
            </td>
          </tr>
          <tr>
            <td>누적손익률</td>
            <td>
              {formatPercent(
                strategyStatistics?.accumulatedProfitLossRate as number
              )}
            </td>
            <td>최대 누적손익률</td>
            <td>
              {formatPercent(
                strategyStatistics?.maximumAccumulatedProfitLossRate as number
              )}
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>현재 자본인하금액</td>
            <td>
              {formatCurrencyNoneSpace(
                strategyStatistics?.currentCapitalReductionAmount as number
              )}
            </td>
            <td>최대 자본인하금액</td>
            <td>
              {formatCurrencyNoneSpace(
                strategyStatistics?.maximumCapitalReductionAmount as number
              )}
            </td>
          </tr>
          <tr>
            <td>현재 자본인하율</td>
            <td>
              {formatPercent(
                strategyStatistics?.currentCapitalReductionRate as number
              )}
            </td>
            <td>최대 자본인하율</td>
            <td>
              {formatPercent(
                strategyStatistics?.maximumCapitalReductionRate as number
              )}
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>평균 손익 금액</td>
            <td>
              {formatCurrencyNoneSpace(
                strategyStatistics?.averageProfitLossAmount as number
              )}
            </td>
            <td>평균 손익률</td>
            <td>
              {formatPercent(
                strategyStatistics?.averageProfitLossRate as number
              )}
            </td>
          </tr>
          <tr>
            <td>최대 일 이익 금액</td>
            <td>
              {formatCurrencyNoneSpace(
                strategyStatistics?.maximumDailyProfitAmount as number
              )}
            </td>
            <td>최대 일 손실 금액</td>
            <td>
              {formatCurrencyNoneSpace(
                strategyStatistics?.maximumDailyLossAmount as number
              )}
            </td>
          </tr>
          <tr>
            <td>최대 일 이익률</td>
            <td>
              {formatPercent(
                strategyStatistics?.maximumDailyProfitRate as number
              )}
            </td>
            <td>최대 일 손실률</td>
            <td>
              {formatPercent(
                strategyStatistics?.maximumDailyLossRate as number
              )}
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>총 매매 일수</td>
            <td>{strategyStatistics?.totalTradingDays}</td>
            <td>현재 연속 손익일수</td>
            <td>{strategyStatistics?.currentContinuousProfitLossDays}</td>
          </tr>
          <tr>
            <td>총 이익 일수</td>
            <td>{strategyStatistics?.totalProfitDays}</td>
            <td>최대 연속 이익 일수</td>
            <td>{strategyStatistics?.maxContinuousProfitDays}</td>
          </tr>
          <tr>
            <td>총 손실 일수</td>
            <td>{strategyStatistics?.totalLossDays}</td>
            <td>최대 연속 손실 일수</td>
            <td>{strategyStatistics?.maxContinuousLossDays}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>승률</td>
            <td>{formatPercent(strategyStatistics?.winningRate as number)}</td>
            <td>ROA(Return on Assets)</td>
            <td>{formatPercent(strategyStatistics?.roa as number)}</td>
          </tr>
          <tr>
            <td>Profit Factor</td>
            <td>{formatPercent(strategyStatistics?.profitFactor as number)}</td>
            <td>고점갱신 후 경과일</td>
            <td>{strategyStatistics?.highPointRenewalProgress}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const wrapperStyle = css`
  display: flex;
  width: 100%;
`;

const tableStyle = css`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  tbody {
    display: table;
    width: 100%;
    margin-bottom: 24px;
  }

  tbody:last-child {
    margin-bottom: 0;
  }

  td {
    width: 25%;
    height: 48px;
    text-align: end;
    vertical-align: middle;
    padding: 16px;
    border: 1px solid ${COLOR.PRIMARY100};
    letter-spacing: -2%;
  }

  td:nth-child(1),
  td:nth-child(3) {
    text-align: start;
    font-weight: ${FONT_WEIGHT.BOLD};
    background-color: ${COLOR.CARD_BLUE};
  }
`;

export default StrategyDetail;
