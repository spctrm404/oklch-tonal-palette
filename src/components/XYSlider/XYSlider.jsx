// rename track

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils';
import usePreventTouchScroll from '../../hooks/usePreventTouchScroll';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import style from './_XYSlider.module.scss';
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
  children: handleShape = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const handleRef = useRef(null);

  const offsetRef = useRef(null);

  const preventTouchScroll = usePreventTouchScroll();

  const [isHovered, setHovered] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [isPressed, setPressed] = useState(false);
  const isFocusedByPointer = useRef(false);

  const handleMouseEnterHandle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setHovered(true);
  }, []);
  const handleMouseLeaveHandle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setHovered(false);
  }, []);
  const handleFocusHandle = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (isFocusedByPointer.current) return;
      setFocused(true);
    },
    [isFocusedByPointer]
  );
  const handleBlurHandle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setFocused(false);
  }, []);

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
  const handlePointerDown = useCallback(
    (e, offset) => {
      const handlePointerMove = (e) => {
        e.preventDefault();

        const newValue = getNewValue(e);
        onChange?.({ value: newValue, min: min, max: max });
      };

      const handlePointerUp = (e) => {
        e.preventDefault();

        document.body.style.cursor = 'auto';

        isFocusedByPointer.current = false;
        setPressed(false);

        preventTouchScroll(false);

        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };

      e.stopPropagation();
      e.preventDefault();
      preventTouchScroll(true);

      document.body.style.cursor = 'pointer';

      offsetRef.current = offset;
      const newValue = getNewValue(e);
      onChange?.({ value: newValue, min: min, max: max });

      isFocusedByPointer.current = true;
      setPressed(true);

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [min, max, onChange, preventTouchScroll, getNewValue]
  );
  const handlePointerDownTrack = useCallback(
    (e) => {
      const handleRect = handleRef.current.getBoundingClientRect();
      const offset = {
        x: 0.5 * handleRect.width,
        y: 0.5 * handleRect.height,
      };

      handlePointerDown(e, offset);
    },
    [handlePointerDown]
  );
  const handlePointerDownHandle = useCallback(
    (e) => {
      const handleRect = handleRef.current.getBoundingClientRect();
      const offset = {
        x: e.clientX - handleRect.left,
        y: e.clientY - handleRect.top,
      };

      handlePointerDown(e, offset);
    },
    [handlePointerDown]
  );

  useEffect(() => {
    const normalizedPos = {
      x: (value.x - min.x) / (max.x - min.x),
      y: (value.y - min.y) / (max.y - min.y),
    };
    const trackRect = trackRef.current.getBoundingClientRect();
    const handleRect = handleRef.current.getBoundingClientRect();

    const pos = {
      x: normalizedPos.x * (trackRect.width - handleRect.width),
      y: (1 - normalizedPos.y) * (trackRect.height - handleRect.height),
    };

    sliderRef.current.style.setProperty(`--x`, pos.x);
    sliderRef.current.style.setProperty(`--y`, pos.y);
  }, [value, min, max, step]);

  useEffect(() => {
    const track = trackRef.current;
    const handle = handleRef.current;

    if (trackClickable)
      track.addEventListener('pointerdown', handlePointerDownTrack);

    handle.addEventListener('mouseenter', handleMouseEnterHandle);
    handle.addEventListener('mouseleave', handleMouseLeaveHandle);
    handle.addEventListener('focus', handleFocusHandle);
    handle.addEventListener('blur', handleBlurHandle);
    handle.addEventListener('pointerdown', handlePointerDownHandle);

    return () => {
      if (trackClickable)
        track.removeEventListener('pointerdown', handlePointerDownTrack);

      handle.removeEventListener('mouseenter', handleMouseEnterHandle);
      handle.removeEventListener('mouseleave', handleMouseLeaveHandle);
      handle.removeEventListener('focus', handleFocusHandle);
      handle.removeEventListener('blur', handleBlurHandle);
      handle.removeEventListener('pointerdown', handlePointerDownHandle);
    };
  }, [
    trackClickable,
    handleMouseEnterHandle,
    handleMouseLeaveHandle,
    handleFocusHandle,
    handleBlurHandle,
    handlePointerDownHandle,
    handlePointerDownTrack,
  ]);

  return (
    <div
      className={`${cx(
        `xyslider`,
        { 'xyslider--state-idle': !isHovered && !isFocused && !isPressed },
        { 'xyslider--state-hovered': isHovered },
        { 'xyslider--state-focused': isFocused },
        { 'xyslider--state-pressed': isPressed }
      )} ${className || ''}`}
      ref={sliderRef}
      data-theme={theme}
    >
      <div className={`${cx(`xyslider__track`)} xyslider-track`} ref={trackRef}>
        <div className={`${cx(`xyslider__background`)} xyslider-background`} />
        <div
          className={`${cx('xyslider__handle')} "xyslider-handle"`}
          ref={handleRef}
          tabIndex={0}
        >
          <div
            className={`${cx(
              'xyslider__handle-state'
            )} "xyslider-handle-state"`}
          />
          <div
            className={`${cx(
              'xyslider__handle-shape'
            )} "xyslider-handle-shape"`}
          />
        </div>
      </div>
    </div>
  );
};

export default XYSlider;
