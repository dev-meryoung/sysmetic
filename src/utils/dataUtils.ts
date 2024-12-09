// 금액과 관련된 숫자 데이터의 포맷팅을 처리하는 함수
export const formatCurrency = (value: number) =>
  `${Math.floor(value).toLocaleString()} 원`;

// 금액과 관련된 숫자 데이터의 포맷팅을 처리하는 함수
export const formatCurrencyNoneSpace = (value: number) =>
  `${Math.floor(value).toLocaleString()}원`;

// 퍼센트와 관련된 숫자 데이터의 포맷팅을 처리하는 함수
export const formatPercent = (value: number) => {
  if (!value) return '-';

  const formatted = value.toFixed(2);
  return formatted.endsWith('0')
    ? `${parseFloat(formatted)}%`
    : `${formatted}%`;
};

// 날짜와 관련된 문자 데이터의 포맷팅을 처리하는 함수
export const formatDate = (date: string) => {
  if (!date) return '-';

  const [year, month, day] = date.split('-');
  return `${year}. ${month}. ${day}.`;
};

// 날짜(연월)과 관련된 문자 데이터의 포맷팅을 처리하는 함수
export const formatYearMonth = (date: string) => {
  const [year, month] = date.split('-');
  return `${year}. ${month}.`;
};

// 'T' 뒤 제거해주는 날짜 함수
export const extractDate = (dateTime: string) => dateTime?.split('T')[0];

// 'T' 뒤 제거 후 'YYYY. MM.' 형식으로 포맷
export const formatYearMonthFromDateTime = (dateTime: string) => {
  const date = extractDate(dateTime);
  return formatDate(date);
};
