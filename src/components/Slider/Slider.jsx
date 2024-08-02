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
  slot = null,
  id = '',
  ariaLabel = '',
  ariaLabelledby = '',
  ariaDescribedby = '',
  ariaDetails = '',
  minValue = 0,
  maxValue = 100,
  step = 1,
  value = 50,
  orientation = 'horizontal',
  isDisable = false,
  onChangeEnd = () => {},
  onChange = () => {},
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
      className={cx('slider', 'slider__root', { className })}
      {...(slot && { slot: slot })}
      {...(id && { id: id })}
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      {...(ariaLabelledby && { 'aria-labelledby': ariaLabelledby })}
      {...(ariaDescribedby && { 'aria-describedby': ariaLabelledby })}
      {...(ariaDetails && { 'aria-details': ariaLabelledby })}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      value={value}
      orientation={orientation}
      isDisabled={isDisable}
      onChangeEnd={onChangeEndHandler}
      onChange={onChangeHandler}
      data-theme={theme}
      style={{ '--normalized-value': normalizedValue() }}
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
