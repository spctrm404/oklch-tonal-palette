import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils';
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

      newThumbPos.x = clamp(
        newThumbPos.x,
        0,
        trackRect.width - thumbRect.width
      );
      newThumbPos.y = clamp(
        newThumbPos.y,
        0,
        trackRect.height - thumbRect.height
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

  const handleMouseDown = useCallback(
    (e, offset) => {
      e.stopPropagation();
      e.preventDefault();

      document.body.style.cursor = 'pointer';

      offsetRef.current = offset;

      const steppedValue = getNewValue(e);
      onChange?.({ value: steppedValue, min: min, max: max });

      setPressed(true);

      const mouseMoveHandler = (e) => {
        const steppedValue = getNewValue(e);
        onChange?.({ value: steppedValue, min: min, max: max });
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

  const handleMouseDownTrack = useCallback(
    (e) => {
      const thumbRect = thumbRef.current.getBoundingClientRect();
      const offset = {
        x: 0.5 * thumbRect.width,
        y: 0.5 * thumbRect.height,
      };

      handleMouseDown(e, offset);
    },
    [handleMouseDown]
  );

  const handleMouseDownThumb = useCallback(
    (e) => {
      const thumbRect = thumbRef.current.getBoundingClientRect();
      const offset = {
        x: e.clientX - thumbRect.left,
        y: e.clientY - thumbRect.top,
      };

      handleMouseDown(e, offset);
    },
    [handleMouseDown]
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
    thumb.addEventListener('mousedown', handleMouseDownThumb);

    const track = trackRef.current;
    if (trackClickable)
      track.addEventListener('mousedown', handleMouseDownTrack);

    return () => {
      thumb.removeEventListener('mousedown', handleMouseDownThumb);
      if (trackClickable)
        track.removeEventListener('mousedown', handleMouseDownTrack);
    };
  }, [trackClickable, handleMouseDownThumb, handleMouseDownTrack]);

  return (
    <div
      className={`${cx(`xyslider`, { 'xyslider--state-pressed': pressed })} ${
        className || ''
      }`}
      ref={sliderRef}
    >
      <div className={`${cx(`xyslider__track`)} xyslider-track`} ref={trackRef}>
        <div className={`${cx(`xyslider__indicator`)} xyslider-indicator`} />
        <div
          className={`${cx(`xyslider__thumb`)} xyslider-thumb`}
          ref={thumbRef}
        >
          {children ? (
            children
          ) : (
            <div className={`${cx(`xyslider__icon`)} xyslider-icon`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default XYSlider;
