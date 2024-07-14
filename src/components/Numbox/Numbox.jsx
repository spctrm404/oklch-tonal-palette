import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clamp,
  matchDigitToStep,
  setMultipleOfStep,
} from '../../utils/numberUtils';
import style from './Numbox.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Numbox = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  ch = 6,
  onChange = null,
  className = null,
}) => {
  const [localValue, setLocalValue] = useState(matchDigitToStep(value, step));
  const numboxRef = useRef(null);
  const decBtnRef = useRef(null);
  const incBtnRef = useRef(null);

  const handleChangeInput = useCallback((e) => {
    setLocalValue(e.currentTarget.value);
  }, []);

  const handleBlurInput = useCallback(
    (e) => {
      const newValue = clamp(Number(e.currentTarget.value), min, max);
      const steppedValue = setMultipleOfStep(newValue, step);
      onChange?.({ value: steppedValue, min: min, max: max });
    },
    [min, max, step, onChange]
  );

  const handleDecButtonClick = useCallback(() => {
    const newValue = clamp(value - step, min, max);
    const steppedValue = setMultipleOfStep(newValue, step);
    onChange?.({ value: steppedValue, min: min, max: max });
  }, [value, min, max, step, onChange]);

  const handleIncButtonClick = useCallback(() => {
    const newValue = clamp(value + step, min, max);
    const steppedValue = setMultipleOfStep(newValue, step);
    onChange?.({ value: steppedValue, min: min, max: max });
  }, [value, min, max, step, onChange]);

  useEffect(() => {
    const numbox = numboxRef.current;
    numbox.style.setProperty(`--ch`, ch);
  }, [ch]);

  useEffect(() => {
    setLocalValue(matchDigitToStep(value, step));
  }, [value, step]);

  useEffect(() => {
    const decBtn = decBtnRef.current;
    const incBtn = incBtnRef.current;

    decBtn.addEventListener('click', handleDecButtonClick);
    incBtn.addEventListener('click', handleIncButtonClick);

    return () => {
      decBtn.removeEventListener('click', handleDecButtonClick);
      incBtn.removeEventListener('click', handleIncButtonClick);
    };
  }, [handleDecButtonClick, handleIncButtonClick]);

  return (
    <div className={`${cx('numbox')} ${className || ''}`} ref={numboxRef}>
      <div
        className={`${cx('numbox__button', 'numbox__button--role-decrease')}`}
        ref={decBtnRef}
      >
        &#8722;
      </div>
      <input
        className={`${cx('numbox__field')}`}
        type="number"
        value={localValue}
        min={min}
        max={max}
        step={step}
        onChange={handleChangeInput}
        onBlur={handleBlurInput}
      />
      <div
        className={`${cx('numbox__button', 'numbox__button--role-increase')}`}
        ref={incBtnRef}
      >
        &#43;
      </div>
    </div>
  );
};

export default Numbox;
