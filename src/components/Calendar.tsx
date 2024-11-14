import { css } from '@emotion/react';
import { CalendarTodayOutlined } from '@mui/icons-material';
import { COLOR } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';

type CalendarActionTypes = 'date' | 'month' | 'periodDate' | 'periodMonth';

interface CalendarProps {
  type: CalendarActionTypes;
  dateProps?: {
    date: string;
    setDate: React.Dispatch<React.SetStateAction<string>>;
  };
  periodProps?: {
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
  };
}

const Calendar: React.FC<CalendarProps> = ({
  type,
  dateProps,
  periodProps,
}) => {
  const handleDateChange = (value: string) => {
    if (dateProps && dateProps.setDate) {
      dateProps.setDate(value);
    }
  };

  const handleStartDateChange = (value: string) => {
    if (periodProps) {
      const { endDate, setStartDate } = periodProps;
      if (endDate) {
        const start = new Date(value);
        const end = new Date(endDate);
        if (start > end) {
          // Modal 컴포넌트 구현 후 수정 예정
          alert('시작 날짜는 종료 날짜보다 이전이어야 합니다.');
          return;
        }
      }
      setStartDate(value);
    }
  };

  const handleEndDateChange = (value: string) => {
    if (periodProps) {
      const { startDate, setEndDate } = periodProps;
      if (startDate) {
        const start = new Date(startDate);
        const end = new Date(value);
        if (end < start) {
          // Modal 컴포넌트 구현 후 수정 예정
          alert('종료 날짜는 시작 날짜보다 이후여야 합니다.');
          return;
        }
      }
      setEndDate(value);
    }
  };

  const renderSingleInput = (inputType: string) => (
    <div css={calendarWrapperStyle}>
      <input
        css={calendarStyle}
        type={inputType}
        value={dateProps?.date || ''}
        onChange={(e) => handleDateChange(e.target.value)}
      />
      <CalendarTodayOutlined css={calendarIconStyle} />
    </div>
  );

  const renderPeriodInput = (inputType: string) => (
    <div css={periodWrapperStyle}>
      <div css={calendarWrapperStyle}>
        <input
          css={calendarStyle}
          type={inputType}
          value={periodProps?.startDate || ''}
          onChange={(e) => handleStartDateChange(e.target.value)}
        />
        <CalendarTodayOutlined css={calendarIconStyle} />
      </div>
      <span css={hyphenStyle}>~</span>
      <div css={calendarWrapperStyle}>
        <input
          css={calendarStyle}
          type={inputType}
          value={periodProps?.endDate || ''}
          onChange={(e) => handleEndDateChange(e.target.value)}
        />
        <CalendarTodayOutlined css={calendarIconStyle} />
      </div>
    </div>
  );

  switch (type) {
    case 'date':
      return renderSingleInput('date');
    case 'month':
      return renderSingleInput('month');
    case 'periodDate':
      return renderPeriodInput('date');
    case 'periodMonth':
      return renderPeriodInput('month');
    default:
      return null;
  }
};

const periodWrapperStyle = css`
  display: flex;
  align-items: center;
`;

const calendarWrapperStyle = css`
  position: relative;
  width: 146px;
  height: 48px;
  border: 1px solid ${COLOR.GRAY};
  border-radius: 4px;
  overflow: hidden;
`;

const calendarStyle = css`
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px 16px 16px 8px;
  border: none;
  font-family: 'Pretendard Variable';
  font-size: ${FONT_SIZE.TEXT_SM};

  ::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    height: auto;
    color: transparent;
    background: transparent;
  }
`;

const calendarIconStyle = css`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translate(0, -50%);
  pointer-events: none;
`;

const hyphenStyle = css`
  margin: 0 8px;
  font-family: 'Pretendard Variable';
  font-size: ${FONT_SIZE.TEXT_SM};
`;

export default Calendar;
