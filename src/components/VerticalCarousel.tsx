import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import IconButton from '@/components/IconButton';
import ToTopButton from '@/components/ToTopButton';
import { COLOR } from '@/constants/color';

interface VerticalCarouselProps {
  children: React.ReactNode;
}

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({ children }) => {
  const totalSlides = React.Children.count(children);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const scrollPosition = carouselRef.current.scrollTop;
        const slideHeight = carouselRef.current.clientHeight;
        const newSlide = Math.round(scrollPosition / slideHeight);
        setCurrentSlide(newSlide);
      }
    };

    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const slideHeight = carouselRef.current.clientHeight;
      carouselRef.current.scrollTo({
        top: slideHeight * index,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div css={carouselWrapperStyle}>
      <div className='carousel' ref={carouselRef}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className='carousel-slide'>
            {child}
          </div>
        ))}
      </div>
      <div className='carousel-indicators'>
        {React.Children.map(children, (_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => scrollToSlide(index)}
          />
        ))}
      </div>
      {currentSlide !== 0 && (
        <ToTopButton handleClick={() => scrollToSlide(0)} />
      )}
      {currentSlide < totalSlides - 1 && (
        <IconButton
          IconComponent={ArrowBackIosNewOutlinedIcon}
          iconBgSize='lg'
          iconSize='lg'
          color='gray'
          shape='none'
          handleClick={() => {
            scrollToSlide(currentSlide + 1);
          }}
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%) rotate(-90deg)',
          }}
        />
      )}
    </div>
  );
};

const headerHeight = '144px';

const carouselWrapperStyle = css`
  position: relative;
  overflow: hidden;
  height: calc(100% - ${headerHeight});

  .carousel {
    height: 100%;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;

    .carousel-slide {
      height: 100%;
      width: 100%;
      scroll-snap-align: start;
      scroll-snap-stop: always;
    }
  }

  .carousel::-webkit-scrollbar {
    display: none;
  }

  .carousel-indicators {
    position: fixed;
    display: flex;
    flex-direction: column;
    right: calc(50% - 566px);
    top: 50%;
    transform: translate(-50%);
    gap: 32px;

    .carousel-indicator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: ${COLOR.GRAY400};
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .carousel-indicator.active {
      background-color: ${COLOR.PRIMARY};
    }
  }
`;

export default VerticalCarousel;
