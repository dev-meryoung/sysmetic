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
    data1: [string, number][];
    data2: [string, number][];
  };
  name: string[];
  unit: string[];
  type?: ChartTypes[];
}

const Chart: React.FC<ChartDataProps> = ({
  chartData,
  name,
  type = 'line',
  unit,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const dateFilter = ['1개월', '3개월', '6개월', '1년', 'ALL'];

  const getFilteredData = (
    data: [string, number][],
    selectedPeriod: string
  ): [string, number][] => {
    if (selectedPeriod === 'ALL') return data;

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
    }

    return data.filter(([dateStr]) => new Date(dateStr) >= filterDate);
  };

  const filteredData = {
    data1: getFilteredData(chartData.data1, selectedFilter),
    data2: getFilteredData(chartData.data2, selectedFilter),
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
      title: {
        text: '',
      },
      labels: {
        format: '{value:%Y-%m-%d}',
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
        yAxis: 0,
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
        yAxis: 1,
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
        {dateFilter.map((filter) => (
          <Button
            label={filter}
            key={filter}
            size='sm'
            shape={selectedFilter === filter ? 'round' : 'none'}
            handleClick={() => setSelectedFilter(filter)}
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
