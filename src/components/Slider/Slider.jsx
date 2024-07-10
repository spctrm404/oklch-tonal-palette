import { useCallback, useEffect, useRef } from 'react';
import style from './Slider.module.scss';

const Slider = ({
  value,
  min,
  max,
  step,
  vertical = false,
  flip = false,
  onChange,
}) => {
  const trackRef = useRef(null);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDownTrack = useCallback(() => {}, []);
  const mouseDownThumbHandler = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      const thumbRect = thumbRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - thumbRect.left,
        y: e.clientY - thumbRect.top,
      };

      const mouseMoveHandler = (e) => {
        const offset = offsetRef.current;
        const thumbRect = thumbRef.current.getBoundingClientRect();
        const trackRect = trackRef.current.getBoundingClientRect();
        let newValue;
        let newThumbPos;
        if (vertical) {
          newThumbPos = e.clientY - trackRect.top - offset.y;
          newThumbPos = Math.min(
            trackRect.height - thumbRect.height,
            Math.max(0, newThumbPos)
          );
          const percentage =
            newThumbPos / (trackRect.height - thumbRect.height);
          newValue = min + (max - min) * percentage;
        } else {
          newThumbPos = e.clientX - trackRect.left - offset.x;
          newThumbPos = Math.min(
            trackRect.width - thumbRect.width,
            Math.max(0, newThumbPos)
          );
          const percentage = newThumbPos / (trackRect.width - thumbRect.width);
          newValue = min + (max - min) * percentage;
        }

        const decimalPlaces = (step.toString().split('.')[1] || '').length;
        let steppedValue = Math.round(newValue / step) * step;
        steppedValue = steppedValue.toFixed(decimalPlaces);
        steppedValue = parseFloat(steppedValue);

        onChange(steppedValue);
      };

      const mouseUpHandler = () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [min, max, step, vertical, onChange]
  );

  useEffect(() => {
    const percentage = (value - min) / (max - min);
    const thumbRect = thumbRef.current.getBoundingClientRect();
    const trackRect = trackRef.current.getBoundingClientRect();

    const pos =
      percentage *
      (vertical
        ? trackRect.height - thumbRect.height
        : trackRect.width - thumbRect.width);

    sliderRef.current.style.setProperty(vertical ? `--y` : `--x`, pos);
  }, [value, min, max, step, vertical]);

  useEffect(() => {
    const thumb = thumbRef.current;
    thumb.addEventListener('mousedown', mouseDownThumbHandler);

    return () => {
      thumb.removeEventListener('mousedown', mouseDownThumbHandler);
    };
  }, [mouseDownThumbHandler]);

  return (
    <div
      className={`${style.slider} ${
        style[`slider-${vertical ? `vertical` : `horizontal`}`]
      } ${flip ? style[`slider-flip`] : ``}`}
      ref={sliderRef}
    >
      <div
        className={style.track}
        ref={trackRef}
        onMouseDown={onMouseDownTrack}
      >
        <div className={style.thumb} ref={thumbRef}>
          <div className={style.icon} />
        </div>
      </div>
    </div>
  );
};

export default Slider;
