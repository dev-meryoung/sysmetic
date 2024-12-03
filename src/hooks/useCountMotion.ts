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

      const currentValue = Math.round(start + (end - start) * easedProgress);

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
  }, [end, duration, start, easing, delay]);

  useEffect(() => {
    animate();
  }, [animate]);

  return count;
};

export default useCountMotion;
