import { css } from '@emotion/react';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

type TextAreaTypes = 'default' | 'transparent';

interface TextAreaProps {
  placeholder?: string;
  value: string;
  maxLength?: number;
  color?: TextAreaTypes;
  fullWidth?: boolean;
  fullHeight?: boolean;
  width?: number;
  height?: number;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  value,
  maxLength = 500,
  color = 'default',
  fullWidth = false,
  fullHeight = false,
  width = 700,
  height = 240,
  handleChange,
}) => (
  <textarea
    css={textAreaStyle(color, fullWidth, fullHeight, width, height)}
    placeholder={placeholder}
    value={value}
    maxLength={maxLength}
    onChange={handleChange}
  />
);

const textAreaStyle = (
  color: TextAreaTypes,
  fullWidth: boolean,
  fullHeight: boolean,
  width: number,
  height: number
) => css`
  width: ${fullWidth ? '100%' : width ? `${width}px` : 'auto'};
  height: ${fullHeight ? '100%' : height ? `${height}px` : 'auto'};
  padding: 16px;
  resize: none;

  font-size: ${FONT_SIZE.TEXT_SM};
  font-weight: ${FONT_WEIGHT.REGULAR};
  font-family: inherit;
  letter-spacing: -0.28px;
  line-height: 100%;

  border: 1px solid
    ${color === 'transparent' ? 'transparent' : COLOR_OPACITY.BLACK_OPACITY30};
  border-radius: 4px;
  background-color: ${COLOR.WHITE};

  &::placeholder {
    color: ${COLOR_OPACITY.BLACK_OPACITY30};
  }
`;

export default TextArea;
