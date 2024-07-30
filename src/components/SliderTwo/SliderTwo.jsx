// toDo: refactor,guide,nomalvalasvar, snap, shift key

import {
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { mergeProps, useFocus, useHover, useMove, usePress } from 'react-aria';
import { useResizeEffect } from '../../hooks/useResizeEffect';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_SliderTwo.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const SliderTwo = ({
  name = '',
  minValue = { x: 0, y: 0 },
  maxValue = { x: 100, y: 100 },
  step = { x: 1, y: 1 },
  value = { x: 50, y: 50 },
  isDisable = false,
  onChangeEnd = null,
  onChange = null,
  className = '',
}) => {
  const id = useId();
  const { theme } = useContext(ThemeContext);

  const [isDragging, setDragging] = useState(false);
  const [isFocused, setFocused] = useState(false);

  const positionRef = useRef({ x: 0, y: 0 });

  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const getPositionFromValue = useCallback(
    (value) => {
      const trackRect = trackRef.current.getBoundingClientRect();
      const thumbRect = thumbRef.current.getBoundingClientRect();

      const nomalizedValue = Object.keys(value).reduce((acc, key) => {
        acc[key] =
          (value[key] - minValue[key]) / (maxValue[key] - minValue[key]);
        return acc;
      }, {});
      return {
        x: nomalizedValue.x * trackRect.width - 0.5 * thumbRect.width,
        y: nomalizedValue.y * trackRect.height - 0.5 * thumbRect.height,
      };
    },
    [minValue, maxValue]
  );
  const getValueFromPosition = useCallback(
    (position) => {
      const trackRect = trackRef.current.getBoundingClientRect();
      const thumbRect = thumbRef.current.getBoundingClientRect();

      const normalizedPosition = {
        x: (position.x + 0.5 * thumbRect.width) / trackRect.width,
        y: (position.y + 0.5 * thumbRect.height) / trackRect.height,
      };
      return Object.keys(normalizedPosition).reduce((acc, key) => {
        acc[key] =
          normalizedPosition[key] * (maxValue[key] - minValue[key]) +
          minValue[key];
        return acc;
      }, {});
    },
    [minValue, maxValue]
  );

  const getClampedPosition = useCallback((position) => {
    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();
    return {
      x: clamp(
        position.x,
        -0.5 * thumbRect.width,
        trackRect.width - 0.5 * thumbRect.width
      ),
      y: clamp(
        position.y,
        -0.5 * thumbRect.height,
        trackRect.height - 0.5 * thumbRect.height
      ),
    };
  }, []);
  const getClampedValue = useCallback(
    (value) => {
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = clamp(value[key], minValue[key], maxValue[key]);
        return acc;
      }, {});
    },
    [minValue, maxValue]
  );
  const getQuantizedValue = useCallback(
    (value) => {
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = setMultipleOfStep(value[key], step[key]);
        return acc;
      }, {});
    },
    [step]
  );

  const onChangeEndHandler = useCallback(
    (newPosition) => {
      const valueFromPosition = getValueFromPosition(newPosition);
      const quantizedValue = getQuantizedValue(valueFromPosition);
      onChangeEnd?.(quantizedValue);
    },
    [onChangeEnd, getValueFromPosition, getQuantizedValue]
  );
  const onChangeHandler = useCallback(
    (newPosition) => {
      const valueFromPosition = getValueFromPosition(newPosition);
      const clampedValue = getClampedValue(valueFromPosition);
      const quantizedValue = getQuantizedValue(clampedValue);
      onChange?.(quantizedValue);
    },
    [onChange, getValueFromPosition, getClampedValue, getQuantizedValue]
  );

  const { hoverProps: trackHoverProps, isHovered: trackIsHovered } = useHover({
    onHoverStart: () => {
      if (!isDisable) {
      }
    },
    onHoverEnd: () => {
      if (!isDisable) {
      }
    },
    onHoverChange: () => {
      if (!isDisable) {
      }
    },
  });
  const { pressProps: trackPressProps } = usePress({
    onPress: () => {
      if (!isDisable) {
        // console.log('trackOnPress');
      }
    },
    onPressStart: (e) => {
      if (!isDisable) {
        console.log('trackOnPressStart');
        const thumb = thumbRef.current;
        thumb.focus();
        setFocused(true);
        setDragging(true);
        const thumbRect = thumb.getBoundingClientRect();
        positionRef.current = {
          x: e.x - 0.5 * thumbRect.width,
          y: e.y - 0.5 * thumbRect.height,
        };
        onChange(positionRef.current);
      }
    },
    onPressEnd: () => {
      if (!isDisable) {
        // console.log('trackOnPressEnd');
      }
    },
    onPressChange: () => {
      if (!isDisable) {
        // console.log('trackOnPressChange');
      }
    },
    onPressUp: () => {
      if (!isDisable) {
        // console.log('trackOnPressUp');
        setDragging(false);
      }
    },
  });
  const { moveProps: trackMoveProps } = useMove({
    onMoveStart: () => {
      if (!isDisable) {
        // console.log('trackOnMoveStart');
      }
    },
    onMove: (e) => {
      if (!isDisable) {
        // console.log('trackOnMove');
        const newPosition =
          e.pointerType === 'keyboard'
            ? getClampedPosition(positionRef.current)
            : { ...positionRef.current };
        newPosition.x += e.deltaX;
        newPosition.y += e.deltaY;
        positionRef.current = newPosition;
        onChangeHandler(newPosition);
      }
    },
    onMoveEnd: () => {
      if (!isDisable) {
        console.log('trackOnMoveEnd');
        const newPosition = getClampedPosition(positionRef.current);
        positionRef.current = newPosition;
        onChangeEndHandler(newPosition);
        setDragging(false);
      }
    },
  });
  const trackProps = mergeProps(
    trackHoverProps,
    trackPressProps,
    trackMoveProps
  );

  const { hoverProps: thumbHoverProps, isHovered: thumbIsHovered } = useHover({
    onHoverStart: () => {
      if (!isDisable) {
      }
    },
    onHoverEnd: () => {
      if (!isDisable) {
      }
    },
    onHoverChange: () => {
      if (!isDisable) {
      }
    },
  });
  const { focusProps: thumbFocusProps } = useFocus({
    isDisabled: false,
    onFocus: () => {
      if (!isDisable) {
        console.log('thumbOnFocus');
        setFocused(true);
      }
    },
    onBlur: () => {
      if (!isDisable) {
        console.log('thumbOnBlur');
        setFocused(false);
      }
    },
    onFocusChange: () => {
      console.log('thumbOnFocusChange');
      if (!isDisable) {
      }
    },
  });
  const { pressProps: thumbPressProps } = usePress({
    onPress: () => {
      if (!isDisable) {
        // console.log('thumbOnPress');
      }
    },
    onPressStart: () => {
      if (!isDisable) {
        console.log('thumbOnPressStart');
        setDragging(true);
      }
    },
    onPressEnd: () => {
      if (!isDisable) {
        // console.log('thumbOnPressEnd');
      }
    },
    onPressChange: () => {
      if (!isDisable) {
        // console.log('thumbOnPressChange');
      }
    },
    onPressUp: () => {
      if (!isDisable) {
        // console.log('thumbOnPressUp');
      }
    },
  });
  const { moveProps: thumbMoveProp } = useMove({
    onMoveStart: () => {
      if (!isDisable) {
        // console.log('thumbOnMoveStart');
      }
    },
    onMove: (e) => {
      if (!isDisable) {
        // console.log('thumbOnMove');
        const newPosition =
          e.pointerType === 'keyboard'
            ? getClampedPosition(positionRef.current)
            : { ...positionRef.current };
        newPosition.x += e.deltaX;
        newPosition.y += e.deltaY;
        positionRef.current = newPosition;
        onChangeHandler(newPosition);
      }
    },
    onMoveEnd: () => {
      if (!isDisable) {
        console.log('thumbOnMoveEnd');
        const newPosition = getClampedPosition(positionRef.current);
        positionRef.current = newPosition;
        setDragging(false);
        onChangeEndHandler(newPosition);
      }
    },
  });
  const thumbProps = mergeProps(
    thumbHoverProps,
    thumbFocusProps,
    thumbPressProps,
    thumbMoveProp
  );

  useLayoutEffect(() => {
    const clampedPosition = getClampedPosition(positionRef.current);
    thumbRef.current.style.setProperty('left', `${clampedPosition.x}px`);
    thumbRef.current.style.setProperty('top', `${clampedPosition.y}px`);
  }, [value, getClampedPosition]);
  useLayoutEffect(() => {
    const initialPosition = getPositionFromValue(value);
    positionRef.current = initialPosition;
    const clampedPosition = getClampedPosition(positionRef.current);
    thumbRef.current.style.setProperty('left', `${clampedPosition.x}px`);
    thumbRef.current.style.setProperty('top', `${clampedPosition.y}px`);
  }, []);

  const onResize = useCallback(() => {
    const initialPosition = getPositionFromValue(value);
    positionRef.current = initialPosition;
    const clampedPosition = getClampedPosition(positionRef.current);
    thumbRef.current.style.setProperty('left', `${clampedPosition.x}px`);
    thumbRef.current.style.setProperty('top', `${clampedPosition.y}px`);
  }, [value, getPositionFromValue, getClampedPosition]);
  useResizeEffect({
    layoutEffectCallback: onResize,
  });

  return (
    <div
      id={id}
      aria-label={name}
      className={cx('xyslider', { className })}
      data-theme={theme}
      role={'group'}
    >
      <div
        className={cx('xyslider__track')}
        {...trackProps}
        {...(!isDisable && trackIsHovered && { 'data-hovered': 'true' })}
        {...(isDisable && { 'data-disabled': 'true' })}
        style={{ position: 'relative', touchAction: 'none' }}
        ref={trackRef}
      >
        <div
          className={cx('xyslider__thumb')}
          {...thumbProps}
          {...(!isDisable && thumbIsHovered && { 'data-hovered': 'true' })}
          {...(!isDisable && isDragging && { 'data-dragging': 'true' })}
          {...(!isDisable && isFocused && { 'data-focused': 'true' })}
          {...(isDisable && { 'data-disabled': 'true' })}
          tabIndex={0}
          style={{
            position: 'absolute',
            touchAction: 'none',
          }}
          ref={thumbRef}
        >
          <div className={cx('xyslider__thumb__shape')}>
            <div className={cx('xyslider__thumb__shape__indicator')} />
            <div className={cx('xyslider__thumb__shape__indicator')} />
            <div className={cx('xyslider__thumb__shape__indicator')} />
            <div className={cx('xyslider__thumb__shape__indicator')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderTwo;
