import { useCallback, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import * as RadixSlider from '@radix-ui/react-slider';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils';
import s from './_Slider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const Slider = ({
  value = [0],
  onChange: onValueChange = null,
  onValueCommit = null,
  name = '',
  disabled = false,
  vertical: orientation = 'horizontal',
  min = 0,
  max = 100,
  step = 1,
  thumbDirection: handleDirection = 0,
  trackClickable = false,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const onValueChangeHandler = useCallback(
    (numArray) => {
      onValueChange?.(numArray[0]);
    },
    [onValueChange]
  );
  const onValueCommitHandler = useCallback(
    (numArray) => {
      onValueCommit?.(numArray[0]);
    },
    [onValueCommit]
  );

  return (
    <RadixSlider.Root
      className={cx('slider', { className })}
      value={value}
      onValueChange={onValueChangeHandler}
      onValueCommit={onValueCommitHandler}
      name={name}
      disabled={disabled}
      orientation={orientation}
      min={min}
      max={max}
      step={step}
      data-theme={theme}
    >
      <RadixSlider.Track className={cx('slider-track')}></RadixSlider.Track>
      <RadixSlider.Thumb className={cx('slider-thumb')}>
        <span className={cx('slider-thumb-state')} />
        <span className={cx('slider-thumb-shape')} />
      </RadixSlider.Thumb>
    </RadixSlider.Root>
  );
};

export default Slider;
