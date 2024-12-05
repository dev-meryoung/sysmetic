import { useState, useEffect, useCallback } from 'react';

interface UseCountMotionProps {
  end: number;
  duration?: number;
  start?: number;
  easing?: 'linear' | 'easeOut';
  delay?: number;
}

const useCountMotion = ({
  end,
  duration = 3000,
  start = 0,
  easing = 'linear',
  delay = 0,
}: UseCountMotionProps) => {
  const [count, setCount] = useState(start);

  const getDecimalPlaces = (num: number | undefined): number => {
    if (num === undefined || num === null) return 0;
    if (Math.floor(num) === num) return 0;
    const decimalStr = num.toString().split('.')[1];
    return decimalStr ? decimalStr.length : 0;
  };

  const decimalPlaces = Math.max(
    getDecimalPlaces(start),
    getDecimalPlaces(end)
  );

  const animate = useCallback(() => {
    const easingFunctions = {
      linear: (t: number) => t,
      easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    };

    const startTime = Date.now();

    const updateCount = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easingFunctions[easing](progress);

      let currentValue = start + (end - start) * easedProgress;

      if (decimalPlaces === 0) {
        currentValue = Math.round(currentValue);
      } else if (decimalPlaces === 1) {
        currentValue = parseFloat(currentValue.toFixed(1));
      } else if (decimalPlaces === 2) {
        currentValue = parseFloat(currentValue.toFixed(2));
      }

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    setTimeout(() => {
      requestAnimationFrame(updateCount);
    }, delay);
  }, [end, duration, start, easing, delay, decimalPlaces]);

  useEffect(() => {
    animate();
  }, [animate]);

  return count;
};

export default useCountMotion;
