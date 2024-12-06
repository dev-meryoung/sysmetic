import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';
import Pagination from '@/components/Pagination';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_WEIGHT } from '@/constants/font';
import {
  useGetMonthlyExcelLink,
  useGetStrategyMonthly,
} from '@/hooks/useStrategyApi';
import {
  formatCurrency,
  formatPercent,
  formatYearMonth,
} from '@/utils/dataUtils';

const StrategyDetailMonthly = () => {
  const { strategyId } = useParams();

  const [monthlyPage, setMonthlyPage] = useState<number>(0);
  const [monthlyStartYearMonth, setMonthlyStartYearMonth] =
    useState<string>('');
  const [monthlyEndYearMonth, setMonthlyEndYearMonth] = useState<string>('');
  const [monthlyTotalPage, setMonthlyTotalPage] = useState<string>('');
  const { data: strategyMonthly } = useGetStrategyMonthly(
    strategyId as string,
    monthlyPage,
    monthlyStartYearMonth,
    monthlyEndYearMonth
  );
  const { data: monthlyExcelLink } = useGetMonthlyExcelLink(
    strategyId as string
  );

  useEffect(() => {
    if (strategyMonthly)
      setMonthlyTotalPage(strategyMonthly.totalPages.toString());
  }, [strategyMonthly]);

  const handleDownloadButton = () => {
    const downloadUrl = window.URL.createObjectURL(monthlyExcelLink as Blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = '월간분석 데이터.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div css={wrapperStyle}>
      <div css={monthlyBoxStyle}>
        <div className='action-box'>
          <Calendar
            type='periodMonth'
            periodProps={{
              startDate: monthlyStartYearMonth,
              setStartDate: setMonthlyStartYearMonth,
              endDate: monthlyEndYearMonth,
              setEndDate: setMonthlyEndYearMonth,
            }}
          />
          <Button
            label='엑셀 다운로드'
            handleClick={handleDownloadButton}
            width={108}
          />
        </div>
        <div className='table-box'>
          <table className='table'>
            <thead>
              <tr>
                <th>기간</th>
                <th>원금</th>
                <th>입출금</th>
                <th>월 손익</th>
                <th>월 손익률</th>
                <th>누적 손익</th>
                <th>누적 손익률</th>
              </tr>
            </thead>
            <tbody>
              {strategyMonthly?.content &&
              strategyMonthly.content.length > 0 ? (
                strategyMonthly.content.map((monthly) => (
                  <tr key={monthly.monthId}>
                    <td>{formatYearMonth(monthly.yearMonth)}</td>
                    <td>{formatCurrency(monthly.averagePrincipal)}</td>
                    <td>{formatCurrency(monthly.depositWithdrawalAmount)}</td>
                    <td>{formatCurrency(monthly.profitLossAmount)}</td>
                    <td>{formatPercent(monthly.profitLossRate)}</td>
                    <td>
                      {formatCurrency(monthly.accumulatedProfitLossAmount)}
                    </td>
                    <td>{formatPercent(monthly.accumulatedProfitLossRate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: 'center', padding: '64px' }}
                  >
                    <div>해당하는 데이터가 없습니다.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <span className='explanation'>
            ※ 모든 통계 및 그래프 데이터는 실시간으로 반영되는 것이 아니라, 전
            날까지의 일간분석 데이터를 토대로 계산됩니다.
          </span>
        </div>
        {strategyMonthly?.content && strategyMonthly.content.length > 0 && (
          <Pagination
            currentPage={monthlyPage}
            totalPage={+monthlyTotalPage}
            handlePageChange={setMonthlyPage}
          />
        )}
      </div>
    </div>
  );
};
const wrapperStyle = css`
  display: flex;
  width: 100%;
`;

const monthlyBoxStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .action-box {
    display: flex;
    justify-content: space-between;

    .buttons {
      display: flex;
      gap: 16px;
    }
  }

  .table-box {
    width: 100%;
    text-align: right;
    margin-bottom: 8px;

    .table {
      width: 100%;
      text-align: center;
      margin-bottom: 8px;
    }

    th {
      height: 48px;
      color: ${COLOR.PRIMARY400};
      font-weight: ${FONT_WEIGHT.BOLD};
      background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
    }

    td {
      height: 48px;
      text-align: end;
      padding-right: 16px;
    }

    th,
    td {
      border: 1px solid ${COLOR.PRIMARY100};
      vertical-align: middle;
    }

    th:first-child,
    td:first-child {
      width: 120px;
      text-align: center;
      padding: 0;
    }

    th:nth-child(2),
    td:nth-child(2),
    th:nth-child(3),
    td:nth-child(3),
    th:nth-child(4),
    td:nth-child(4) {
      width: 168px;
    }

    th:nth-child(5),
    td:nth-child(5),
    th:nth-child(6),
    td:nth-child(6),
    th:nth-child(7),
    td:nth-child(7) {
      width: 140px;
    }

    .explanation {
      color: ${COLOR.POINT};
    }
  }
`;

export default StrategyDetailMonthly;
