import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { COLOR } from '@/constants/color';

const Loading = () => {
  const [fillLevels, setFillLevels] = useState([0, 0, 0, 0, 0]);
  const [activeBar, setActiveBar] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isWaiting || isStarting) return;

      setFillLevels((prev) => {
        const newLevels = [...prev];
        const isLastBar = activeBar === newLevels.length - 1;

        if (!reverse) {
          newLevels[activeBar] = Math.min(100, newLevels[activeBar] + 25);
          if (!isLastBar && newLevels[activeBar] >= 66) {
            newLevels[activeBar + 1] = Math.min(
              30,
              newLevels[activeBar + 1] + 25
            );
          }
        } else {
          newLevels[activeBar] = Math.max(0, newLevels[activeBar] - 25);
          if (!isCompleting && activeBar > 0 && newLevels[activeBar] <= 33) {
            newLevels[activeBar - 1] = Math.max(
              70,
              newLevels[activeBar - 1] - 25
            );
          }
        }
        return newLevels;
      });

      if (!reverse) {
        const isLastBar = activeBar === fillLevels.length - 1;
        const shouldChangeBar = isLastBar
          ? fillLevels[activeBar] >= 100
          : fillLevels[activeBar] >= 66;

        if (shouldChangeBar) {
          if (isLastBar && fillLevels[activeBar] >= 100) {
            setIsWaiting(true);
            setTimeout(() => {
              setIsWaiting(false);
              setReverse(true);
              setIsCompleting(true);
            }, 800);
          } else if (!isLastBar) {
            setActiveBar((prev) => prev + 1);
          }
        }
      } else if (reverse && fillLevels[activeBar] <= 33) {
        if (activeBar === 0) {
          if (isCompleting) {
            if (fillLevels[fillLevels.length - 1] <= 0) {
              setIsCompleting(false);
              setReverse(false);
              setActiveBar(0);
              setIsStarting(true);
              setTimeout(() => {
                setIsStarting(false);
              }, 800);
            } else {
              setActiveBar(fillLevels.length - 1);
            }
          } else {
            setReverse(false);
          }
        } else {
          setActiveBar((prev) => prev - 1);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [fillLevels, activeBar, reverse, isWaiting, isCompleting, isStarting]);

  return (
    <div css={loadingStyle}>
      {[16, 20, 24, 28, 34].map((height, index) => (
        <div
          key={index}
          css={barWrapperStyle}
          style={{ height: `${height}px` }}
        >
          <div
            css={barFillStyle}
            style={{
              height: `${fillLevels[index]}%`,
              opacity: fillLevels[index] ? '1' : '0.7',
              transform: `scale(${fillLevels[index] ? '1' : '0.95'})`,
              transition: `all ${
                (isWaiting && index === fillLevels.length - 1) ||
                (isStarting && index === 0)
                  ? '0'
                  : '200ms'
              } ease-out`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

const loadingStyle = css`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: auto;
  height: auto;
`;

const barWrapperStyle = css`
  position: relative;
  width: 8px;
  margin: 0 3px;
  overflow: hidden;
  background-color: ${COLOR.GRAY300};
`;

const barFillStyle = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${COLOR.PRIMARY};
`;

export default Loading;
