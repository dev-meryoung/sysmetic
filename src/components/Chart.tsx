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
    chart: {
      type: 'line',
      spacingTop: 40,
      zoomType: 'xy',
      zooming: {
        mouseWheel: {
          enabled: true,
        },
      },
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
    series: [
      {
        name: name[0],
        type: type[0],
        data: filteredData.data1,
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
      <HighchartsReact highcharts={Highcharts} options={options} />
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

  [data-highcharts-chart='0'] {
    width: 100%;
    min-height: 500px;
  }

  [data-highcharts-chart='1'] {
    width: 100%;
    min-height: 500px;
  }

  [data-highcharts-chart='2'] {
    width: 100%;
    min-height: 500px;
  }
`;

const buttonWrapperStyle = css`
  display: flex;
  gap: 8px;

  button {
    width: 80px;
  }
`;

export default Chart;
