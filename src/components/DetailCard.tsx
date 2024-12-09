import { css } from '@emotion/react';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';
import useCountMotion from '@/hooks/useCountMotion';

interface DetailCardProps {
  title: string;
  value: number;
  type?: 'DEFAULT' | 'RATIO';
}

const DetailCard: React.FC<DetailCardProps> = ({
  title,
  value = 0,
  type = 'DEFAULT',
}) => {
  const motionValue = useCountMotion({
    end: value,
    duration: 2000,
    easing: 'easeOut',
  });

  const getColor = (value: number, type: 'DEFAULT' | 'RATIO'): string => {
    if (type === 'RATIO') {
      return 'GREEN';
    }
    if (value > 0) {
      return 'RED';
    }
    if (value < 0) {
      return 'BLUE';
    }
    return 'GREEN';
  };

  const valueLength = parseFloat(value.toFixed(2)).toString().length;
  const TagSize = valueLength > 6 ? 'h3' : valueLength > 5 ? 'h2' : 'h1';
  const RenderTag = TagSize as keyof JSX.IntrinsicElements;

  return (
    <div css={detailCardStyle(getColor(value, type))}>
      <span className='title'>{title}</span>
      <div className='value'>
        {type === 'DEFAULT' ? (
          <>
            <RenderTag>{parseFloat(motionValue.toFixed(2))}</RenderTag>
            <span>%</span>
          </>
        ) : (
          <RenderTag>{`${parseFloat(motionValue.toFixed(2))}:1`}</RenderTag>
        )}
      </div>
    </div>
  );
};

const detailCardStyle = (color: string) => css`
  width: 220px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  border: 1px solid
    ${color === 'RED'
      ? COLOR_OPACITY.CARD_RED_OPACITY30
      : color === 'BLUE'
        ? COLOR.CARD_BLUE_BORDER
        : COLOR_OPACITY.CARD_GREEN_OPACITY30};
  background-color: ${color === 'RED'
    ? COLOR_OPACITY.CARD_RED_OPACITY20
    : color === 'BLUE'
      ? COLOR.CARD_BLUE
      : COLOR_OPACITY.CARD_GREEN_OPACITY10};
  border-radius: 4px;

  .title {
    font-size: ${FONT_SIZE.TITLE_XS};
    font-weight: ${FONT_WEIGHT.MEDIUM};
    letter-spacing: -2%;
  }

  .value {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;

    span {
      font-weight: ${FONT_WEIGHT.BOLD};
      padding-bottom: 4px;
    }
  }
`;

export default DetailCard;
