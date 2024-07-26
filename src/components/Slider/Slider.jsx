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
import st from './_Slider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Slider = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  vertical = false,
  thumbDirection: handleDirection = 0,
  trackClickable = false,
  disabled = false,
  onChange = null,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const rootDom = useRef(null);
  const trackDom = useRef(null);
  const handleDom = useRef(null);

  const pointerOffset = useRef(null);

  const getNewValue = useCallback(
    (e) => {
      const offset = pointerOffset.current;
      const handleRect = handleDom.current.getBoundingClientRect();
      const trackRect = trackDom.current.getBoundingClientRect();

      let newHandlePos;
      let normalizedPos;
      let newValue;

      if (vertical) {
        newHandlePos = e.clientY - trackRect.top - offset.y;
        newHandlePos = clamp(
          newHandlePos,
          0,
          trackRect.height - handleRect.height
        );
        normalizedPos =
          1 - newHandlePos / (trackRect.height - handleRect.height);
        newValue = min + (max - min) * normalizedPos;
      } else {
        newHandlePos = e.clientX - trackRect.left - offset.x;
        newHandlePos = clamp(
          newHandlePos,
          0,
          trackRect.width - handleRect.width
        );
        normalizedPos = newHandlePos / (trackRect.width - handleRect.width);
        newValue = min + (max - min) * normalizedPos;
      }

      newValue = setMultipleOfStep(newValue, step);

      return newValue;
    },
    [min, max, step, vertical]
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
      const thumbRect = handleDom.current.getBoundingClientRect();
      const offset = {
        x: 0.5 * thumbRect.width,
        y: 0.5 * thumbRect.height,
      };
      onPointerDown(e, offset);
    },
    [onPointerDown]
  );

  const onPointerDownHandleHandler = useCallback(
    (e) => {
      const thumbRect = handleDom.current.getBoundingClientRect();
      const offset = {
        x: e.clientX - thumbRect.left,
        y: e.clientY - thumbRect.top,
      };
      onPointerDown(e, offset);
    },
    [onPointerDown]
  );

  const trackPI = usePointerInteraction();
  useEffect(() => {
    trackPI.setTargetRef(trackDom.current);
    trackPI.setOnPointerDown(trackClickable ? onPointerDownTrackHandler : null);
    trackPI.setOnPointerDrag(trackClickable ? onPointerDragHandler : null);
    trackPI.setOnPointerUp(trackClickable ? onPointerUpHandler : null);
    trackPI.setOnPointerClick(null, false);
  }, [
    trackPI,
    trackClickable,
    onPointerDownTrackHandler,
    onPointerDragHandler,
    onPointerUpHandler,
  ]);
  const handlePI = usePointerInteraction();
  useEffect(() => {
    handlePI.setTargetRef(handleDom.current);
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

  useEffect(() => {
    const normalizedPos = (value - min) / (max - min);
    rootDom.current.style.setProperty(`--pos`, normalizedPos);
  }, [value, min, max, step, vertical]);

  return (
    <div
      className={`${cx('slider')} ${className || ''}`}
      ref={rootDom}
      data-theme={theme}
      data-orientation={vertical ? 'vertical' : 'horizontal'}
      data-state={
        trackPI.getState() === 'pressed' ? 'pressed' : handlePI.getState()
      }
      data-is-track-clickable={trackClickable}
    >
      <div className={cx('slider__track', 'slider-track')} ref={trackDom}>
        <div className={cx('slider__track__shape', 'slider-track-shape')}>
          <div
            className={cx(
              'slider__track__shape__indicator',
              'slider__track__shape__indicator--type-active',
              'slider-track-shape-indicator-active'
            )}
          />
          <div
            className={cx(
              'slider__track__shape__indicator',
              'slider__track__shape__indicator--type-inactive',
              'slider-track-shape-indicator-inactive'
            )}
          />
        </div>
        <div
          className={cx('slider__handle', 'slider-handle')}
          ref={handleDom}
          tabIndex={0}
        >
          <div className={cx('slider__handle__state', 'slider-handle-state')} />
          <div className={cx('slider__handle__shape', 'slider-handle-shape')} />
        </div>
      </div>
    </div>
  );
};

export default Slider;
