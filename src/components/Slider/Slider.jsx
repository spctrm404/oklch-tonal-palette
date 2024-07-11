import { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import style from './Slider.module.scss';

const cx = classNames.bind(style);

const Slider = ({
  value,
  min,
  max,
  step,
  vertical = false,
  thumbDirection = 0,
  onChange,
  children,
  className,
}) => {
  const trackRef = useRef(null);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);
  const offsetRef = useRef(null);

  const getSteppedValue = useCallback((value, step) => {
    const decimalPlaces = (step.toString().split('.')[1] || '').length;
    const multiplier = Math.round(value / step) * step;
    const steppedValue = parseFloat(multiplier.toFixed(decimalPlaces));
    return steppedValue;
  }, []);

  const getNewValue = useCallback(
    (e) => {
      const offset = offsetRef.current;
      const thumbRect = thumbRef.current.getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();

      let newThumbPos;
      let newValue;
      if (vertical) {
        newThumbPos = e.clientY - trackRect.top - offset.y;
        newThumbPos = Math.min(
          trackRect.height - thumbRect.height,
          Math.max(0, newThumbPos)
        );
        const percentage = newThumbPos / (trackRect.height - thumbRect.height);
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

      const steppedValue = getSteppedValue(newValue, step);

      return steppedValue;
    },
    [min, max, step, vertical, getSteppedValue]
  );

  const mouseDownTrackHandler = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      document.body.style.cursor = 'pointer';

      const thumbRect = thumbRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: 0.5 * thumbRect.width,
        y: 0.5 * thumbRect.height,
      };

      const steppedValue = getNewValue(e);

      onChange(steppedValue);

      const mouseMoveHandler = (e) => {
        const steppedValue = getNewValue(e);

        onChange(steppedValue);
      };

      const mouseUpHandler = () => {
        document.body.style.cursor = 'auto';

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [getNewValue, onChange]
  );

  const mouseDownThumbHandler = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();

      document.body.style.cursor = 'pointer';

      const thumbRect = thumbRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - thumbRect.left,
        y: e.clientY - thumbRect.top,
      };

      const mouseMoveHandler = (e) => {
        const steppedValue = getNewValue(e);

        onChange(steppedValue);
      };

      const mouseUpHandler = () => {
        document.body.style.cursor = 'auto';

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [getNewValue, onChange]
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

    const track = trackRef.current;
    track.addEventListener('mousedown', mouseDownTrackHandler);

    return () => {
      thumb.removeEventListener('mousedown', mouseDownThumbHandler);
      track.removeEventListener('mousedown', mouseDownTrackHandler);
    };
  }, [mouseDownThumbHandler, mouseDownTrackHandler]);

  return (
    <div
      className={cx(
        `slider`,
        { 'slider--dir-vertical': vertical },
        { 'slider--dir-horizontal': !vertical },
        { 'slider--thumb-dir-left': vertical && thumbDirection === -1 },
        { 'slider--thumb-dir-right': vertical && thumbDirection === 1 },
        { 'slider--thumb-dir-top': !vertical && thumbDirection === -1 },
        { 'slider--thumb-dir-bottom': !vertical && thumbDirection === 1 },
        { 'slider--thumb-dir-center': thumbDirection === 0 }
      )}
      ref={sliderRef}
    >
      <div className={`${cx(`slider__track`)} slider-track`} ref={trackRef}>
        <div className={`${cx(`slider__thumb`)} slider-thumb`} ref={thumbRef}>
          {children ? (
            children
          ) : (
            <div className={`${cx(`slider__icon`)} slider-icon`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider;
