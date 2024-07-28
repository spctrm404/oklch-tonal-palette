import { useCallback, useEffect, useRef, useState } from 'react';
import { mergeProps, useFocus, useHover, useMove, usePress } from 'react-aria';
import { clamp } from '../../utils/numberUtils';
import st from './_SliderTwo.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const SliderTwo = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trackSize, setTrackSize] = useState({ x: 0, y: 0 });
  const [thumbSize, setThumbSize] = useState({ x: 0, y: 0 });
  const [isDragging, setDragging] = useState(false);
  const [isFocused, setFocused] = useState(false);

  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const clampPosition = useCallback(
    (positionValue, key) => {
      return clamp(
        positionValue,
        -0.5 * thumbSize[key],
        trackSize[key] - 0.5 * thumbSize[key]
      );
    },
    [trackSize, thumbSize]
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
  const { moveProps } = useMove({
    onMoveStart: () => {},
    onMove: (e) => {
      setPosition(({ x, y }) => {
        if (e.pointerType === 'keyboard') {
          x = clampPosition(x, 'x');
          y = clampPosition(y, 'y');
        }
        x += e.deltaX;
        y += e.deltaY;
        return { x, y };
      });
    },
    onMoveEnd: () => {
      setDragging(false);
      setPosition(({ x, y }) => {
        x = clampPosition(x, 'x');
        y = clampPosition(y, 'y');
        return { x, y };
      });
    },
  });

  useEffect(() => {
    const trackRect = trackRef.current.getBoundingClientRect();
    const thumbRect = thumbRef.current.getBoundingClientRect();
    setTrackSize({ x: trackRect.width, y: trackRect.height });
    setThumbSize({ x: thumbRect.width, y: thumbRect.height });
    // setPosition(({ x, y }) => {
    //   x = clamp(
    //     x,
    //     -0.5 * thumbRect.width,
    //     trackRect.width - 0.5 * thumbRect.width
    //   );
    //   y = clamp(
    //     y,
    //     -0.5 * thumbRect.height,
    //     trackRect.height - 0.5 * thumbRect.height
    //   );
    //   return { x, y };
    // });
  }, []);

  const thumbProps = mergeProps(
    thumbHoverProps,
    focusProps,
    pressProps,
    moveProps
  );

  return (
    <div className={cx('slidertwo')}>
      <div
        {...trackHoverProps}
        {...(trackIsHovered && { 'data-hovered': 'true' })}
        className={cx('slidertwo__track')}
        style={{ position: 'relative', touchAction: 'none' }}
        ref={trackRef}
      >
        <div
          className={cx('slidertwo__thumb')}
          {...thumbProps}
          {...(thumbIsHovered && { 'data-hovered': 'true' })}
          {...(isDragging && { 'data-dragging': 'true' })}
          {...(isFocused && { 'data-focused': 'true' })}
          tabIndex={0}
          style={{
            position: 'absolute',
            left: clampPosition(position.x, 'x'),
            top: clampPosition(position.y, 'y'),
            touchAction: 'none',
          }}
          ref={thumbRef}
        />
      </div>
    </div>
  );
};
export default SliderTwo;
