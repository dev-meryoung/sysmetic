import { css } from '@emotion/react';
import { FavoriteBorder } from '@mui/icons-material';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';
import Checkbox from '@/components/Checkbox';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import TabButton from '@/components/TabButton';
import TextInput from '@/components/TextInput';
import Toggle from '@/components/Toggle';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import useAdminStrategiesControl from '@/hooks/useAdminStrategiesControl';
import {
  formatCurrency,
  formatDate,
  formatPercent,
  formatYearMonth,
} from '@/utils/dataUtils';

const TAB_BUTTONS = ['기본정보', '일간분석', '월간분석', '실계좌정보'];
const CYCLE_OPTIONS = [
  { label: '데이', value: 'D' },
  { label: '포지션', value: 'P' },
];
const STATUS_CODES = {
  PRIVATE: ['요청 전', COLOR.GRAY700],
  REQUEST: ['요청됨', COLOR.BLACK],
  PUBLIC: ['승인', COLOR.CHECK_GREEN],
  RETURN: ['반려', COLOR.ERROR_RED],
};

const AdminStrategiesControl = () => {
  const {
    openModal,
    closeModal,
    currentTab,
    setCurrentTab,
    dailyPage,
    setDailyPage,
    monthlyPage,
    setMonthlyPage,
    accountPage,
    setAccountPage,
    stockOptions,
    status,
    rejectReason,
    setRejectReason,
    dailyStartDate,
    setDailyStartDate,
    dailyEndDate,
    setDailyEndDate,
    dailyTotalPage,
    monthlyStartYearMonth,
    setMonthlyStartYearMonth,
    monthlyEndYearMonth,
    setMonthlyEndYearMonth,
    monthlyTotalPage,
    accountTotalPage,
    strategyInfo,
    strategyDaily,
    strategyMonthly,
    strategyAccount,
    handleApproveButton,
    handleRejectButton,
    handleDeleteStrategyButton,
  } = useAdminStrategiesControl();

  const conditionalRender: Record<(typeof TAB_BUTTONS)[number], JSX.Element> = {
    기본정보: (
      <div css={formBoxStyle}>
        <div className='form-box'>
          <div className='form-item'>
            <span>전략명</span>
            <span>{strategyInfo?.name}</span>
          </div>
          <div className='form-item'>
            <span>매매방식</span>
            <span>{strategyInfo?.methodName}</span>
          </div>
          <div className='form-item'>
            <span>주기</span>
            <span>
              {
                CYCLE_OPTIONS.find(
                  (option) => option.value === strategyInfo?.cycle
                )?.label
              }
            </span>
          </div>
          <div className='form-item'>
            <span>운용 종목</span>
            <div className='options'>
              {stockOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  checked={
                    strategyInfo?.stockList.stockIds.includes(
                      +option.value
                    ) as boolean
                  }
                  handleChange={() => {}}
                  label={option.label}
                />
              ))}
            </div>
          </div>
          <div className='form-item form-item-top'>
            <span>전략소개</span>
            <span>{strategyInfo?.content}</span>
          </div>
          <div className='form-item form-item-last'>
            <span>제안서</span>
            {strategyInfo?.fileWithInfoResponse ? (
              <a
                href={strategyInfo?.fileWithInfoResponse.url}
                target='_blank'
                download={strategyInfo?.fileWithInfoResponse.originalName}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {strategyInfo?.fileWithInfoResponse.originalName}
              </a>
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className='button-box'>
          <Button
            label='삭제'
            color='black'
            handleClick={() => {
              openModal('delete', 400);
            }}
            width={80}
          />
        </div>
      </div>
    ),
    일간분석: (
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
                <th>누적손익</th>
                <th>누적손익률</th>
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
    ),
    월간분석: (
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
                <th>누적손익</th>
                <th>누적손익률</th>
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
    ),
    실계좌정보: (
      <div css={accountBoxStyle}>
        <div className='account-box'>
          {strategyAccount?.content && strategyAccount.content.length > 0 ? (
            strategyAccount.content.map((account) => (
              <div className='account' key={account.accountImageId}>
                <img
                  src={account.imageUrl}
                  onClick={() =>
                    window.open(
                      account.imageUrl,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                />
                <span>{account.title}</span>
              </div>
            ))
          ) : (
            <div
              style={{ textAlign: 'center', width: '100%', padding: '64px' }}
            >
              해당하는 데이터가 없습니다.
            </div>
          )}
        </div>
        {strategyAccount?.content && strategyAccount.content.length > 0 && (
          <Pagination
            currentPage={accountPage}
            totalPage={+accountTotalPage}
            handlePageChange={setAccountPage}
          />
        )}
      </div>
    ),
  };

  return (
    <div css={wrapperStyle}>
      <div css={titleBoxStyle}>
        <h5>전략 관리</h5>
        <span>트레이더의 전략을 확인하고 승인 관리할 수 있습니다.</span>
      </div>
      <div css={traderBoxStyle}>
        <div className='left-box'>
          <div className='trader-box'>
            <ProfileImage src={strategyInfo?.traderProfileImage} />
            <span>{strategyInfo?.traderNickname}</span>
          </div>
          <div className='count-box'>
            <span>관심수</span>
            <div>
              <FavoriteBorder sx={{ color: COLOR.POINT, fontSize: '20px' }} />
              <span>{strategyInfo?.followerCount}</span>
            </div>
          </div>
        </div>
        <div className='right-box'>
          <div className='row-box'>
            <span>전략공개</span>
            <Toggle
              checked={status === 'PUBLIC'}
              disabled={true}
              handleChange={() => {}}
            />
          </div>
          <div className='row-box'>
            <span>승인단계</span>
            <span css={statusStyle(status)}>
              {STATUS_CODES[status as keyof typeof STATUS_CODES][0]}
            </span>
          </div>
          {status === 'REQUEST' ? (
            <div className='buttons'>
              <Button
                label='승인'
                color='primary'
                shape='round'
                size='xs'
                width={80}
                border={true}
                handleClick={() => openModal('approve', 400)}
              />
              <Button
                label='반려'
                color='point'
                shape='round'
                size='xs'
                width={80}
                border={true}
                handleClick={() => openModal('reject', 440)}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div css={strategyBoxStyle}>
        <TabButton
          tabs={TAB_BUTTONS}
          shape='line'
          currentTab={currentTab}
          handleTabChange={setCurrentTab}
        />
        {conditionalRender[TAB_BUTTONS[currentTab]]}
      </div>
      <Modal
        id='approve'
        content={
          <div css={modalStyle}>
            <span>해당 전략을 승인하시겠습니까?</span>
            <div className='buttons'>
              <Button
                label='아니오'
                handleClick={() => {
                  closeModal('approve');
                }}
                width={120}
                border={true}
              />
              <Button
                label='예'
                handleClick={() => handleApproveButton()}
                width={120}
              />
            </div>
          </div>
        }
      />
      <Modal
        id='reject'
        content={
          <div css={modalStyle}>
            <span className='text'>해당 전략을 반려하시겠습니까?</span>
            <div className='input-box'>
              <span>반려사유</span>
              <TextInput
                value={rejectReason}
                handleChange={(e) => {
                  setRejectReason(e.target.value);
                }}
              />
            </div>
            <div className='buttons'>
              <Button
                label='아니오'
                handleClick={() => {
                  closeModal('reject');
                  setRejectReason('');
                }}
                width={120}
                border={true}
              />
              <Button
                label='예'
                handleClick={() => handleRejectButton()}
                width={120}
              />
            </div>
          </div>
        }
      />
      <Modal
        id='delete'
        content={
          <div css={modalStyle}>
            <span>해당 전략을 삭제하시겠습니까?</span>
            <div className='buttons'>
              <Button
                label='아니오'
                handleClick={() => {
                  closeModal('delete');
                }}
                width={120}
                border={true}
              />
              <Button
                label='예'
                handleClick={() => handleDeleteStrategyButton()}
                width={120}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

const wrapperStyle = css`
  max-width: 1200px;
  height: 100%;
  padding: 0 10px;
  margin: 0 auto;
`;

const titleBoxStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 96px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${COLOR.TEXT_BLACK};

  span {
    line-height: 24px;
  }
`;

const traderBoxStyle = css`
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  margin: 40px 0;
  border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;

  .left-box {
    display: flex;
    gap: 32px;

    .trader-box {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .count-box {
      display: flex;
      flex-direction: column;
      gap: 16px;

      span:first-child {
        font-size: ${FONT_SIZE.TEXT_SM};
      }

      div {
        display: flex;
        align-items: center;
        gap: 8px;
        color: ${COLOR.POINT};
      }
    }
  }

  .right-box {
    display: flex;
    align-items: center;
    gap: 32px;

    .row-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      span:first-child {
        font-size: ${FONT_SIZE.TEXT_SM};
      }
    }

    .buttons {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
`;

const statusStyle = (status: string) => css`
  height: 20px;
  color: ${STATUS_CODES[status as keyof typeof STATUS_CODES][1]};
`;

const strategyBoxStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding-bottom: 80px;
`;

const formBoxStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .form-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 24px;
    margin-bottom: 24px;
    border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
    border-radius: 4px;

    .form-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

      span {
        line-height: 24px;
      }

      span:first-child {
        width: 84px;
        font-weight: ${FONT_WEIGHT.BOLD};
        flex-shrink: 0;
      }

      span:nth-child(2) {
        min-height: 48px;
        display: flex;
        align-items: center;
      }

      .options {
        display: flex;
        gap: 8px;
      }

      .file-box {
        display: flex;
        gap: 16px;
      }
    }

    .form-item-top {
      align-items: center;
    }

    .form-item-last {
      border: 0;
    }
  }

  .button-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 16px;
  }
`;

const dailyBoxStyle = css`
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

const accountBoxStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;

  .buttons {
    display: flex;
    width: 100%;
    gap: 16px;
    justify-content: end;
  }

  .account-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    row-gap: 32px;
    margin-bottom: 8px;

    .account {
      width: 220px;
      height: 208px;
      position: relative;
      overflow: hidden;

      &:hover {
        cursor: pointer;
      }

      div {
        position: absolute;
        top: 0;
      }

      img {
        width: 100%;
        height: 144px;
        object-fit: cover;
        margin-bottom: 16px;
      }

      span {
        padding-bottom: 10px;
        line-height: 24px;
      }
    }
  }
`;

const modalStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 8px;
  line-height: 24px;
  gap: 24px;

  .text {
    text-align: center;
    font-weight: ${FONT_WEIGHT.MEDIUM};
  }

  .input-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin-bottom: 16px;

    span {
      width: 360px;
      font-size: ${FONT_SIZE.TEXT_SM};
      text-align: left;
    }
  }

  .buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 16px;
  }
`;

export default AdminStrategiesControl;
