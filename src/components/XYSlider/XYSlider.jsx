import { useCallback, useEffect, useRef, useState } from 'react';
import { setMultipleOfStep } from '../../utils/numFormat';
import style from './XYSlider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const XYSlider = ({
  value = { x: 0, y: 0 },
  min = { x: 0, y: 0 },
  max = { x: 100, y: 100 },
  step = { x: 1, y: 1 },
  trackClickable = true,
  onChange = null,
  className = null,
  children = null,
}) => {
  const [pressed, setPressed] = useState(false);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const offsetRef = useRef(null);

  const getNewValue = useCallback(
    (e) => {
      const offset = offsetRef.current;
      const thumbRect = thumbRef.current.getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();

      let newThumbPos = {};
      let newValue = {};

      newThumbPos.x = e.clientX - trackRect.left - offset.x;
      newThumbPos.y = e.clientY - trackRect.top - offset.y;

      newThumbPos.x = Math.min(
        trackRect.width - thumbRect.width,
        Math.max(0, newThumbPos.x)
      );
      newThumbPos.y = Math.min(
        trackRect.height - thumbRect.height,
        Math.max(0, newThumbPos.y)
      );

      const percentage = {};
      percentage.x = newThumbPos.x / (trackRect.width - thumbRect.width);
      percentage.y = 1 - newThumbPos.y / (trackRect.height - thumbRect.height);

      newValue.x = min.x + (max.x - min.x) * percentage.x;
      newValue.y = min.y + (max.y - min.y) * percentage.y;

      const steppedValue = {};
      steppedValue.x = setMultipleOfStep(newValue.x, step.x);
      steppedValue.y = setMultipleOfStep(newValue.y, step.y);

      return steppedValue;
    },
    [min, max, step]
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
      onChange?.(steppedValue, min, max);

      setPressed(true);

      const mouseMoveHandler = (e) => {
        const steppedValue = getNewValue(e);
        onChange?.(steppedValue, min, max);
      };

      const mouseUpHandler = () => {
        document.body.style.cursor = 'auto';

        setPressed(false);

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [min, max, onChange, getNewValue]
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

      const steppedValue = getNewValue(e);
      onChange?.(steppedValue, min, max);

      setPressed(true);

      const mouseMoveHandler = (e) => {
        const steppedValue = getNewValue(e);
        onChange?.(steppedValue, min, max);
      };

      const mouseUpHandler = () => {
        document.body.style.cursor = 'auto';

        setPressed(false);

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [min, max, onChange, getNewValue]
  );

  useEffect(() => {
    const percentage = {
      x: (value.x - min.x) / (max.x - min.x),
      y: (value.y - min.y) / (max.y - min.y),
    };
    const thumbRect = thumbRef.current.getBoundingClientRect();
    const trackRect = trackRef.current.getBoundingClientRect();

    const pos = {
      x: percentage.x * (trackRect.width - thumbRect.width),
      y: (1 - percentage.y) * (trackRect.height - thumbRect.height),
    };

    sliderRef.current.style.setProperty(`--x`, pos.x);
    sliderRef.current.style.setProperty(`--y`, pos.y);
  }, [value, min, max, step]);

  useEffect(() => {
    const thumb = thumbRef.current;
    thumb.addEventListener('mousedown', mouseDownThumbHandler);

    const track = trackRef.current;
    if (trackClickable)
      track.addEventListener('mousedown', mouseDownTrackHandler);

    return () => {
      thumb.removeEventListener('mousedown', mouseDownThumbHandler);
      if (trackClickable)
        track.removeEventListener('mousedown', mouseDownTrackHandler);
    };
  }, [trackClickable, mouseDownThumbHandler, mouseDownTrackHandler]);

  return (
    <div
      className={`${cx(`slider`, { 'slider--state-pressed': pressed })} ${
        className || ``
      }`}
      ref={sliderRef}
    >
      <div className={`${cx(`slider__track`)} slider-track`} ref={trackRef}>
        <div className={`${cx(`slider__indicator`)} slider-indicator`} />
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

export default XYSlider;
