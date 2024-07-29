// toDo: step, snap, shift key

import {
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { mergeProps, useFocus, useHover, useMove, usePress } from 'react-aria';
import { clamp } from '../../utils/numberUtils';
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

  const valueToPosition = useCallback(() => {
    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();

    const nomalizedValue = Object.keys(value).reduce((acc, key) => {
      acc[key] = (value[key] - minValue[key]) / (maxValue[key] - minValue[key]);
      return acc;
    }, {});
    return {
      x: nomalizedValue.x * trackRect.width - 0.5 * thumbRect.width,
      y: nomalizedValue.y * trackRect.height - 0.5 * thumbRect.height,
    };
  }, [minValue, maxValue, value]);
  const positionToValue = useCallback(
    (position) => {
      const trackRect = trackRef.current.getBoundingClientRect();
      const thumbRect = thumbRef.current.getBoundingClientRect();

      const normalizedPos = {
        x: (position.x + 0.5 * thumbRect.width) / trackRect.width,
        y: (position.y + 0.5 * thumbRect.height) / trackRect.height,
      };
      return Object.keys(normalizedPos).reduce((acc, key) => {
        acc[key] =
          normalizedPos[key] * (maxValue[key] - minValue[key]) + minValue[key];
        return acc;
      }, {});
    },
    [minValue, maxValue]
  );

  const clampPosition = useCallback((position) => {
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
  const clampValue = useCallback(
    (value) => {
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = clamp(value[key], minValue[key], maxValue[key]);
        return acc;
      }, {});
    },
    [minValue, maxValue]
  );

  const onChangeEndHandler = useCallback(
    (newPosition) => {
      const value = positionToValue(newPosition);
      onChangeEnd?.(value);
    },
    [onChangeEnd, positionToValue]
  );
  const onChangeHandler = useCallback(
    (newPosition) => {
      const value = positionToValue(newPosition);
      const clampedValue = clampValue(value);
      onChange?.(clampedValue);
    },
    [onChange, positionToValue, clampValue]
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
  const { focusProps } = useFocus({
    isDisabled: false,
    onFocus: () => {
      if (!isDisable) {
        setFocused(true);
      }
    },
    onBlur: () => {
      if (!isDisable) {
        setFocused(false);
      }
    },
    onFocusChange: () => {
      if (!isDisable) {
      }
    },
  });
  const { pressProps } = usePress({
    onPress: () => {
      if (!isDisable) {
      }
    },
    onPressStart: () => {
      if (!isDisable) {
        setDragging(true);
      }
    },
    onPressEnd: () => {
      if (!isDisable) {
      }
    },
    onPressChange: () => {
      if (!isDisable) {
      }
    },
    onPressUp: () => {
      if (!isDisable) {
      }
    },
  });
  const { moveProps } = useMove({
    onMoveStart: () => {
      if (!isDisable) {
      }
    },
    onMove: (e) => {
      if (!isDisable) {
        let newPosition = { ...positionRef.current };
        if (e.pointerType === 'keyboard') {
          newPosition = clampPosition(newPosition);
        }
        newPosition.x += e.deltaX;
        newPosition.y += e.deltaY;
        positionRef.current = newPosition;
        onChangeHandler(newPosition);
      }
    },
    onMoveEnd: () => {
      if (!isDisable) {
        let newPosition = { ...positionRef.current };
        newPosition = clampPosition(newPosition);
        positionRef.current = newPosition;
        onChangeEndHandler(newPosition);
        setDragging(false);
      }
    },
  });

  const thumbProps = mergeProps(
    thumbHoverProps,
    focusProps,
    pressProps,
    moveProps
  );

  useLayoutEffect(() => {
    const position = positionRef.current;
    const clampedPosition = clampPosition(position);
    thumbRef.current.style.setProperty('left', `${clampedPosition.x}px`);
    thumbRef.current.style.setProperty('top', `${clampedPosition.y}px`);
  }, [value, clampPosition]);
  useLayoutEffect(() => {
    // think: what if value is over or under limits?
    const position = valueToPosition();
    positionRef.current = position;
    thumbRef.current.style.setProperty('left', `${position.x}px`);
    thumbRef.current.style.setProperty('top', `${position.y}px`);
  }, []);

  return (
    <div className={cx('slidertwo')} id={id} aria-label={name} role={'group'}>
      <div
        {...trackHoverProps}
        {...(!isDisable && trackIsHovered && { 'data-hovered': 'true' })}
        {...(isDisable && { 'data-disabled': 'true' })}
        className={cx('slidertwo__track', { className })}
        data-theme={theme}
        style={{ position: 'relative', touchAction: 'none' }}
        ref={trackRef}
      >
        <div
          className={cx('slidertwo__thumb')}
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
        />
      </div>
    </div>
  );
};

export default SliderTwo;
