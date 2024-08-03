// todo: change style on keypressed

import { useCallback, useContext } from 'react';

import {
  Slider as AriaSlider,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
} from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Slider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Slider = ({
  minValue = 0,
  maxValue = 100,
  step = 1,
  value = 50,
  onChangeEnd = () => {},
  onChange = () => {},
  className = '',
  ...props
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
      className={cx('slider', 'slider__root', className)}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      value={value}
      onChangeEnd={onChangeEndHandler}
      onChange={onChangeHandler}
      data-theme={theme}
      style={{ '--normalized-value': normalizedValue() }}
      {...props}
    >
      <AriaSliderTrack className={cx('slider__track')}>
        <div
          className={cx(
            'slider__track__shape',
            'slider__track__shape--part-active'
          )}
        />
        <div
          className={cx(
            'slider__track__shape',
            'slider__track__shape--part-inactive'
          )}
        />
        <AriaSliderThumb className={cx('slider__thumb')}>
          <div className={cx('slider__state')} />
          <div className={cx('slider__thumb__shape')} />
        </AriaSliderThumb>
      </AriaSliderTrack>
    </AriaSlider>
  );
};

export default Slider;
