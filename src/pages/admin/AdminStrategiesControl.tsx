import { useState } from 'react';
import { css } from '@emotion/react';
import { ContentCopy, FavoriteBorder } from '@mui/icons-material';
import tempImage from '@/assets/images/test-profile.png';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';
import Checkbox from '@/components/Checkbox';
import Pagination from '@/components/Pagination';
import ProfileImage from '@/components/ProfileImage';
import SelectBox from '@/components/SelectBox';
import TabButton from '@/components/TabButton';
import Toggle from '@/components/Toggle';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import commentMockData from '@/mocks/comment.json';
import weeklyMockData from '@/mocks/strategy-weekly.json';

const TAB_BUTTONS = ['기본정보', '일간분석', '월간분석', '실계좌정보'];

const AdminStrategiesControl = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [dailyPage, setDailyPage] = useState<number>(0);
  const [accountPage, setAccountPage] = useState<number>(0);

  const conditionalRender: Record<(typeof TAB_BUTTONS)[number], JSX.Element> = {
    기본정보: (
      <div css={formBoxStyle}>
        <div className='form-box'>
          <div className='form-item'>
            <span>전략명</span>
            <span>전략명 내용</span>
          </div>
          <div className='form-item'>
            <span>매매방식</span>
            <span>매매방식 내용</span>
          </div>
          <div className='form-item'>
            <span>주기</span>
            <span>주기 내용</span>
          </div>
          <div className='form-item'>
            <span>운용 종목</span>
            <div className='options'>
              <Checkbox
                checked={true}
                handleChange={() => {}}
                label='해외 주식'
              />
              <Checkbox
                checked={true}
                handleChange={() => {}}
                label='해외 주식'
              />
              <Checkbox
                checked={true}
                handleChange={() => {}}
                label='해외 주식'
              />
              <Checkbox
                checked={true}
                handleChange={() => {}}
                label='해외 주식'
              />
            </div>
          </div>
          <div className='form-item form-item-top'>
            <span>전략소개</span>
            <span>
              전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용전략소개내용
            </span>
          </div>
          <div className='form-item form-item-last'>
            <span>제안서</span>
            <span>제안서파일.pdf</span>
          </div>
        </div>
        <div className='button-box'>
          <Button
            label='삭제'
            color='black'
            handleClick={() => {}}
            width={80}
          />
        </div>
      </div>
    ),
    일간분석: (
      <div css={dailyBoxStyle}>
        <div className='action-box'>
          <Calendar type='periodDate' />
          <div className='buttons'>
            <SelectBox
              placeholder='파일 선택'
              options={[]}
              handleChange={() => {}}
            />
            <Button label='다운로드' width={80} handleClick={() => {}} />
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
                <th>누적손익</th>
                <th>누적손익률</th>
              </tr>
            </thead>
            <tbody>
              {weeklyMockData.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.principal}</td>
                  <td>{row.depositWithdraw}</td>
                  <td>{row.dailyProfit}</td>
                  <td>{row.dailyProfitRate}</td>
                  <td>{row.cumulativeProfit}</td>
                  <td>{row.cumulativeProfitRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <span className='explanation'>
            ※ 모든 통계 및 그래프 데이터는 실시간으로 반영되는 것이 아니라, 전
            날까지의 일간분석 데이터를 토대로 계산됩니다.
          </span>
        </div>
        <Pagination
          currentPage={dailyPage}
          totalPage={5}
          handlePageChange={setDailyPage}
        />
      </div>
    ),
    월간분석: (
      <div css={monthlyBoxStyle}>
        <div className='action-box'>
          <Calendar type='periodMonth' />
          <div className='buttons'>
            <SelectBox
              placeholder='파일 선택'
              options={[]}
              handleChange={() => {}}
            />
            <Button label='다운로드' width={80} handleClick={() => {}} />
          </div>
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
              {weeklyMockData.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.principal}</td>
                  <td>{row.depositWithdraw}</td>
                  <td>{row.dailyProfit}</td>
                  <td>{row.dailyProfitRate}</td>
                  <td>{row.cumulativeProfit}</td>
                  <td>{row.cumulativeProfitRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <span className='explanation'>
            ※ 모든 통계 및 그래프 데이터는 실시간으로 반영되는 것이 아니라, 전
            날까지의 일간분석 데이터를 토대로 계산됩니다.
          </span>
        </div>
        <Pagination
          currentPage={dailyPage}
          totalPage={5}
          handlePageChange={setDailyPage}
        />
      </div>
    ),
    실계좌정보: (
      <div css={accountBoxStyle}>
        <div className='account-box'>
          {commentMockData.map((n, idx) => (
            <div className='account' key={idx}>
              <img src={tempImage} />
              <span>
                실계좌정보의제목실계좌정보의제목실계좌정보의제목실계좌정보의제목실계좌정보의제목
              </span>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={accountPage}
          totalPage={5}
          handlePageChange={setAccountPage}
        />
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
            <ProfileImage />
            <span>트레이더명</span>
          </div>
          <div className='count-box'>
            <span>관심수</span>
            <div>
              <FavoriteBorder sx={{ color: COLOR.POINT, fontSize: '20px' }} />
              <span>1000</span>
            </div>
          </div>
          <div className='count-box'>
            <span>전략수</span>
            <div>
              <ContentCopy sx={{ color: COLOR.POINT, fontSize: '20px' }} />
              <span>1000</span>
            </div>
          </div>
        </div>
        <div className='right-box'>
          <div className='row-box'>
            <span>전략공개</span>
            <Toggle checked={false} disabled={true} handleChange={() => {}} />
          </div>
          <div className='row-box'>
            <span>승인단계</span>
            <span style={{ height: 20 }}>승인요청</span>
          </div>
          <div className='buttons'>
            <Button
              label='승인'
              color='primary'
              shape='round'
              size='xs'
              width={80}
              border={true}
              handleClick={() => {}}
            />
            <Button
              label='반려'
              color='point'
              shape='round'
              size='xs'
              width={80}
              border={true}
              handleClick={() => {}}
            />
          </div>
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
      align-items: flex-start;
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

export default AdminStrategiesControl;
