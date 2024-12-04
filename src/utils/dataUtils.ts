// 금액과 관련된 숫자 데이터의 포맷팅을 처리하는 함수
export const formatCurrency = (value: number) =>
  `${Math.floor(value).toLocaleString()} 원`;

// 퍼센트와 관련된 숫자 데이터의 포맷팅을 처리하는 함수
export const formatPercent = (value: number) => `${value.toFixed(2)}%`;

// 날짜와 관련된 문자 데이터의 포맷팅을 처리하는 함수
export const formatDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${year}. ${month}. ${day}.`;
};

// 날짜(연월)과 관련된 문자 데이터의 포맷팅을 처리하는 함수
export const formatYearMonth = (date: string) => {
  const [year, month] = date.split('-');
  return `${year}. ${month}.`;
};
