import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trackSize, setTrackSize] = useState({ x: 0, y: 0 });
  const [thumbSize, setThumbSize] = useState({ x: 0, y: 0 });
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
    onFocus: () => {},
    onBlur: () => {},
    onFocusChange: () => {},
  });

  const { pressProps } = usePress({
    onPress: () => {},
    onPressStart: () => {},
    onPressEnd: () => {},
    onPressChange: () => {},
    onPressUp: () => {},
  });

  const clampPosition = useCallback(
    (position) => {
      return {
        x: clamp(
          position.x,
          -0.5 * thumbSize.x,
          trackSize.x - 0.5 * thumbSize.x
        ),
        y: clamp(
          position.y,
          -0.5 * thumbSize.y,
          trackSize.y - 0.5 * thumbSize.y
        ),
      };
    },
    [trackSize, thumbSize]
  );

  const { moveProps } = useMove({
    onMoveStart: () => {},
    onMove: (e) => {
      setPosition((prevPosition) => {
        let newPosition = { ...prevPosition };
        if (e.pointerType === 'keyboard') {
          newPosition = clampPosition(newPosition);
        }
        newPosition.x += e.deltaX;
        newPosition.y += e.deltaY;
        return newPosition;
      });
      onChangeHandler();
    },
    onMoveEnd: () => {
      setPosition((prevPosition) => {
        let newPosition = { ...prevPosition };
        newPosition = clampPosition(newPosition);
        return newPosition;
      });
      onChangeEndHandler();
    },
  });

  const thumbProps = mergeProps(
    thumbHoverProps,
    focusProps,
    pressProps,
    moveProps
  );

  useEffect(() => {
    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();

    setTrackSize({ x: trackRect.width, y: trackRect.height });
    setThumbSize({ x: thumbRect.width, y: thumbRect.height });
  }, []);

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
          tabIndex={0}
          style={{
            position: 'absolute',
            touchAction: 'none',
            left: clampPosition(position).x,
            top: clampPosition(position).y,
          }}
          ref={thumbRef}
        />
      </div>
    </div>
  );
};

export default SliderTwo;
