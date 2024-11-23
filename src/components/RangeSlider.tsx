import React, { useState, useEffect, useCallback, useRef } from 'react';
import { css } from '@emotion/react';
import { COLOR } from '@/constants/color';
import { FONT_SIZE } from '@/constants/font';

interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValues?: [number, number];
  handleChange?: (values: [number, number]) => void;
}

const RangeSlider = ({
  min = 0,
  max = 100,
  step = 10,
  defaultValues = [min, max],
  handleChange,
}: RangeSliderProps) => {
  const [values, setValues] = useState<[number, number]>(defaultValues);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValues(defaultValues);
  }, [defaultValues]);

  const getPercentage = (value: number) => ((value - min) / (max - min)) * 100;

  const getValueFromPosition = (position: number) => {
    const percentage = position / (sliderRef.current?.clientWidth || 1);
    const value = percentage * (max - min) + min;
    return Math.round(value / step) * step;
  };

  const handleMouseDown = (event: React.MouseEvent, type: 'min' | 'max') => {
    setIsDragging(type);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const sliderRect = sliderRef.current.getBoundingClientRect();
      const position = Math.max(
        0,
        Math.min(event.clientX - sliderRect.left, sliderRect.width)
      );
      const newValue = getValueFromPosition(position);

      setValues((prevValues) => {
        let newValues: [number, number];
        if (isDragging === 'min') {
          newValues = [
            Math.max(min, Math.min(newValue, prevValues[1] - step)),
            prevValues[1],
          ];
        } else {
          newValues = [
            prevValues[0],
            Math.min(max, Math.max(newValue, prevValues[0] + step)),
          ];
        }
        handleChange?.(newValues);
        return newValues;
      });
    },
    [isDragging, step, min, max, handleChange]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const generateTicks = useCallback(() => {
    const ticks = [];
    for (let i = min; i <= max; i += step) {
      ticks.push(i);
    }
    return ticks;
  }, [min, max, step]);

  const Thumb = ({
    position,
    value,
    type,
  }: {
    position: number;
    value: number;
    type: 'min' | 'max';
  }) => (
    <div
      css={thumbStyle}
      style={{
        left: `${position}%`,
      }}
      onMouseDown={(e) => handleMouseDown(e, type)}
    >
      <div css={innerThumbStyle} />
      <div css={tooltipStyle}>{value}%</div>
    </div>
  );

  return (
    <div css={sliderContainerStyle} ref={sliderRef}>
      <div css={rangeInputGroupStyle}>
        <Thumb
          position={getPercentage(values[0])}
          value={values[0]}
          type='min'
        />
        <Thumb
          position={getPercentage(values[1])}
          value={values[1]}
          type='max'
        />
      </div>

      <div css={sliderTrackStyle}>
        <div
          css={sliderRangeStyle}
          style={{
            left: `${getPercentage(values[0])}%`,
            width: `${getPercentage(values[1]) - getPercentage(values[0])}%`,
          }}
        />
        <div css={dotsContainerStyle}>
          {generateTicks().map((tick) => (
            <div
              key={tick}
              css={dotStyle}
              style={{
                left: `${getPercentage(tick)}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const sliderContainerStyle = css`
  position: relative;
  display: flex;
  align-items: center;
  width: 376px;
`;

const rangeInputGroupStyle = css`
  position: relative;
  width: 100%;
  height: 16px;
  margin-top: 2px;
`;

const thumbStyle = css`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: ${COLOR.PRIMARY};
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
`;

const innerThumbStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: ${COLOR.WHITE};
  border-radius: 50%;
  transform: translate(-50%, -50%);
`;

const sliderTrackStyle = css`
  position: absolute;
  width: 100%;
  height: 8px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 4px;
  background: ${COLOR.GRAY300};
`;

const dotsContainerStyle = css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
`;

const dotStyle = css`
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${COLOR.WHITE};
  border-radius: 50%;
  z-index: 8;
  top: 50%;
  transform: translate(-50%, -50%);

  &:nth-of-type(1) {
    width: 16px;
    height: 16px;
    background: ${COLOR.GRAY300};
  }

  &:nth-last-of-type(1) {
    width: 16px;
    height: 16px;
    background: ${COLOR.GRAY300};
  }
`;

const sliderRangeStyle = css`
  position: absolute;
  height: 100%;
  background: ${COLOR.PRIMARY};
  border-radius: 4px;
  z-index: 1;
`;

const tooltipStyle = css`
  position: absolute;
  background: ${COLOR.BLACK};
  color: ${COLOR.WHITE};
  padding: 4px 8px;
  border-radius: 50px;
  font-size: ${FONT_SIZE.TEXT_XS};
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  transition: opacity 0.2s ease;
`;

export default RangeSlider;
