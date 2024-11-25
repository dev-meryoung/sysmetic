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
import TextArea from '@/components/TextArea';
import TextInput from '@/components/TextInput';
import Toggle from '@/components/Toggle';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import commentMockData from '@/mocks/comment.json';
import weeklyMockData from '@/mocks/strategy-weekly.json';

const TAB_BUTTONS = ['기본정보', '일간분석', '실계좌정보'];

const MyStrategyEdit = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [dailyPage, setDailyPage] = useState<number>(0);
  const [accountPage, setAccountPage] = useState<number>(0);

  const conditionalRender: Record<(typeof TAB_BUTTONS)[number], JSX.Element> = {
    기본정보: (
      <div css={formBoxStyle}>
        <div className='form-box'>
          <div className='form-item'>
            <span>전략명</span>
            <TextInput value='' handleChange={() => {}} width={700} />
          </div>
          <div className='form-item'>
            <span>매매방식</span>
            <SelectBox
              placeholder='매매방식 선택'
              options={[]}
              handleChange={() => {}}
            />
          </div>
          <div className='form-item'>
            <span>주기</span>{' '}
            <SelectBox
              placeholder='주기 선택'
              options={[
                { label: '데이', value: 'day' },
                { label: '포지션', value: 'position' },
              ]}
              handleChange={() => {}}
            />
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
            <span>
              전략소개
              <br />
              <span className='explain-text'>(500자내외)</span>
            </span>
            <TextArea value='' handleChange={() => {}} />
          </div>
          <div className='form-item form-item-last'>
            <span>제안서</span>
            <div className='file-box'>
              <TextInput value='제안서.pdf' handleChange={() => {}} />
              <Button label='찾아보기' handleClick={() => {}} width={80} />
            </div>
          </div>
        </div>
        <div className='button-box'>
          <Button
            label='이전'
            handleClick={() => {}}
            border={true}
            width={120}
          />
          <Button label='수정' handleClick={() => {}} width={120} />
        </div>
      </div>
    ),
    일간분석: (
      <div css={dailyBoxStyle}>
        <div className='action-box'>
          <Calendar type='periodDate' />
          <div className='buttons'>
            <Button label='데이터 입력' width={95} handleClick={() => {}} />
            <Button
              label='엑셀 양식 다운로드'
              color='black'
              width={130}
              handleClick={() => {}}
            />
            <Button
              label='엑셀 업로드'
              color='black'
              width={95}
              handleClick={() => {}}
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
                <th>누적손익</th>
                <th>누적손익률</th>
                <th>관리</th>
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
                  <td>
                    <div>
                      <Button
                        label='수정'
                        shape='round'
                        size='xs'
                        width={80}
                        border={true}
                        handleClick={() => {}}
                      />
                      <Button
                        label='삭제'
                        shape='round'
                        size='xs'
                        width={80}
                        border={true}
                        handleClick={() => {}}
                      />
                    </div>
                  </td>
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
        <div className='buttons'>
          <Button label='실계좌 등록' width={95} handleClick={() => {}} />
          <Button
            label='전체선택'
            color='black'
            width={80}
            handleClick={() => {}}
          />
          <Button
            label='삭제'
            color='black'
            width={80}
            handleClick={() => {}}
          />
        </div>
        <div className='account-box'>
          {commentMockData.map((n) => (
            <div className='account' key={n.nickname}>
              <Checkbox checked={false} handleChange={() => {}} />
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
        <h5>전략 수정</h5>
        <span>
          시스메틱에서 나의 투자 전략을 수정하고 다시 공유해보세요.
          <br />
          트레이더라면 투자자들이 당신의 전략에 투자할 수 있습니다.
        </span>
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
            <span style={{ height: 20, color: COLOR.GRAY700 }}>요청전</span>
          </div>
          <div>
            <Button
              label='승인요청'
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
    margin-bottom: 80px;
    border: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};
    border-radius: 4px;

    .form-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid ${COLOR_OPACITY.BLACK_OPACITY30};

      span:first-child {
        width: 84px;
        font-weight: ${FONT_WEIGHT.BOLD};
        line-height: 24px;

        .explain-text {
          font-size: ${FONT_SIZE.TEXT_SM};
          font-weight: ${FONT_WEIGHT.REGULAR};
        }
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
    display: flex;
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
      height: 120px;
      text-align: end;
      padding-right: 16px;
    }

    th,
    td {
      border: 1px solid ${COLOR.PRIMARY100};
      vertical-align: middle;
    }

    th:first-child {
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

    td:last-child {
      text-align: center;
      padding: 0;

      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 16px;
      }
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

export default MyStrategyEdit;
