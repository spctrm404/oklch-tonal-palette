import { useCallback, useEffect, useRef, useState } from 'react';
import { setMultipleOfStep } from '../../utils/numFormat';
import classNames from 'classnames/bind';
import style from './Slider.module.scss';

const cx = classNames.bind(style);

const Slider = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  vertical = false,
  thumbDirection = 0,
  trackClickable = false,
  setValue = null,
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

      const steppedValue = setMultipleOfStep(newValue, step);

      return steppedValue;
    },
    [min, max, step, vertical]
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
      setValue?.(steppedValue);

      setPressed(true);

      const mouseMoveHandler = (e) => {
        const steppedValue = getNewValue(e);
        setValue?.(steppedValue);
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
    [setValue, getNewValue]
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
      setValue?.(steppedValue);

      setPressed(true);

      const mouseMoveHandler = (e) => {
        const steppedValue = getNewValue(e);
        setValue?.(steppedValue);
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
    [setValue, getNewValue]
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
      className={`${cx(
        `slider`,
        { 'slider--dir-vertical': vertical },
        { 'slider--dir-horizontal': !vertical },
        { 'slider--thumb-dir-left': vertical && thumbDirection === -1 },
        { 'slider--thumb-dir-right': vertical && thumbDirection === 1 },
        { 'slider--thumb-dir-top': !vertical && thumbDirection === -1 },
        { 'slider--thumb-dir-bottom': !vertical && thumbDirection === 1 },
        { 'slider--thumb-dir-center': thumbDirection === 0 },
        { 'slider--state-pressed': pressed }
      )} ${className || ``}`}
      ref={sliderRef}
    >
      <div className={`${cx(`slider__track`)} slider-track`} ref={trackRef}>
        <div
          className={`${cx(
            `slider__indicator`,
            `slider__indicator--type-ellapsed`
          )} slider-indicator-ellapsed`}
        />
        <div
          className={`${cx(
            `slider__indicator`,
            `slider__indicator--type-remain`
          )} slider-indicator-remain`}
        />
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
