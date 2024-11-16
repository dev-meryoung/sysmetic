// API 통신 과정에서 사용되는 날짜 String 포맷에서 연/월/일, 시/분/초 데이터를 파싱하는 함수
export const parseDateTime = (strDate: string) => {
  const [datePart, timePart] = strDate.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour = '00', minute = '00', second = '00'] = timePart
    ? timePart.split(':')
    : ['00', '00', '00'];

  return {
    year: year || 0,
    month: month || 0,
    day: day || 0,
    hour,
    minute,
    second,
  };
};
