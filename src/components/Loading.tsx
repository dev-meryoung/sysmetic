import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { COLOR } from '@/constants/color';

// 애니메이션 타이밍 설정 (밀리초 단위)
const ANIMATION_INTERVAL = 50;
const PAUSE_DURATION = 800;

// 바 채우기 단계별 수치 (퍼센트 단위)
const FILL_LEVELS = {
  MAX: 100,
  MIN: 0,
  TRIGGER_NEXT: 66,
  TRIGGER_PREV: 33,
  INCREMENT: 25,
  NEXT_BAR_INITIAL: 30,
  PREV_BAR_MIN: 70,
};

// 각 바의 높이 (픽셀 단위, 왼쪽부터 오른쪽으로 커지는 순서)
const BAR_HEIGHTS = [16, 20, 24, 28, 34];

const Loading = () => {
  const [fillLevels, setFillLevels] = useState(
    Array(BAR_HEIGHTS.length).fill(FILL_LEVELS.MIN)
  );
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
          // 정방향 애니메이션 시작: 왼쪽에서 오른쪽으로 바를 채워나감
          newLevels[activeBar] = Math.min(
            FILL_LEVELS.MAX,
            newLevels[activeBar] + FILL_LEVELS.INCREMENT
          );

          if (!isLastBar && newLevels[activeBar] >= FILL_LEVELS.TRIGGER_NEXT) {
            newLevels[activeBar + 1] = Math.min(
              FILL_LEVELS.NEXT_BAR_INITIAL,
              newLevels[activeBar + 1] + FILL_LEVELS.INCREMENT
            );
          }
        } else {
          // 역방향 애니메이션 시작: 오른쪽에서 왼쪽으로 바를 비워나감
          newLevels[activeBar] = Math.max(
            FILL_LEVELS.MIN,
            newLevels[activeBar] - FILL_LEVELS.INCREMENT
          );

          // 현재 바가 일정 수준 이하로 비워지면 이전 바 감소 시작
          if (
            !isCompleting &&
            activeBar > 0 &&
            newLevels[activeBar] <= FILL_LEVELS.TRIGGER_PREV
          ) {
            newLevels[activeBar - 1] = Math.max(
              FILL_LEVELS.PREV_BAR_MIN,
              newLevels[activeBar - 1] - FILL_LEVELS.INCREMENT
            );
          }
        }

        return newLevels;
      });

      if (!reverse) {
        const isLastBar = activeBar === fillLevels.length - 1;
        const shouldChangeBar = isLastBar
          ? fillLevels[activeBar] >= FILL_LEVELS.MAX
          : fillLevels[activeBar] >= FILL_LEVELS.TRIGGER_NEXT;

        if (shouldChangeBar) {
          if (isLastBar && fillLevels[activeBar] >= FILL_LEVELS.MAX) {
            // 마지막 바가 가득 차면 잠시 대기 후 역방향 시작
            setIsWaiting(true);
            setTimeout(() => {
              setIsWaiting(false);
              setReverse(true);
              setIsCompleting(true);
            }, PAUSE_DURATION);
          } else if (!isLastBar) {
            setActiveBar((prev) => prev + 1);
          }
        }
      } else if (reverse && fillLevels[activeBar] <= FILL_LEVELS.TRIGGER_PREV) {
        if (activeBar === 0) {
          if (isCompleting) {
            if (fillLevels[fillLevels.length - 1] <= FILL_LEVELS.MIN) {
              setIsCompleting(false);
              setReverse(false);
              setActiveBar(0);
              setIsStarting(true);
              setTimeout(() => {
                setIsStarting(false);
              }, PAUSE_DURATION);
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
    }, ANIMATION_INTERVAL);

    return () => clearInterval(interval);
  }, [fillLevels, activeBar, reverse, isWaiting, isCompleting, isStarting]);

  return (
    <div css={loadingStyle}>
      {BAR_HEIGHTS.map((height, index) => (
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
