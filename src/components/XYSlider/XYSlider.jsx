// toDo: change style on keypressed, snap, shift pressed

import {
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { mergeProps, useFocus, useHover, useMove, usePress } from 'react-aria';
import { useResizeEffect } from '../../hooks/useResizeEffect.js';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_XYSlider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const XYSlider = ({
  minValue = { x: 0, y: 0 },
  maxValue = { x: 100, y: 100 },
  step = { x: 1, y: 1 },
  value = { x: 50, y: 50 },
  onChangeEnd = () => {},
  onChange = () => {},
  isDisabled = false,
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const [isDragging, setDragging] = useState(false);
  const [isFocused, setFocused] = useState(false);

  const positionRef = useRef({ x: 0, y: 0 });

  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const getNormalizedPosition = useCallback((position) => {
    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();
    const normalizedPosition = {
      x: (position.x + 0.5 * thumbRect.width) / trackRect.width,
      y: (position.y + 0.5 * thumbRect.height) / trackRect.height,
    };
    normalizedPosition.y = 1 - normalizedPosition.y;
    return normalizedPosition;
  }, []);
  const getNormalizedValue = useCallback(
    (value) => {
      const normalizedValue = Object.keys(value).reduce((acc, key) => {
        acc[key] =
          (value[key] - minValue[key]) / (maxValue[key] - minValue[key]);
        return acc;
      }, {});
      normalizedValue.y = 1 - normalizedValue.y;
      return normalizedValue;
    },
    [maxValue, minValue]
  );

  const getPositionFromValue = useCallback(
    (value) => {
      const trackRect = trackRef.current.getBoundingClientRect();
      const thumbRect = thumbRef.current.getBoundingClientRect();
      return {
        x:
          getNormalizedValue(value).x * trackRect.width - 0.5 * thumbRect.width,
        y:
          getNormalizedValue(value).y * trackRect.height -
          0.5 * thumbRect.height,
      };
    },
    [getNormalizedValue]
  );
  const getValueFromPosition = useCallback(
    (position) => {
      const normalizedPosition = getNormalizedPosition(position);
      return Object.keys(normalizedPosition).reduce((acc, key) => {
        acc[key] =
          normalizedPosition[key] * (maxValue[key] - minValue[key]) +
          minValue[key];
        return acc;
      }, {});
    },
    [minValue, maxValue, getNormalizedPosition]
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

  const onPressStart = useCallback(
    (e) => {
      const thumb = thumbRef.current;
      thumb.focus();
      setFocused(true);
      setDragging(true);
      const thumbRect = thumb.getBoundingClientRect();
      positionRef.current = {
        x: e.x - 0.5 * thumbRect.width,
        y: e.y - 0.5 * thumbRect.height,
      };
      onChangeHandler(positionRef.current);
    },
    [onChangeHandler]
  );
  const onMove = useCallback(
    (e) => {
      const newPosition =
        e.pointerType === 'keyboard'
          ? getClampedPosition(positionRef.current)
          : { ...positionRef.current };
      newPosition.x += e.deltaX;
      newPosition.y += e.deltaY;
      positionRef.current = newPosition;
      onChangeHandler(newPosition);
    },
    [getClampedPosition, onChangeHandler]
  );
  const onMoveEnd = useCallback(() => {
    const newPosition = getClampedPosition(positionRef.current);
    positionRef.current = newPosition;
    setDragging(false);
    onChangeEndHandler(newPosition);
  }, [getClampedPosition, onChangeEndHandler]);

  const { hoverProps: trackHoverProps, isHovered: trackIsHovered } = useHover(
    {}
  );
  const { pressProps: trackPressProps } = usePress({
    onPressStart: (e) => {
      if (!isDisabled) onPressStart(e);
    },
    onPressUp: () => {
      if (!isDisabled) setDragging(false);
    },
  });
  const { moveProps: trackMoveProps } = useMove({
    onMove: (e) => {
      if (!isDisabled) onMove(e);
    },
    onMoveEnd: () => {
      if (!isDisabled) onMoveEnd();
    },
  });
  const trackProps = mergeProps(
    trackHoverProps,
    trackPressProps,
    trackMoveProps
  );

  const { hoverProps: thumbHoverProps, isHovered: thumbIsHovered } = useHover(
    {}
  );
  const { focusProps: thumbFocusProps } = useFocus({
    isDisabled: false,
    onFocus: () => {
      if (!isDisabled) setFocused(true);
    },
    onBlur: () => {
      if (!isDisabled) setFocused(false);
    },
  });
  const { pressProps: thumbPressProps } = usePress({
    onPressStart: () => {
      if (!isDisabled) setDragging(true);
    },
  });
  const { moveProps: thumbMoveProp } = useMove({
    onMove: (e) => {
      if (!isDisabled) onMove(e);
    },
    onMoveEnd: () => {
      if (!isDisabled) onMoveEnd();
    },
  });
  const thumbProps = mergeProps(
    thumbHoverProps,
    thumbFocusProps,
    thumbPressProps,
    thumbMoveProp
  );

  const setPositionByValue = useCallback(
    (value) => {
      const newPosition = getPositionFromValue(value);
      positionRef.current = newPosition;
    },
    [getPositionFromValue]
  );
  const applyPosition = useCallback(
    (position) => {
      const clampedPosition = getClampedPosition(position);
      thumbRef.current.style.setProperty('left', `${clampedPosition.x}px`);
      thumbRef.current.style.setProperty('top', `${clampedPosition.y}px`);
    },
    [getClampedPosition]
  );
  const normalizedValue = useCallback(() => {
    const normalizedValue = Object.keys(value).reduce((acc, key) => {
      acc[key] = (value[key] - minValue[key]) / (maxValue[key] - minValue[key]);
      return acc;
    }, {});
    normalizedValue.y = 1 - normalizedValue.y;
    return normalizedValue;
  }, [maxValue, minValue, value]);
  const applyPositionAsProperty = useCallback(() => {
    rootRef.current.style.setProperty('--normalized-x', normalizedValue().x);
    rootRef.current.style.setProperty('--normalized-y', normalizedValue().y);
  }, [normalizedValue]);

  useLayoutEffect(() => {
    setPositionByValue(value);
    applyPosition(positionRef.current);
    applyPositionAsProperty();
  }, []);
  useLayoutEffect(() => {
    applyPosition(positionRef.current);
    applyPositionAsProperty();
  }, [value, applyPosition, applyPositionAsProperty]);

  const onResize = useCallback(() => {
    setPositionByValue(value);
    applyPosition(positionRef.current);
    applyPositionAsProperty();
  }, [value, setPositionByValue, applyPosition, applyPositionAsProperty]);
  useResizeEffect({
    layoutEffectCallback: onResize,
  });

  return (
    <div
      className={cx('xyslider', 'xyslider__root', className)}
      {...(isDisabled && { 'data-disabled': 'true' })}
      data-theme={theme}
      ref={rootRef}
      {...props}
    >
      <div
        className={cx('xyslider__track')}
        {...trackProps}
        {...(!isDisabled && trackIsHovered && { 'data-hovered': 'true' })}
        {...(isDisabled && { 'data-disabled': 'true' })}
        style={{
          position: 'relative',
          touchAction: 'none',
        }}
        ref={trackRef}
      >
        <div className={cx('xyslider__track__shape')} />
        <div
          className={cx(
            'xyslider__guide',
            'xyslider__guide--part-top',
            'xyslider__guide--part-vertical'
          )}
        />
        <div
          className={cx(
            'xyslider__guide',
            'xyslider__guide--part-right',
            'xyslider__guide--part-horizontal'
          )}
        />
        <div
          className={cx(
            'xyslider__guide',
            'xyslider__guide--part-bottom',
            'xyslider__guide--part-vertical'
          )}
        />
        <div
          className={cx(
            'xyslider__guide',
            'xyslider__guide--part-left',
            'xyslider__guide--part-horizontal'
          )}
        />
        <div
          className={cx('xyslider__thumb')}
          {...thumbProps}
          {...(!isDisabled && thumbIsHovered && { 'data-hovered': 'true' })}
          {...(!isDisabled && isDragging && { 'data-dragging': 'true' })}
          {...(!isDisabled && isFocused && { 'data-focused': 'true' })}
          {...(isDisabled && { 'data-disabled': 'true' })}
          tabIndex={0}
          style={{
            position: 'absolute',
            touchAction: 'none',
          }}
          ref={thumbRef}
        >
          <div className={cx('xyslider__state')} />
          <div className={cx('xyslider__thumb__shape')}>
            <div
              className={cx(
                'xyslider__thumb__shape__indicator',
                'xyslider__thumb__shape__indicator--part-top'
              )}
            />
            <div
              className={cx(
                'xyslider__thumb__shape__indicator',
                'xyslider__thumb__shape__indicator--part-right'
              )}
            />
            <div
              className={cx(
                'xyslider__thumb__shape__indicator',
                'xyslider__thumb__shape__indicator--part-bottom'
              )}
            />
            <div
              className={cx(
                'xyslider__thumb__shape__indicator',
                'xyslider__thumb__shape__indicator--part-left'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default XYSlider;
