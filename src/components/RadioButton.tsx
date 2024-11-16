import { css } from '@emotion/react';
import { COLOR, COLOR_OPACITY } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

interface RadioOptionProps {
  label: string;
  value: string;
}

interface RadioBtnProps {
  options: RadioOptionProps[];
  name: string;
  selected: string;
  onChange: (value: string) => void;
}

const RadioButton: React.FC<RadioBtnProps> = ({
  options,
  name,
  selected,
  onChange,
}) => (
  <div css={radioWrapperStyle}>
    {options.map((option) => (
      <label key={option.value} css={labelStyle}>
        <div>
          <input
            type='radio'
            name={name}
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
          />
        </div>
        {option.label}
      </label>
    ))}
  </div>
);

const radioWrapperStyle = css`
  display: flex;
  gap: 16px;
`;

const labelStyle = css`
  display: flex;
  align-items: center;
  font-size: ${FONT_SIZE.TEXT_MD};
  font-weight: ${FONT_WEIGHT.REGULAR};
  letter-spacing: -0.32px;
  cursor: pointer;

  div {
    border-radius: 50%;
    &:hover {
      background-color: ${COLOR_OPACITY.PRIMARY_OPACITY10};
      transition: 0.3s;
    }
  }

  input[type='radio'] {
    width: 20px;
    height: 20px;
    margin: 10px;
    accent-color: ${COLOR.PRIMARY};
    cursor: pointer;
  }
`;

export default RadioButton;
