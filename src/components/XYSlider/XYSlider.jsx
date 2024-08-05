// toDo: change style on keypressed, snap, shift pressed

import {
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { mergeProps, useFocus, useHover, useMove, usePress } from 'react-aria';
import useWindowResize from '../../hooks/useWindowResize.js';
import { clamp, closestQuantized } from '../../utils/numberUtils.js';
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

  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const normalizedPosition = useCallback(() => {
    if (!trackRef.current) return;
    if (!thumbRef.current) return;
    if (!positionRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();
    const position = positionRef.current;
    return {
      x: (position.x + 0.5 * thumbRect.width) / trackRect.width,
      y: 1 - (position.y + 0.5 * thumbRect.height) / trackRect.height,
    };
  }, []);
  const normalizedValue = useCallback(() => {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] =
        key === 'y'
          ? 1 - (value[key] - minValue[key]) / (maxValue[key] - minValue[key])
          : (value[key] - minValue[key]) / (maxValue[key] - minValue[key]);
      return acc;
    }, {});
  }, [maxValue, minValue, value]);

  const positionFromValue = useCallback(() => {
    if (!trackRef.current) return;
    if (!thumbRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();
    return {
      x: normalizedValue().x * trackRect.width - 0.5 * thumbRect.width,
      y: normalizedValue().y * trackRect.height - 0.5 * thumbRect.height,
    };
  }, [normalizedValue]);
  const valueFromPosition = useCallback(() => {
    return Object.keys(normalizedPosition()).reduce((acc, key) => {
      acc[key] =
        normalizedPosition()[key] * (maxValue[key] - minValue[key]) +
        minValue[key];
      return acc;
    }, {});
  }, [minValue, maxValue, normalizedPosition]);
  const relativePositionToTrack = useCallback(() => {
    if (!trackRef.current) return;
    if (!thumbRef.current) return;
    if (!positionRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();
    const position = positionRef.current;
    return {
      x:
        clamp(
          position.x,
          -0.5 * thumbRect.width,
          trackRect.width - 0.5 * thumbRect.width
        ) / trackRect.width,
      y:
        clamp(
          position.y,
          -0.5 * thumbRect.height,
          trackRect.height - 0.5 * thumbRect.height
        ) / trackRect.height,
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
        acc[key] = closestQuantized(value[key], step[key]);
        return acc;
      }, {});
    },
    [step]
  );

  const clampPosition = useCallback(() => {
    if (!trackRef.current) return;
    if (!thumbRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();
    positionRef.current = {
      x: clamp(
        positionRef.current.x,
        -0.5 * thumbRect.width,
        trackRect.width - 0.5 * thumbRect.width
      ),
      y: clamp(
        positionRef.current.y,
        -0.5 * thumbRect.height,
        trackRect.height - 0.5 * thumbRect.height
      ),
    };
  }, []);

  const onChangeEndHandler = useCallback(() => {
    const newValue = valueFromPosition();
    const quantizedValue = getQuantizedValue(newValue);
    onChangeEnd?.(quantizedValue);
  }, [onChangeEnd, valueFromPosition, getQuantizedValue]);
  const onChangeHandler = useCallback(() => {
    const newValue = valueFromPosition();
    const clampedValue = getClampedValue(newValue);
    const quantizedValue = getQuantizedValue(clampedValue);
    onChange?.(quantizedValue);
  }, [onChange, valueFromPosition, getClampedValue, getQuantizedValue]);

  const onPressStart = useCallback(
    (e) => {
      if (!thumbRef.current) return;

      const thumb = thumbRef.current;
      thumb.focus();
      setFocused(true);
      setDragging(true);
      const thumbRect = thumb.getBoundingClientRect();
      positionRef.current = {
        x: e.x - 0.5 * thumbRect.width,
        y: e.y - 0.5 * thumbRect.height,
      };
      onChangeHandler();
    },
    [onChangeHandler]
  );
  const onMove = useCallback(
    (e) => {
      if (e.pointerType === 'keyboard') clampPosition();
      positionRef.current.x += e.deltaX;
      positionRef.current.y += e.deltaY;
      onChangeHandler();
    },
    [clampPosition, onChangeHandler]
  );
  const onMoveEnd = useCallback(() => {
    clampPosition();
    setDragging(false);
    onChangeEndHandler();
  }, [clampPosition, onChangeEndHandler]);

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

  const setPositionByValue = useCallback(() => {
    positionRef.current = positionFromValue();
  }, [positionFromValue]);
  const applyPosition = useCallback(() => {
    if (!thumbRef.current) return;

    thumbRef.current.style.setProperty(
      'left',
      `${100 * relativePositionToTrack().x}%`
    );
    thumbRef.current.style.setProperty(
      'top',
      `${100 * relativePositionToTrack().y}%`
    );
  }, [relativePositionToTrack]);
  const a = useCallback(() => {
    setPositionByValue();
    applyPosition();
  }, [setPositionByValue, applyPosition]);

  // useWindowResize({
  //   onResize: a(),
  //   onResizeEnd: a(),
  // });

  useLayoutEffect(() => {
    setPositionByValue();
    applyPosition();
  }, []);
  useLayoutEffect(() => {
    applyPosition();
  });

  return (
    <div
      className={cx('xyslider', 'xyslider__root', className)}
      {...(isDisabled && { 'data-disabled': 'true' })}
      data-theme={theme}
      style={{
        '--normalized-val-x': normalizedValue().x,
        '--normalized-val-y': normalizedValue().y,
      }}
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
            'xyslider__track__guide',
            'xyslider__track__guide--part-top',
            'xyslider__track__guide--part-vertical'
          )}
        />
        <div
          className={cx(
            'xyslider__track__guide',
            'xyslider__track__guide--part-right',
            'xyslider__track__guide--part-horizontal'
          )}
        />
        <div
          className={cx(
            'xyslider__track__guide',
            'xyslider__track__guide--part-bottom',
            'xyslider__track__guide--part-vertical'
          )}
        />
        <div
          className={cx(
            'xyslider__track__guide',
            'xyslider__track__guide--part-left',
            'xyslider__track__guide--part-horizontal'
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
          <div className={cx('xyslider__thumb__state')} />
          <div className={cx('xyslider__thumb__shape')}>
            <div
              className={cx(
                'xyslider__thumb__shape__component',
                'xyslider__thumb__shape__component--part-top'
              )}
            />
            <div
              className={cx(
                'xyslider__thumb__shape__component',
                'xyslider__thumb__shape__component--part-right'
              )}
            />
            <div
              className={cx(
                'xyslider__thumb__shape__component',
                'xyslider__thumb__shape__component--part-bottom'
              )}
            />
            <div
              className={cx(
                'xyslider__thumb__shape__component',
                'xyslider__thumb__shape__component--part-left'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default XYSlider;
