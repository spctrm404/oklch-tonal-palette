import { useCallback, useContext, useEffect, useRef } from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import s from './_XYSlider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const XYSlider = ({
  value = { x: 0, y: 0 },
  min = { x: 0, y: 0 },
  max = { x: 100, y: 100 },
  step = { x: 1, y: 1 },
  trackClickable = true,
  onChange = null,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const handleRef = useRef(null);

  const offsetRef = useRef(null);

  const getNewValue = useCallback(
    (e) => {
      const offset = offsetRef.current;
      const trackRect = trackRef.current.getBoundingClientRect();
      const handleRect = handleRef.current.getBoundingClientRect();

      const newHandlePos = {};
      const normalizedPos = {};
      const newValue = {};

      newHandlePos.x = e.clientX - trackRect.left - offset.x;
      newHandlePos.y = e.clientY - trackRect.top - offset.y;

      newHandlePos.x = clamp(
        newHandlePos.x,
        0,
        trackRect.width - handleRect.width
      );
      newHandlePos.y = clamp(
        newHandlePos.y,
        0,
        trackRect.height - handleRect.height
      );

      normalizedPos.x = newHandlePos.x / (trackRect.width - handleRect.width);
      normalizedPos.y =
        1 - newHandlePos.y / (trackRect.height - handleRect.height);

      newValue.x = min.x + (max.x - min.x) * normalizedPos.x;
      newValue.y = min.y + (max.y - min.y) * normalizedPos.y;

      newValue.x = setMultipleOfStep(newValue.x, step.x);
      newValue.y = setMultipleOfStep(newValue.y, step.y);

      return newValue;
    },
    [min, max, step]
  );
  const onPointerDrag = useCallback(
    (e) => {
      const newValue = getNewValue(e);
      onChange?.({ value: newValue, min: min, max: max });
    },
    [min, max, onChange, getNewValue]
  );
  const onPointerUp = useCallback(() => {
    document.body.style.cursor = 'auto';
  }, []);
  const onPointerDown = useCallback(
    (e, offset) => {
      document.body.style.cursor = 'pointer';
      offsetRef.current = offset;
      const newValue = getNewValue(e);
      onChange?.({ value: newValue, min: min, max: max });
    },
    [min, max, onChange, getNewValue]
  );
  const onPointerDownTrack = useCallback(
    (e) => {
      const handleRect = handleRef.current.getBoundingClientRect();
      const offset = {
        x: 0.5 * handleRect.width,
        y: 0.5 * handleRect.height,
      };
      onPointerDown(e, offset);
    },
    [onPointerDown]
  );
  const onPointerDownHandle = useCallback(
    (e) => {
      const handleRect = handleRef.current.getBoundingClientRect();
      const offset = {
        x: e.clientX - handleRect.left,
        y: e.clientY - handleRect.top,
      };
      onPointerDown(e, offset);
    },
    [onPointerDown]
  );

  const trackPI = usePointerInteraction();
  useEffect(() => {
    trackPI.setTargetRef(trackRef.current);
    trackPI.setOnPointerDown(trackClickable ? onPointerDownTrack : null);
    trackPI.setOnPointerDrag(trackClickable ? onPointerDrag : null);
    trackPI.setOnPointerUp(trackClickable ? onPointerUp : null);
  }, [trackPI, trackClickable, onPointerDownTrack, onPointerDrag, onPointerUp]);
  const handlePI = usePointerInteraction();
  useEffect(() => {
    handlePI.setTargetRef(handleRef.current);
    handlePI.setOnPointerDown(onPointerDownHandle);
    handlePI.setOnPointerDrag(onPointerDrag);
    handlePI.setOnPointerUp(onPointerUp);
  }, [handlePI, onPointerDownHandle, onPointerDrag, onPointerUp]);

  useEffect(() => {
    const normalizedPos = {
      x: (value.x - min.x) / (max.x - min.x),
      y: (value.y - min.y) / (max.y - min.y),
    };
    sliderRef.current.style.setProperty(`--x`, normalizedPos.x);
    sliderRef.current.style.setProperty(`--y`, 1 - normalizedPos.y);
  }, [value, min, max]);

  return (
    <div
      className={`${cx(`xy-slider`)} ${className || ''}`}
      ref={sliderRef}
      data-theme={theme}
      data-state={
        trackPI.getState() === 'pressed' ? 'pressed' : handlePI.getState()
      }
      data-is-track-clickable={trackClickable}
    >
      <div className={cx('xy-slider__shape', 'xy-slider-shape')} />
      <div className={cx('xy-slider__track', 'xy-slider-track')} ref={trackRef}>
        <div
          className={cx('xy-slider__track__shape', 'xy-slider-track-shape')}
        />
        <div
          className={cx('xy-slider__handle', 'xy-slider-handle')}
          ref={handleRef}
          tabIndex={0}
        >
          <div
            className={cx('xy-slider__handle__state', 'xy-slider-handle-state')}
          />
          <div
            className={cx('xy-slider__handle__shape', 'xy-slider-handle-shape')}
          />
        </div>
      </div>
    </div>
  );
};

export default XYSlider;
