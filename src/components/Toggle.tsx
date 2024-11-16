import { css } from '@emotion/react';
import { COLOR, COLOR_OPACITY } from '@/constants/color';

interface ToggleProps {
  checked: boolean;
  handleChange: (value: boolean) => void;
  disabled?: boolean;
  color?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  handleChange,
  disabled = false,
}) => (
  <div
    css={toggleWrapperStyle(disabled)}
    onClick={() => !disabled && handleChange(!checked)}
  >
    <div css={switchStyle(checked, disabled)} className="switch">
      <div css={toggleStyle(checked)} className="thumb" />
    </div>
  </div>
);

const toggleWrapperStyle = (disabled: boolean) => css`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    ${!disabled &&
    css`
      .switch {
        border-color: ${COLOR.PRIMARY600};
      }
      .thumb {
        background-color: ${COLOR.PRIMARY600};
      }
    `}
  }
`;

const switchStyle = (checked: boolean, disabled: boolean) => css`
  width: 36px;
  height: 20px;
  border-radius: 20px;
  border: 3px solid ${checked ? COLOR.PRIMARY : COLOR.GRAY400};
  background-color: transparent;
  position: relative;
  transition: border-color 0.3s ease, opacity 0.3s ease;
  opacity: ${disabled ? 0.5 : 1};
  pointer-events: ${disabled ? 'none' : 'auto'};
`;

const toggleStyle = (checked: boolean) => css`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: ${checked ? COLOR.PRIMARY : COLOR.GRAY400};
  position: absolute;
  top: 50%;
  left: ${checked ? 'calc(100% - 12px)' : '4px'};
  transform: translateY(-50%);
  transition: left 0.3s ease, background-color 0.3s ease;

  &:hover::after {
    content: '';
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${COLOR_OPACITY.PRIMARY_OPACITY10};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: background-color 0.3s ease;
  }
`;

export default Toggle;
