import { css } from '@emotion/react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Chart from '@/components/Chart';
import ProfileImage from '@/components/ProfileImage';
import VerticalCarousel from '@/components/VerticalCarousel';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import { PATH } from '@/constants/path';
import { useGetMainPage, useGetMainPageChart } from '@/hooks/useCommonApi';
import useCountMotion from '@/hooks/useCountMotion';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';
import { formatPercent } from '@/utils/dataUtils';
import getColorStyleBasedOnValue from '@/utils/tableUtils';

const Home = () => {
  const navigate = useNavigate();

  const { data: mainData } = useGetMainPage();
  const { data: mainPageChartData } = useGetMainPageChart();

  const responseData = {
    smScoreTopStrategyName:
      mainPageChartData?.data?.smScoreTopStrategyName || '',
    averageStandardAmount: mainPageChartData?.data?.averageStandardAmount || [],
    accumulatedProfitLossRate:
      mainPageChartData?.data?.accumulatedProfitLossRate || [],
    xaxisAverageStandardAmount:
      mainPageChartData?.data?.xaxisAverageStandardAmount || [],
    xaxisAccumulatedProfitLossRate:
      mainPageChartData?.data?.xaxisAccumulatedProfitLossRate || [],
  };

  const chartData = {
    data1: responseData.xaxisAverageStandardAmount.map(
      (date: number, index: number) => [
        new Date(date).getTime(),
        responseData.averageStandardAmount[index] !== null &&
        responseData.averageStandardAmount[index] !== undefined
          ? Math.round(responseData.averageStandardAmount[index])
          : null,
      ]
    ),
    data2: responseData.xaxisAccumulatedProfitLossRate.map(
      (date: number, index: number) => [
        new Date(date).getTime(),
        responseData.accumulatedProfitLossRate[index] !== null &&
        responseData.accumulatedProfitLossRate[index] !== undefined
          ? Number(responseData.accumulatedProfitLossRate[index].toFixed(2))
          : null,
      ]
    ),
  };

  const animatedValue1 = useCountMotion({
    end: mainData?.data?.totalTraderCount ?? 0,
  });

  const animatedValue2 = useCountMotion({
    end: mainData?.data?.totalStrategyCount ?? 0,
  });

  return (
    <section css={wrapperStyle}>
      <Header />
      <VerticalCarousel>
        <section
          className='slider-section'
          css={css`
            overflow-y: hidden;
            padding: 96px 0;
          `}
        >
          <div css={slideTitleStyle}>
            <h3>투자자이신가요?</h3>
            <h1>가장 인기 있는 트레이더의 전략을 관심등록!</h1>
            <span>
              당신이 관심등록한 투자 전략을 마치 주식 시세를 매일 체크하는
              것처럼,
              <br />
              선택한 투자 전략들의 성과를 매일 새롭게 확인할 수 있습니다.
            </span>
          </div>
          <section css={cardStyle}>
            <h6 className='line-text'>시스메틱 인기 트레이더 랭킹</h6>
            <div className='card-wrapper'>
              {mainData?.data?.rankedTrader.map((trader, index) => (
                <div className='ranking-card' key={trader.id}>
                  <span className='ranking-num'>{index + 1}</span>
                  <div className='ranking-card-top'>
                    <ProfileImage
                      size='lg'
                      alt='트레이더 이미지'
                      src={trader.traderProfileImage}
                    />
                    <span>{trader.nickname}</span>
                  </div>
                  <div className='ranking-card-btm'>
                    <div className='likes-area'>
                      <FavoriteBorderIcon />
                      {trader.followerCount}
                    </div>
                    <div className='price-area'>
                      <h3>{formatPercent(trader.accumProfitLossRate)}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div css={btnStyle}>
            <Button
              label='투자자 가입하기'
              width={160}
              handleClick={() => {
                navigate(PATH.SIGN_UP);
              }}
            />
            <Button
              label='전략목록 보기'
              color='primaryOpacity10'
              border={true}
              width={160}
              handleClick={() => {
                navigate(PATH.STRATEGIES_LIST);
              }}
            />
          </div>
        </section>
        <section
          className='slider-section'
          css={css`
            overflow-y: hidden;
            padding: 96px 0;
          `}
        >
          <div css={slideTitleStyle}>
            <h3>트레이더이신가요?</h3>
            <h1>당신의 투자전략을 공유해보세요!</h1>
            <span>
              시스메틱에서 당신의 투자전략을 공유하고
              <br /> 전문가들의 투자전략 분석과 함께 투자자금 매칭 서비스를
              제공해 드립니다.
            </span>
          </div>
          <section css={cardStyle}>
            <h6 className='line-text'>시스메틱 현황</h6>
            <div className='card-wrapper'>
              <section className='ranking-card'>
                <div className='current-situation'>
                  <span>{animatedValue1}</span>
                  <h5>명</h5>
                </div>
                <h6 className='situation-title'>트레이더 수</h6>
              </section>
              <section className='ranking-card'>
                <div className='current-situation'>
                  <span>{animatedValue2}</span>
                  <h5>개</h5>
                </div>
                <h6 className='situation-title'>투자 전략 공유</h6>
              </section>
            </div>
          </section>
          <div css={btnStyle}>
            <Button
              label='트레이더 가입하기'
              width={160}
              handleClick={() => {
                navigate(PATH.SIGN_UP);
              }}
            />
            <Button
              label='트레이더 목록보기'
              border={true}
              color='primaryOpacity10'
              width={160}
              handleClick={() => {
                navigate(PATH.TRADERS);
              }}
            />
          </div>
        </section>
        <section
          className='slider-section'
          css={css`
            overflow-y: hidden;
            padding: 96px 0;
          `}
        >
          <div className='layout'>
            <div css={slideTitleStyle}>
              <h1>대표전략 평균 지표</h1>
              <span>
                대표전략 평균 지표는 여러 투자 전략의 성과를 종합적으로 나타내는
                지표입니다.
                <br /> 플랫폼에 등록된 여러 트레이더들의 투자 전략 성과를 통합한
                평균을 확인할 수 있습니다.
              </span>
              <Chart
                chartData={chartData}
                name={[
                  'Sysmetic Traders 통합기준가',
                  'SM Score 1위: ETF레버리지/인버스',
                ]}
                unit={['원', '%']}
                type={['area', 'line']}
              />
            </div>
          </div>
        </section>
        <section
          className='slider-section'
          css={css`
            overflow-y: auto;
            padding: 96px 0 0 0;
          `}
        >
          <div css={slideTitleStyle}>
            <h1>SM SCORE 랭킹 TOP 5</h1>
            <span>
              SM Score란 Stock Market의 약자로 현재 시장에서 가장 높은 평가를
              받고 있는 상위 5개 투자 대상을 보여주는 지표입니다.
            </span>
          </div>
          <section css={smScoreCardStyle}>
            {mainData?.data?.smScoreTopFives.map((strategy, index) => (
              <div className='sm-score-card' key={strategy.id}>
                <div className='card-top'>
                  <h5 className='num'>{index + 1}</h5>
                  <div>
                    <ProfileImage
                      size='lg'
                      alt='트레이더 이미지'
                      src={strategy.traderProfileImage}
                    />
                    <span>{strategy.nickname}</span>
                  </div>
                  <h5>{strategy.name}</h5>
                </div>
                <div className='card-btm'>
                  <div className='card-btm-option'>
                    <h6>SM Score</h6>
                    {(() => {
                      const { text, style } = getColorStyleBasedOnValue(
                        strategy.smScore
                      );
                      return <h5 style={style}>{text}</h5>;
                    })()}
                  </div>
                  <div className='card-btm-option'>
                    <h6>누적 손익률</h6>
                    {(() => {
                      const { text, style } = getColorStyleBasedOnValue(
                        strategy.accumulatedProfitLossRate
                      );
                      return <h5 style={style}>{text}</h5>;
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </section>
          <Footer />
        </section>
      </VerticalCarousel>
    </section>
  );
};

const wrapperStyle = css`
  height: 100vh;
  position: relative;
  overflow-y: hidden;

  .slider-section {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;

    &::-webkit-scrollbar {
      display: none;
    }

    .layout {
      max-width: 1200px;
      padding: 0 10px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
  }
`;

const slideTitleStyle = css`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 24px;

  h3 {
    font-weight: ${FONT_WEIGHT.REGULAR};
    color: ${COLOR.PRIMARY};
  }

  span {
    font-size: ${FONT_SIZE.TEXT_MD};
    font-weight: ${FONT_WEIGHT.REGULAR};
    line-height: 160%;
  }
`;

const cardStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
  padding: 38px;
  width: 100%;
  background: ${COLOR_OPACITY.PRIMARY100_OPACITY30};

  .line-text {
    position: relative;
    color: ${COLOR.PRIMARY};
  }

  .line-text::before,
  .line-text::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 1px;
    width: 72px;
    background-color: ${COLOR.PRIMARY};
  }

  .line-text::before {
    margin: 0 -80px;
  }

  .line-text::after {
    margin: 0 8px;
  }

  .card-wrapper {
    max-width: 1200px;
    width: 100%;
    padding: 0 10px;
    display: flex;
    gap: 20px;

    .ranking-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
      border-radius: 20px;
      width: 100%;
      height: 200px;
      padding: 24px;
      border: 1px solid ${COLOR.PRIMARY100};
      background-color: ${COLOR.WHITE};

      .current-situation {
        display: flex;
        align-items: center;
        gap: 8px;

        span {
          color: ${COLOR.PRIMARY};
          font-weight: ${FONT_WEIGHT.BOLD};
          font-size: 6rem;
        }
      }

      .situation-title {
        font-weight: ${FONT_WEIGHT.REGULAR};
        color: ${COLOR.PRIMARY};
      }

      .ranking-num {
        position: absolute;
        top: 24px;
        left: 24px;
        font-size: ${FONT_SIZE.TITLE_SM};
        color: ${COLOR.ERROR_RED};
      }

      .ranking-card-top {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .ranking-card-btm {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .likes-area {
          display: flex;
          align-items: center;
          gap: 8px;
          color: ${COLOR.ERROR_RED};

          svg {
            font-size: ${FONT_SIZE.TITLE_XS};
            color: ${COLOR.ERROR_RED};
          }
        }

        .price-area {
          display: flex;
          align-items: center;
          gap: 8px;

          h6 {
            font-weight: ${FONT_WEIGHT.REGULAR};
          }
        }
      }
    }
  }
`;

const smScoreCardStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 1200px;
  padding: 0 10px;
  grid-template-columns: repeat(3, 1fr);

  .sm-score-card {
    display: flex;
    position: relative;
    flex: 1 1 calc(33.33% - 20px);
    box-sizing: border-box;
    background-color: ${COLOR.WHITE};
    border: 1px solid ${COLOR_OPACITY.POINT_OPACITY30};
    border-radius: 20px;
    overflow: hidden;

    .card-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 32px;

      .num {
        color: ${COLOR.ERROR_RED};
        position: absolute;
        top: 32px;
        left: 32px;
      }

      div {
        display: flex;
        align-items: center;
        gap: 16px;
      }
    }

    .card-btm {
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      gap: 44px;

      .card-btm-option {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h6 {
          font-weight: ${FONT_WEIGHT.REGULAR};
          min-width: 96px;
        }
      }
    }
  }

  .sm-score-card:nth-of-type(4),
  .sm-score-card:nth-of-type(5) {
    flex: 1 1 calc(50% - 20px);
    justify-content: space-between;

    .card-btm-option {
      gap: 64px;
    }

    .card-top {
      padding: 32px 0 32px 64px;
      align-items: flex-start;
    }
  }

  .sm-score-card:nth-of-type(1),
  .sm-score-card:nth-of-type(2),
  .sm-score-card:nth-of-type(3) {
    flex-direction: column;
    justify-content: space-between;

    .card-btm {
      background-color: ${COLOR_OPACITY.POINT100_OPACITY70};
    }
  }
`;

const btnStyle = css`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export default Home;
