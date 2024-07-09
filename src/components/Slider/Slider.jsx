import { useCallback, useEffect, useRef, useState } from 'react';
import './CustomSlider.scss';

const Slider = ({ min, max, step, value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value || min);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const updateSliderValue = useCallback(
    (clientX) => {
      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      const sliderWidth = rect.width;
      const rawValue =
        ((clientX - rect.left) / sliderWidth) * (max - min) + min;
      const steppedValue = Math.round(rawValue / step) * step; // Round to nearest step
      const newSliderValue = Math.min(Math.max(steppedValue, min), max); // Clamp between min and max
      setSliderValue(newSliderValue);
      if (onChange) onChange(newSliderValue);
    },
    [min, max, step, onChange]
  );

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (moveEvent) => {
        updateSliderValue(moveEvent.clientX);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.body.style.userSelect = 'none';
      document.body.style.pointerEvents = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.body.style.userSelect = '';
        document.body.style.pointerEvents = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, updateSliderValue]);

  const handleMouseDown = useCallback(
    (e) => {
      setIsDragging(true);
      updateSliderValue(e.clientX);
    },
    [updateSliderValue]
  );

  return (
    <div
      className="custom-slider"
      ref={sliderRef}
      onMouseDown={handleMouseDown}
    >
      <div
        className="custom-slider-thumb"
        style={{ left: `${((sliderValue - min) / (max - min)) * 100}%` }}
      />
    </div>
  );
};

export default Slider;
