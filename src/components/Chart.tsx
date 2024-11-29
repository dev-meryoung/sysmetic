import React, { useState } from 'react';
import { css } from '@emotion/react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import mouseWheelZoom from 'highcharts/modules/mouse-wheel-zoom';
import HighchartsReact from 'highcharts-react-official';
import Button from '@/components/Button';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

mouseWheelZoom(Highcharts);
HighchartsMore(Highcharts);

type ChartTypes = 'line' | 'area';

interface ChartDataProps {
  chartData: {
    data1: [number, number][];
    data2: [number, number][];
  };
  name: string[];
  unit: string[];
  type?: ChartTypes[];
}

const dateFilter = ['1개월', '3개월', '6개월', '1년', 'YTD', 'ALL'];

const Chart: React.FC<ChartDataProps> = ({
  chartData,
  name,
  type = 'line',
  unit,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('ALL');

  const getFilteredData = (
    data: [number, number][],
    selectedPeriod: string
  ): [number, number][] => {
    const today = new Date();
    const filterDate = new Date();

    switch (selectedPeriod) {
      case '1개월':
        filterDate.setMonth(today.getMonth() - 1);
        break;
      case '3개월':
        filterDate.setMonth(today.getMonth() - 3);
        break;
      case '6개월':
        filterDate.setMonth(today.getMonth() - 6);
        break;
      case '1년':
        filterDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'YTD': //올해의 1월 1일을 기준 날짜
        filterDate.setMonth(0);
        filterDate.setDate(1);
        break;
      default:
        return data;
    }

    return data.filter(
      (item): item is [number, number] => item[0] >= filterDate.getTime()
    );
  };

  const filteredData = {
    data1: getFilteredData(chartData.data1, selectedPeriod),
    data2: getFilteredData(chartData.data2, selectedPeriod),
  };

  const options = {
    title: {
      text: '',
    },
    accessibility: {
      enabled: false,
    },
    chart: {
      type: 'line',
      width: null,
      spacingTop: 40,
      zoomType: 'xy',
      zooming: {
        mouseWheel: {
          enabled: true,
        },
      },
      style: {
        fontFamily: 'Pretendard, sans-serif',
      },
    },
    // 화면 크기가 1400px(13인치 노트북) 이하일 경우 높이 500
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 1400,
          },
          chartOptions: {
            chart: {
              height: 500,
            },
          },
        },
      ],
    },
    tooltip: {
      style: {
        fontSize: `${FONT_SIZE.TEXT_MD}`,
        fontWeight: `${FONT_WEIGHT.BOLD}`,
      },
    },
    plotOptions: {
      series: {
        animation: {
          duration: 500,
        },
      },
    },
    legend: {
      align: 'left',
      verticalAlign: 'top',
      itemStyle: {
        fontWeight: `${FONT_WEIGHT.REGULAR}`,
        fontSize: `${FONT_SIZE.TEXT_MD}`,
      },
      margin: 48,
    },
    xAxis: {
      type: 'datetime',
      allowDecimals: false,
      labels: {
        //TODO:현재는 년 단위 표시인데, 추후 월단위로 표시할수도 있음
        format: '{value:%Y}',
      },
      tickInterval: 365 * 24 * 3600 * 1000,
      accessibility: {
        rangeDescription: 'Range: 1940 to 2024.',
      },
    },
    yAxis: [
      {
        pointOnColumn: true,
        labels: {
          style: {
            color: `${COLOR.POINT400}`,
            fontSize: `${FONT_SIZE.TEXT_MD}`,
          },
        },
        title: {
          text: '',
        },
      },
      {
        pointOnColumn: true,
        opposite: true,
        labels: {
          style: {
            color: `${COLOR.PRIMARY}`,
            fontSize: `${FONT_SIZE.TEXT_MD}`,
          },
        },
        title: {
          text: '',
        },
      },
    ],
    series: [
      {
        name: name[0],
        type: type[0],
        data: filteredData.data1,
        yAxis: 0, // 첫 번째 Y축 사용
        color:
          type === 'line'
            ? `${COLOR.POINT400}`
            : {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 1,
                  y2: 1,
                },
                stops: [
                  [0, `${COLOR.POINT}`],
                  [1, `${COLOR.WHITE}`],
                ],
              },
        lineColor: type === 'line' ? '' : `${COLOR.POINT400}`,
        marker: {
          enabled: false,
        },
        tooltip: {
          valueSuffix: unit[0],
        },
      },
      {
        name: name[1],
        type: type[1],
        data: filteredData.data2,
        yAxis: 1, // 두 번째 Y축 사용
        color:
          type === 'line'
            ? `${COLOR.PRIMARY}`
            : {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 1,
                  y2: 1,
                },
                stops: [
                  [0, `${COLOR.PRIMARY}`],
                  [1, `${COLOR.WHITE}`],
                ],
              },
        lineColor: type === 'line' ? '' : `${COLOR.PRIMARY}`,
        marker: {
          enabled: false,
        },
        tooltip: {
          valueSuffix: unit[1],
        },
      },
    ],
  };

  return (
    <div css={chartWrapperStyle}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { width: '100%', height: 'auto' } }}
      />
      <section css={buttonWrapperStyle}>
        {dateFilter.map((period) => (
          <Button
            label={period}
            key={period}
            size='sm'
            shape='round'
            color={selectedPeriod === period ? 'primary' : 'transparent'}
            handleClick={() => setSelectedPeriod(period)}
          />
        ))}
      </section>
    </div>
  );
};

const chartWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  min-width: 100%;
  width: 100%;
`;

const buttonWrapperStyle = css`
  display: flex;
  gap: 8px;

  button {
    width: 80px;
  }
`;

export default Chart;
