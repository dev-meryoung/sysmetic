import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';
import Pagination from '@/components/Pagination';
import SelectBox from '@/components/SelectBox';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_WEIGHT } from '@/constants/font';
import {
  useGetDailyDataExcelLink,
  useGetDailyExcelLink,
  useGetStrategyDaily,
} from '@/hooks/useStrategyApi';
import { formatCurrency, formatDate, formatPercent } from '@/utils/dataUtils';

const SELECT_OPTIONS = [
  { label: '엑셀', value: 'EXCEL' },
  { label: '엑셀 (분석지표 포함)', value: 'EXCEL_DATA' },
];

const StrategyDetailDaily = () => {
  const { strategyId } = useParams();

  const [selectOptions, setSelectOptions] = useState<string>('');
  const [dailyPage, setDailyPage] = useState<number>(0);
  const [dailyStartDate, setDailyStartDate] = useState<string>('');
  const [dailyEndDate, setDailyEndDate] = useState<string>('');
  const [dailyTotalPage, setDailyTotalPage] = useState<string>('');

  const { data: strategyDaily } = useGetStrategyDaily(
    strategyId as string,
    dailyPage,
    dailyStartDate,
    dailyEndDate
  );
  const { data: dailyExcelLink } = useGetDailyExcelLink(strategyId as string);
  const { data: dailyDataExcelLink } = useGetDailyDataExcelLink(
    strategyId as string
  );

  useEffect(() => {
    if (strategyDaily) setDailyTotalPage(strategyDaily.totalPages.toString());
  }, [strategyDaily]);

  const handleDownloadButton = () => {
    if (selectOptions === '') {
      return;
    }

    const downloadUrl =
      selectOptions === 'EXCEL'
        ? window.URL.createObjectURL(dailyExcelLink as Blob)
        : window.URL.createObjectURL(dailyDataExcelLink as Blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download =
      selectOptions === 'EXCEL'
        ? '일간분석 데이터.xlsx'
        : '일간분석(분석지표 포함) 데이터.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div css={wrapperStyle}>
      <div css={dailyBoxStyle}>
        <div className='action-box'>
          <Calendar
            type='periodDate'
            periodProps={{
              startDate: dailyStartDate,
              setStartDate: setDailyStartDate,
              endDate: dailyEndDate,
              setEndDate: setDailyEndDate,
            }}
          />
          <div className='file'>
            <SelectBox
              options={SELECT_OPTIONS}
              handleChange={setSelectOptions}
              placeholder='파일 유형 선택'
            />
            <Button
              label='다운로드'
              handleClick={handleDownloadButton}
              width={80}
              disabled={selectOptions === ''}
            />
          </div>
        </div>
        <div className='table-box'>
          <table className='table'>
            <thead>
              <tr>
                <th>날짜</th>
                <th>원금</th>
                <th>입출금</th>
                <th>일 손익</th>
                <th>일 손익률</th>
                <th>누적 손익</th>
                <th>누적 손익률</th>
              </tr>
            </thead>
            <tbody>
              {strategyDaily?.content && strategyDaily.content.length > 0 ? (
                strategyDaily.content.map((daily) => (
                  <tr key={daily.dailyId}>
                    <td>{formatDate(daily.date)}</td>
                    <td>{formatCurrency(daily.principal)}</td>
                    <td>{formatCurrency(daily.depositWithdrawalAmount)}</td>
                    <td>{formatCurrency(daily.profitLossAmount)}</td>
                    <td>{formatPercent(daily.profitLossRate)}</td>
                    <td>{formatCurrency(daily.accumulatedProfitLossAmount)}</td>
                    <td>{formatPercent(daily.accumulatedProfitLossRate)}</td>
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
        {strategyDaily?.content && strategyDaily.content.length > 0 ? (
          <Pagination
            currentPage={dailyPage}
            totalPage={+dailyTotalPage}
            handlePageChange={setDailyPage}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const wrapperStyle = css`
  display: flex;
  width: 100%;
`;

const dailyBoxStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .action-box {
    display: flex;
    justify-content: space-between;

    .file {
      display: flex;
      gap: 16px;
    }

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

export default StrategyDetailDaily;
