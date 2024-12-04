import { COLOR } from '@/constants/color';

const getColorStyleBasedOnValue = (value: number | string) => {
  let colorStyle = {};

  if (typeof value === 'number') {
    if (value > 0) {
      colorStyle = { color: COLOR.POINT };
    } else if (value < 0) {
      colorStyle = { color: COLOR.PRIMARY };
    }
  }

  return colorStyle;
};

export default getColorStyleBasedOnValue;
