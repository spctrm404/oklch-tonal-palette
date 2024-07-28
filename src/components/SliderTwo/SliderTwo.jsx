import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { mergeProps, useFocus, useHover, useMove, usePress } from 'react-aria';
import { clamp } from '../../utils/numberUtils';
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
  // const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setDragging] = useState(false);
  const [isFocused, setFocused] = useState(false);

  const positionRef = useRef({ x: 0, y: 0 });

  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const onChangeEndHandler = useCallback(
    (newValue) => {
      // onChangeEnd?.(newValue);
    },
    [onChangeEnd]
  );

  const onChangeHandler = useCallback(
    (newValue) => {
      // onChange?.(newValue);
    },
    [onChange]
  );

  const { hoverProps: trackHoverProps, isHovered: trackIsHovered } = useHover({
    onHoverStart: () => {},
    onHoverEnd: () => {},
    onHoverChange: () => {},
  });

  const { hoverProps: thumbHoverProps, isHovered: thumbIsHovered } = useHover({
    onHoverStart: () => {},
    onHoverEnd: () => {},
    onHoverChange: () => {},
  });

  const { focusProps } = useFocus({
    isDisabled: false,
    onFocus: () => {
      setFocused(true);
    },
    onBlur: () => {
      setFocused(false);
    },
    onFocusChange: () => {},
  });

  const { pressProps } = usePress({
    onPress: () => {},
    onPressStart: () => {
      setDragging(true);
    },
    onPressEnd: () => {},
    onPressChange: () => {},
    onPressUp: () => {},
  });

  const clampPositionAlt = useCallback((position) => {
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

  const { moveProps } = useMove({
    onMoveStart: () => {},
    onMove: (e) => {
      let newPosition = { ...positionRef.current };
      if (e.pointerType === 'keyboard') {
        newPosition = clampPositionAlt(newPosition);
      }
      newPosition.x += e.deltaX;
      newPosition.y += e.deltaY;
      positionRef.current = newPosition;
      onChangeHandler();
    },
    onMoveEnd: () => {
      let newPosition = { ...positionRef.current };
      newPosition = clampPositionAlt(newPosition);
      positionRef.current = newPosition;
      onChangeEndHandler();
      setDragging(false);
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
    const clampedPosition = clampPositionAlt(position);
    thumbRef.current.style.setProperty('left', `${clampedPosition.x}px`);
    thumbRef.current.style.setProperty('top', `${clampedPosition.y}px`);
  }, [positionRef, clampPositionAlt]);

  return (
    <div className={cx('slidertwo')}>
      <div
        {...trackHoverProps}
        {...(trackIsHovered && { 'data-hovered': 'true' })}
        {...(isDisable && { 'data-disabled': 'true' })}
        className={cx('slidertwo__track', { className })}
        style={{ position: 'relative', touchAction: 'none' }}
        ref={trackRef}
      >
        <div
          className={cx('slidertwo__thumb')}
          {...thumbProps}
          {...(thumbIsHovered && { 'data-hovered': 'true' })}
          {...(isDragging && { 'data-dragging': 'true' })}
          {...(isFocused && { 'data-focused': 'true' })}
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
