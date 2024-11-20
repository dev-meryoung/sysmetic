import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import NorthIcon from '@mui/icons-material/North';
import IconButton from '@/components/IconButton';

interface ToTopButtonProps {
  handleClick?: () => void;
}

const ToTopButton: React.FC<ToTopButtonProps> = ({ handleClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (!handleClick) {
      setIsVisible(window.scrollY > 300);
    }
  };

  const handleToTop = () => {
    if (handleClick) {
      handleClick();
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (!handleClick) {
      window.addEventListener('scroll', toggleVisibility);
      toggleVisibility();
    } else {
      setIsVisible(true);
    }

    return () => {
      if (!handleClick) {
        window.removeEventListener('scroll', toggleVisibility);
      }
    };
  }, [handleClick, toggleVisibility]);

  if (!isVisible) return null;

  return (
    <div css={toTopButtonStyle}>
      <IconButton
        IconComponent={NorthIcon}
        color='primary'
        iconBgSize='lg'
        handleClick={handleToTop}
      />
    </div>
  );
};

const toTopButtonStyle = css`
  position: fixed;
  bottom: 48px;
  right: 48px;
`;

export default ToTopButton;
