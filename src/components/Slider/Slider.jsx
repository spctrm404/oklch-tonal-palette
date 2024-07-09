import { useRef, useEffect, useCallback } from 'react';
import './Slider.scss';

const Slider = ({ value, min, max, step, vertical = false, onChange }) => {
  const sliderRef = useRef(null);
  const handleRef = useRef(null);

  const handleMouseDown = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      const handleMouseMove = (event) => {
        const slider = sliderRef.current;
        const rect = slider.getBoundingClientRect();
        let newValue;

        if (vertical) {
          const offsetY = event.clientY - rect.top;
          const sliderHeight = rect.height;
          const percentage = Math.max(0, Math.min(offsetY / sliderHeight, 1));
          newValue = min + (max - min) * (1 - percentage);
        } else {
          const offsetX = event.clientX - rect.left;
          const sliderWidth = rect.width;
          const percentage = Math.max(0, Math.min(offsetX / sliderWidth, 1));
          newValue = min + (max - min) * percentage;
        }

        const steppedValue = Math.round(newValue / step) * step;
        onChange(steppedValue);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [min, max, step, vertical, onChange]
  );

  useEffect(() => {
    const handle = handleRef.current;
    handle.addEventListener('mousedown', handleMouseDown);

    return () => {
      handle.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleMouseDown]);

  const handleSize = 20; // Thumb의 크기 (가로와 세로가 동일하다고 가정)
  const handleOffset = handleSize / 2; // Thumb의 크기의 절반
  const handleStyle = vertical
    ? {
        bottom: `calc(${
          ((value - min) / (max - min)) * 100
        }% - ${handleOffset}px)`,
      }
    : {
        left: `calc(${
          ((value - min) / (max - min)) * 100
        }% - ${handleOffset}px)`,
      };

  return (
    <div
      className={`slider ${vertical ? 'vertical' : 'horizontal'}`}
      ref={sliderRef}
    >
      <div className="slider-track" />
      <div className="slider-handle" ref={handleRef} style={handleStyle} />
    </div>
  );
};

export default Slider;
