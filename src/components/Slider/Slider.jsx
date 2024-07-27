import { useCallback, useContext } from 'react';

import {
  Label as AriaLabel,
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
} from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Slider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Slider = ({
  ariaLabel: name = '',
  minValue = 0,
  maxValue = 100,
  step = 1,
  value = 50,
  orientation = 'horizontal',
  isDisable = false,
  onChangeEnd = null,
  onChange = null,
  className = '',
}) => {
  const { theme } = useContext(ThemeContext);

  const onChangeEndHandler = useCallback(
    (newValue) => {
      onChangeEnd?.(newValue);
    },
    [onChangeEnd]
  );

  const onChangeHandler = useCallback(
    (newValue) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  const normalizedValue = useCallback(() => {
    const nomalizedValue = (value - minValue) / (maxValue - minValue);
    return nomalizedValue;
  }, [maxValue, minValue, value]);

  return (
    <AriaSlider
      aria-label={name}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      value={value}
      orientation={orientation}
      isDisable={isDisable}
      onChangeEnd={onChangeEndHandler}
      onChange={onChangeHandler}
      className={cx('slider', { className })}
      data-theme={theme}
      style={{ '--normalized-value': normalizedValue() }}
    >
      <AriaSliderTrack className={cx('slider__track')}>
        <AriaSliderThumb className={cx('slider__thumb')} />
      </AriaSliderTrack>
    </AriaSlider>
  );
};

export default Slider;
