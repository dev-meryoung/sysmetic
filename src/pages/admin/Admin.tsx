import { useState } from 'react';
import { css } from '@emotion/react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import TabButton from '@/components/TabButton';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

const Admin = () => {
  const [tab, setTab] = useState(0);
  const [curTab, setCurTab] = useState(0);

  return (
    <div css={adminWrapperStyle}>
      <div css={topDivStyle}>
        <div css={innerDivStyle}>
          <div css={strategyStyle}>
            <div className='strategy-header'>
              <h6>전략 현황</h6>
              <ArrowForwardIosOutlinedIcon />
            </div>
            <div css={gridStyle}>
              <div className='r-items'>
                <p>승인 대기중</p>
                <h1>6</h1>
              </div>
              <div className='str-items'>
                <p>처리된 전략 수</p>
                <h1>45</h1>
              </div>
              <div className='str-items'>
                <p>총 전략 수</p>
                <h1>51</h1>
              </div>
            </div>
          </div>
          <div css={qnaStyle}>
            <div className='qna-header'>
              <h6>문의 현황</h6>
              <ArrowForwardIosOutlinedIcon />
            </div>
            <div css={gridStyle}>
              <div className='b-items'>
                <p>대기중인 문의</p>
                <h1>6</h1>
              </div>
              <div className='qna-items'>
                <p>완료된 문의</p>
                <h1>45</h1>
              </div>
              <div className='qna-items'>
                <p>총 문의수</p>
                <h1>51</h1>
              </div>
            </div>
          </div>
        </div>
        <div css={userStyle}>
          <div className='user-header'>
            <h6>회원 현황</h6>
            <ArrowForwardIosOutlinedIcon />
          </div>
          <div className='chart'></div>
          <div className='tab-btn'>
            <TabButton
              tabs={['1일', '1달', '1년']}
              currentTab={curTab}
              handleTabChange={setTab}
            />
          </div>
        </div>
      </div>
      <div css={homeStyle}>
        <h6>홈페이지 현황</h6>
        <div css={gridStyle}>
          <div className='h-items'>
            <p>방문수</p>
            <h1>51</h1>
          </div>
          <div className='home-items'>
            <p>평균 머문시간</p>
            <h1>0.5</h1>
          </div>
          <div className='home-url-items'>
            <p>가장 많이 들른 URL</p>
            <div className='url'>
              <p>1. asdasda</p>
              <p>2. sdadasdas</p>
              <p>3. dassdasda</p>
            </div>
          </div>
        </div>
      </div>
      <div css={noticeStyle}>
        <h6>공지사항 현황</h6>
        <p>시스메틱 내 '오늘의 투자'판이 출시됩니다!</p>
        <span>2024. 11. 28</span>
      </div>
    </div>
  );
};

const adminWrapperStyle = css`
  width: 100%;
  height: 100%;
  padding: 96px 370px;
  margin: 0 auto;
  letter-spacing: -0.4px;
  font-size: ${FONT_SIZE.TEXT_SM};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background-color: ${COLOR_OPACITY.PRIMARY100_OPACITY30};
`;

const topDivStyle = css`
  display: flex;
  gap: 16px;
  max-width: 1180px;
`;

const innerDivStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const strategyStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
  background-color: ${COLOR.WHITE};
  border-radius: 4px;
  padding: 34px;

  .strategy-header {
    display: flex;
    justify-content: space-between;
  }
`;

const qnaStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
  background-color: ${COLOR.WHITE};
  border-radius: 4px;
  padding: 34px;

  .qna-header {
    display: flex;
    justify-content: space-between;
  }
`;

const userStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${COLOR.WHITE};
  padding: 42px 32px 24px;
  border-radius: 4px;

  .chart {
    width: 240px;
    height: 240px;
    background-color: ${COLOR.BLACK};
    border-radius: 50%;
  }

  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tab-btn {
    width: 334px;
  }
`;

const gridStyle = css`
  display: flex;
  gap: 20px;

  .str-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    font-size: ${FONT_SIZE.TITLE_XS};
    width: 220px;
    height: 160px;
    border: 1px solid ${COLOR.POINT};
    border-radius: 4px;

    p {
      color: ${COLOR.POINT};
    }

    h1 {
      display: flex;
      justify-content: flex-end;
    }
  }

  .qna-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    font-size: ${FONT_SIZE.TITLE_XS};
    width: 220px;
    height: 160px;
    border: 1px solid ${COLOR.PRIMARY};
    border-radius: 4px;

    p {
      color: ${COLOR.PRIMARY};
    }
    h1 {
      display: flex;
      justify-content: flex-end;
    }
  }

  .r-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    font-size: ${FONT_SIZE.TITLE_XS};
    color: ${COLOR.WHITE};
    width: 220px;
    height: 160px;
    background-color: ${COLOR.POINT};
    border-radius: 4px;

    h1 {
      display: flex;
      justify-content: flex-end;
    }
  }

  .b-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    font-size: ${FONT_SIZE.TITLE_XS};
    color: ${COLOR.WHITE};
    width: 220px;
    height: 160px;
    background-color: ${COLOR.PRIMARY};
    border-radius: 4px;

    h1 {
      display: flex;
      justify-content: flex-end;
    }
  }
`;

const homeStyle = css`
  display: flex;
  flex-direction: column;
  gap: 26px;
  width: 1200px;
  background-color: ${COLOR.WHITE};
  border-radius: 4px;
  height: 268px;
  max-width: 1180px;
  padding: 34px;

  .h-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    font-size: ${FONT_SIZE.TITLE_XS};
    color: ${COLOR.WHITE};
    width: 220px;
    height: 160px;
    background-color: ${COLOR.PRIMARY600};
    border-radius: 4px;

    h1 {
      display: flex;
      justify-content: flex-end;
    }
  }

  .home-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    font-size: ${FONT_SIZE.TITLE_XS};
    width: 220px;
    height: 160px;
    border: 1px solid ${COLOR.PRIMARY600};
    border-radius: 4px;

    p {
      color: ${COLOR.PRIMARY600};
    }

    h1 {
      display: flex;
      justify-content: flex-end;
    }
  }

  .home-url-items {
    display: flex;
    font-size: ${FONT_SIZE.TITLE_XS};
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    width: 630px;
    height: 160px;
    border: 1px solid ${COLOR.PRIMARY600};
    border-radius: 4px;
    gap: 20px;

    p {
      color: ${COLOR.PRIMARY600};
    }

    .url {
      display: flex;
      flex-direction: column;
      gap: 12px;

      p {
        color: ${COLOR.TEXT_BLACK};
        font-size: ${FONT_SIZE.TEXT_MD};
      }
    }
  }
`;

const noticeStyle = css`
  background-color: ${COLOR.WHITE};
  border-radius: 4px;
  width: 1200px;
  height: 80px;
  max-width: 1180px;
  display: flex;
  align-items: center;
  padding: 28px 34px;
  justify-content: space-between;

  p {
    width: 800px;
    font-size: ${FONT_SIZE.TITLE_XS};
  }
`;
export default Admin;
