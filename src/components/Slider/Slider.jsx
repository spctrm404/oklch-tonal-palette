import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils';
import style from './Slider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Slider = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  vertical = false,
  thumbDirection = 0,
  trackClickable = false,
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

      let newValue;
      if (vertical) {
        let newThumbPos = e.clientY - trackRect.top - offset.y;
        newThumbPos = clamp(
          newThumbPos,
          0,
          trackRect.height - thumbRect.height
        );
        const percentage =
          1 - newThumbPos / (trackRect.height - thumbRect.height);
        newValue = min + (max - min) * percentage;
      } else {
        let newThumbPos = e.clientX - trackRect.left - offset.x;
        newThumbPos = clamp(newThumbPos, 0, trackRect.width - thumbRect.width);
        const percentage = newThumbPos / (trackRect.width - thumbRect.width);
        newValue = min + (max - min) * percentage;
      }

      const steppedValue = setMultipleOfStep(newValue, step);

      return steppedValue;
    },
    [min, max, step, vertical]
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
    const percentage = (value - min) / (max - min);
    const thumbRect = thumbRef.current.getBoundingClientRect();
    const trackRect = trackRef.current.getBoundingClientRect();

    const pos = vertical
      ? (1 - percentage) * (trackRect.height - thumbRect.height)
      : percentage * (trackRect.width - thumbRect.width);

    sliderRef.current.style.setProperty(vertical ? `--y` : `--x`, pos);
  }, [value, min, max, step, vertical]);

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
      className={`${cx(
        'slider',
        { 'slider--dir-vertical': vertical },
        { 'slider--dir-horizontal': !vertical },
        { 'slider--thumb-dir-left': vertical && thumbDirection === -1 },
        { 'slider--thumb-dir-right': vertical && thumbDirection === 1 },
        { 'slider--thumb-dir-top': !vertical && thumbDirection === -1 },
        { 'slider--thumb-dir-bottom': !vertical && thumbDirection === 1 },
        { 'slider--thumb-dir-center': thumbDirection === 0 },
        { 'slider--state-pressed': pressed }
      )} ${className || ''}`}
      ref={sliderRef}
    >
      <div className={`${cx('slider__track')} slider-track`} ref={trackRef}>
        <div
          className={`${cx(
            'slider__indicator',
            'slider__indicator--type-ellapsed'
          )} slider-indicator-ellapsed`}
        />
        <div
          className={`${cx(
            'slider__indicator',
            'slider__indicator--type-remain'
          )} slider-indicator-remain`}
        />
        <div className={`${cx('slider__thumb')} slider-thumb`} ref={thumbRef}>
          {children ? (
            children
          ) : (
            <div className={`${cx('slider__icon')} slider-icon`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider;
