import { COLOR } from '@/constants/color';

export const getColorStyleBasedOnValue = (value: number | string) => {
  const result = {
    text: '-',
    style: {},
  };

  if (typeof value !== 'number') {
    return result;
  }

  const formatted = value.toFixed(2);
  result.text = formatted.endsWith('0')
    ? `${parseFloat(formatted)}%`
    : `${formatted}%`;

  if (value >= 0) {
    result.style = { color: COLOR.POINT };
  } else {
    result.style = { color: COLOR.PRIMARY };
  }

  return result;
};

export default getColorStyleBasedOnValue;
