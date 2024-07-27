import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_XYSlider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const XYSlider = ({
  value = { x: 0, y: 0 },
  min = { x: 0, y: 0 },
  max = { x: 100, y: 100 },
  step = { x: 1, y: 1 },
  trackClickable = true,
  disabled = false,
  onChange = null,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const rootDomRef = useRef(null);
  const trackDomRef = useRef(null);
  const handleDomRef = useRef(null);

  const pointerOffset = useRef(null);

  const getNewValue = useCallback(
    (e) => {
      const offset = pointerOffset.current;
      const trackRect = trackDomRef.current.getBoundingClientRect();
      const handleRect = handleDomRef.current.getBoundingClientRect();

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
  const onPointerDragHandler = useCallback(
    (e) => {
      const newValue = getNewValue(e);
      onChange?.({ value: newValue, min: min, max: max });
    },
    [min, max, onChange, getNewValue]
  );
  const onPointerUpHandler = useCallback(() => {
    document.body.style.cursor = 'auto';
  }, []);
  const onPointerDown = useCallback(
    (e, offset) => {
      document.body.style.cursor = 'pointer';
      pointerOffset.current = offset;
      const newValue = getNewValue(e);
      onChange?.({ value: newValue, min: min, max: max });
    },
    [min, max, onChange, getNewValue]
  );
  const onPointerDownTrackHandler = useCallback(
    (e) => {
      const handleRect = handleDomRef.current.getBoundingClientRect();
      const offset = {
        x: 0.5 * handleRect.width,
        y: 0.5 * handleRect.height,
      };
      onPointerDown(e, offset);
    },
    [onPointerDown]
  );
  const onPointerDownHandleHandler = useCallback(
    (e) => {
      const handleRect = handleDomRef.current.getBoundingClientRect();
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
    trackPI.setTargetRef(trackDomRef.current);
    trackPI.setOnPointerDown(trackClickable ? onPointerDownTrackHandler : null);
    trackPI.setOnPointerDrag(trackClickable ? onPointerDragHandler : null);
    trackPI.setOnPointerUp(trackClickable ? onPointerUpHandler : null);
  }, [
    trackPI,
    trackClickable,
    onPointerDownTrackHandler,
    onPointerDragHandler,
    onPointerUpHandler,
  ]);
  const handlePI = usePointerInteraction();
  useEffect(() => {
    handlePI.setTargetRef(handleDomRef.current);
    handlePI.setOnPointerDown(onPointerDownHandleHandler);
    handlePI.setOnPointerDrag(onPointerDragHandler);
    handlePI.setOnPointerUp(onPointerUpHandler);
  }, [
    handlePI,
    onPointerDownHandleHandler,
    onPointerDragHandler,
    onPointerUpHandler,
  ]);

  useLayoutEffect(() => {
    trackPI.setDisabled(disabled);
    handlePI.setDisabled(disabled);
  }, [trackPI, handlePI, disabled]);
  useLayoutEffect(() => {
    const normalizedPos = {
      x: (value.x - min.x) / (max.x - min.x),
      y: (value.y - min.y) / (max.y - min.y),
    };
    rootDomRef.current.style.setProperty(`--x`, normalizedPos.x);
    rootDomRef.current.style.setProperty(`--y`, 1 - normalizedPos.y);
  }, [value, min, max]);

  return (
    <div
      className={`${cx(`xy-slider`)} ${className || ''}`}
      ref={rootDomRef}
      data-theme={theme}
      data-state={
        trackPI.getState() === 'pressed' ? 'pressed' : handlePI.getState()
      }
      data-is-track-clickable={trackClickable}
    >
      <div
        className={cx('xy-slider__track', 'xy-slider-track')}
        ref={trackDomRef}
      >
        <div
          className={cx('xy-slider__track__shape', 'xy-slider-track-shape')}
        />
        <div
          className={cx('xy-slider__handle', 'xy-slider-handle')}
          ref={handleDomRef}
          tabIndex={disabled ? -1 : 0}
        >
          <div
            className={cx('xy-slider__handle__state', 'xy-slider-handle-state')}
          />
          <div
            className={cx('xy-slider__handle__shape', 'xy-slider-handle-shape')}
          >
            <div
              className={cx(
                'xy-slider__handle__shape__tick',
                'xy-slider-handle-shape-tick'
              )}
            />
            <div
              className={cx(
                'xy-slider__handle__shape__tick',
                'xy-slider-handle-shape-tick'
              )}
            />
            <div
              className={cx(
                'xy-slider__handle__shape__tick',
                'xy-slider-handle-shape-tick'
              )}
            />
            <div
              className={cx(
                'xy-slider__handle__shape__tick',
                'xy-slider-handle-shape-tick'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default XYSlider;
