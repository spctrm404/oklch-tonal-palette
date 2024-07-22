import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import style from './_Slider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Slider = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  vertical = false,
  thumbDirection: handleDirection = 0,
  trackClickable = false,
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
      const handleRect = handleRef.current.getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();

      let newValue;
      if (vertical) {
        let newHandlePos = e.clientY - trackRect.top - offset.y;
        newHandlePos = clamp(
          newHandlePos,
          0,
          trackRect.height - handleRect.height
        );
        const normalizedPos =
          1 - newHandlePos / (trackRect.height - handleRect.height);
        newValue = min + (max - min) * normalizedPos;
      } else {
        let newHandlePos = e.clientX - trackRect.left - offset.x;
        newHandlePos = clamp(
          newHandlePos,
          0,
          trackRect.width - handleRect.width
        );
        const normalizedPos =
          newHandlePos / (trackRect.width - handleRect.width);
        newValue = min + (max - min) * normalizedPos;
      }

      newValue = setMultipleOfStep(newValue, step);

      return newValue;
    },
    [min, max, step, vertical]
  );
  const onPointerDrag = (e) => {
    const newValue = getNewValue(e);
    onChange?.({ value: newValue, min: min, max: max });
  };
  const onPointerUp = () => {
    document.body.style.cursor = 'auto';
  };
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
      const thumbRect = handleRef.current.getBoundingClientRect();
      const offset = {
        x: 0.5 * thumbRect.width,
        y: 0.5 * thumbRect.height,
      };
      onPointerDown(e, offset);
    },
    [onPointerDown]
  );

  const onPointerDownHandle = useCallback(
    (e) => {
      const thumbRect = handleRef.current.getBoundingClientRect();
      const offset = {
        x: e.clientX - thumbRect.left,
        y: e.clientY - thumbRect.top,
      };
      onPointerDown(e, offset);
    },
    [onPointerDown]
  );

  const trackPI = usePointerInteraction({
    targetRef: trackRef,
    onPointerDown: trackClickable ? onPointerDownTrack : null,
    onPointerDrag: trackClickable ? onPointerDrag : null,
    onPointerUp: trackClickable ? onPointerUp : null,
  });
  const handlePI = usePointerInteraction({
    targetRef: handleRef,
    onPointerDown: onPointerDownHandle,
    onPointerDrag: onPointerDrag,
    onPointerUp: onPointerUp,
  });

  useEffect(() => {
    const normalizedPos = (value - min) / (max - min);
    sliderRef.current.style.setProperty(`--pos`, normalizedPos);
  }, [value, min, max, step, vertical]);

  const getHandleDirection = useCallback(() => {
    if (handleDirection === 0) return 'center';
    if (handleDirection === -1) return vertical ? 'top' : 'left';
    if (handleDirection === 1) return vertical ? 'top' : 'left';
  }, [vertical, handleDirection]);

  return (
    <div
      className={`${cx('slider')} ${className || ''}`}
      ref={sliderRef}
      data-theme={theme}
      data-direction={vertical ? 'vertical' : 'horizontal'}
      data-handle-direction={getHandleDirection()}
      data-state={
        trackPI.getState() === 'pressed' ? 'pressed' : handlePI.getState()
      }
      data-track-clickable={trackClickable}
    >
      <div className={`${cx('slider__track')} slider-track`} ref={trackRef}>
        <div className={`${cx('slider__track__shape')} slider-track-shape`}>
          <div
            className={`${cx(
              'slider__track__shape__indicator',
              'slider__track__shape__indicator--type-active'
            )} slider-track-shape-indicator`}
          />
          <div
            className={`${cx(
              'slider__track__shape__indicator',
              'slider__track__shape__indicator--type-inactive'
            )} slider-track-shape-indicator`}
          />
        </div>
        <div
          className={`${cx('slider__handle')} slider-handle`}
          ref={handleRef}
        >
          <div
            className={`${cx('slider__handle__state')} slider-handle-state`}
          />
          <div
            className={`${cx('slider__handle__shape')} slider-handle-shape`}
          />
        </div>
      </div>
    </div>
  );
};

export default Slider;
