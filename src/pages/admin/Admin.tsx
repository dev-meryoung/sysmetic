import { SetStateAction, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import TabButton from '@/components/TabButton';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useGetAdminMain } from '@/hooks/useAdminApi';

const Admin = () => {
  const [tab, setTab] = useState(0);
  const [curTab, setCurTab] = useState(0);
  const navigate = useNavigate();

  const { data, isLoading } = useGetAdminMain();

  const runReport = data?.data?.runReportResponseDto || {};
  const memberCount = data?.data?.memberCount || {};
  const strategyCount = data?.data?.strategyCount || {};
  const inquiryCount = data?.data?.adminInquiryResponseDto || {};
  const notices = data?.data?.adminNoticeResponse || [];

  const handleStrategyClick = () => {
    navigate(PATH.ADMIN_STRATEGIES);
  };
  const handleQnaClick = () => {
    navigate(PATH.ADMIN_QNA);
  };

  const handleUserClick = () => {
    navigate(PATH.ADMIN_USERS);
  };

  const handleNoticeClick = () => {
    navigate(PATH.ADMIN_NOTICES_DETAIL(notices.noticeId));
  };

  const handleTabClick = (value: SetStateAction<number>) => {
    setTab(value);
  };

  useEffect(() => {
    setCurTab(tab);
  }, [tab]);

  if (isLoading) {
    return <Loading />;
  }

  const DonutChart = () => {
    const options = {
      chart: {
        type: 'pie',
        width: 320,
        height: 320,
      },
      title: {
        text: `${new Date().toISOString().substring(0, 10)} 기준`,
      },
      plotOptions: {
        pie: {
          innerSize: '20%',
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: '인원',
          colorByPoint: true,
          data: [
            {
              name: '트레이더',
              y: memberCount.traderMemberCount,
              color: COLOR.PRIMARY600,
            },
            {
              name: '투자자',
              y: memberCount.userMemberCount,
              color: COLOR.PRIMARY200,
            },
          ],
        },
      ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
  };

  return (
    <div css={adminWrapperStyle}>
      <div css={topDivStyle}>
        <div css={innerDivStyle}>
          <div css={strategyStyle}>
            <div className='strategy-header'>
              <h6>전략 현황</h6>
              <ArrowForwardIosOutlinedIcon
                onClick={handleStrategyClick}
                css={arrowStyle}
              />
            </div>
            <div css={gridStyle}>
              <div className='r-items'>
                <p>승인 대기중</p>
                <h1>{strategyCount.waitingStrategyCount || 0}</h1>
              </div>
              <div className='str-items'>
                <p>처리된 전략 수</p>
                <h1>{strategyCount.openStrategyCount || 0}</h1>
              </div>
              <div className='str-items'>
                <p>총 전략 수</p>
                <h1>{strategyCount.totalStrategyCount || 0}</h1>
              </div>
            </div>
          </div>
          <div css={qnaStyle}>
            <div className='qna-header'>
              <h6>문의 현황</h6>
              <ArrowForwardIosOutlinedIcon
                onClick={handleQnaClick}
                css={arrowStyle}
              />
            </div>
            <div css={gridStyle}>
              <div className='b-items'>
                <p>대기중인 문의</p>
                <h1>{inquiryCount.waitingInquiryCount || 0}</h1>
              </div>
              <div className='qna-items'>
                <p>완료된 문의</p>
                <h1>{inquiryCount.answeredInquiryCount || 0}</h1>
              </div>
              <div className='qna-items'>
                <p>총 문의수</p>
                <h1>{inquiryCount.inquiryCount || 0}</h1>
              </div>
            </div>
          </div>
        </div>
        <div css={userStyle}>
          <div className='user-header'>
            <h6>회원 현황</h6>
            <ArrowForwardIosOutlinedIcon
              onClick={handleUserClick}
              css={arrowStyle}
            />
          </div>
          <div className='chart'>
            <DonutChart />
          </div>
          <div className='chart-data'>
            <div css={chartDataStyle}>
              <div className='pixel-inv'></div>
              <p>투자자</p>
            </div>
            <div css={chartDataStyle}>
              <div className='pixel-tra'></div>
              <p>트레이더</p>
            </div>
          </div>
          <div className='tab-btn'>
            <TabButton
              tabs={['1일', '1달', '1년']}
              currentTab={curTab}
              handleTabChange={handleTabClick}
            />
          </div>
        </div>
      </div>
      <div css={homeStyle}>
        <h6>홈페이지 현황</h6>
        <div css={gridStyle}>
          <div className='h-items'>
            <p>방문수</p>
            <h1>{runReport.activeUser || 0}</h1>
          </div>
          <div className='home-items'>
            <p>평균 머문시간</p>
            <h1>{runReport.avgSessionDuration || '0분 0초'}</h1>
          </div>
          <div className='home-url-items'>
            <p>가장 많이 들른 URL</p>
            <div className='url'>
              <p>1. www.naver.com</p>
              <p>2. www.daum.net</p>
              <p>3. www.google.com</p>
            </div>
          </div>
        </div>
      </div>
      <div css={noticeStyle}>
        <h6>공지사항 현황</h6>
        <p onClick={handleNoticeClick}>{notices[0].noticeTitle}</p>
        <span>{notices[0].noticeRegistrationDate}</span>
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

  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tab-btn {
    width: 334px;
  }

  .chart {
    margin: 0 auto;
  }

  .chart-data {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
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
      font-size: ${FONT_SIZE.TITLE_XL};
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
    cursor: pointer;
  }
`;

const arrowStyle = css`
  cursor: pointer;
`;

const chartDataStyle = css`
  display: flex;
  gap: 8px;

  .pixel-inv {
    width: 14px;
    height: 14px;
    background-color: ${COLOR.PRIMARY200};
  }

  .pixel-tra {
    width: 14px;
    height: 14px;
    background-color: ${COLOR.PRIMARY600};
  }
`;

export default Admin;
