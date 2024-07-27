import { useCallback, useContext, useLayoutEffect, useRef } from 'react';

import {
  Label as AriaLabel,
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
} from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Slider2D.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Slider2D = ({
  ariaLabel: name = '',
  minValue = { x: 0, y: 0 },
  maxValue = { x: 100, y: 100 },
  step = { x: 1, y: 1 },
  value = { x: 50, y: 50 },
  isDisable = false,
  onChangeEnd = null,
  onChange = null,
  className = '',
}) => {
  const { theme } = useContext(ThemeContext);

  const rootRef = useRef(null);

  const onChangeEndHandler = useCallback(
    (key, newValue) => {
      onChangeEnd?.({
        ...value,
        [key]: newValue,
      });
    },
    [value, onChangeEnd]
  );
  const onChangeHandler = useCallback(
    (key, newValue) => {
      onChange?.({
        ...value,
        [key]: newValue,
      });
    },
    [value, onChange]
  );

  useLayoutEffect(() => {
    const normalizedPos = { x: 0, y: 0 };
    for (const key in normalizedPos) {
      normalizedPos[key] =
        (value[key] - minValue[key]) / (maxValue[key] - minValue[key]);
      rootRef.current.style.setProperty(`--${key}`, normalizedPos[key]);
    }
  }, [value, minValue, maxValue]);

  return (
    <div className={cx('slider2d', { className })} ref={rootRef}>
      <AriaSlider
        aria-label={`${name} axis x`}
        minValue={minValue.x}
        maxValue={maxValue.x}
        step={step.x}
        value={value.x}
        isDisable={isDisable}
        onChangeEnd={(val) => {
          onChangeEndHandler('x', val);
        }}
        onChange={(val) => {
          onChangeHandler('x', val);
        }}
        className={cx('slider2d__slider', 'slider2d__slider--axis-x')}
        data-theme={theme}
      >
        <AriaSliderTrack className={cx('slider2d__track')}>
          <AriaSliderThumb className={cx('slider2d__thumb')} />
        </AriaSliderTrack>
      </AriaSlider>
      <AriaSlider
        aria-label={`${name} axis y`}
        minValue={minValue.y}
        maxValue={maxValue.y}
        step={step.y}
        value={value.y}
        orientation={'vertical'}
        isDisable={isDisable}
        onChangeEnd={(val) => {
          onChangeEndHandler('y', val);
        }}
        onChange={(val) => {
          onChangeHandler('y', val);
        }}
        className={cx('slider2d__slider', 'slider2d__slider--axis-y')}
        data-theme={theme}
      >
        <AriaSliderTrack className={cx('slider2d__track')}>
          <AriaSliderThumb className={cx('slider2d__thumb')} />
        </AriaSliderTrack>
      </AriaSlider>
    </div>
  );
};

export default Slider2D;
