import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils';
import { formatNumLengthToStep } from '../../utils/stringUtils';
import s from './Inputnumber.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const Inputnumber = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  displayLength = 6,
  onChange = null,
  className = null,
}) => {
  const [localValue, setLocalValue] = useState(
    formatNumLengthToStep(value, step)
  );
  const inputnumberRef = useRef(null);
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
    const inputnumber = inputnumberRef.current;
    inputnumber.style.setProperty(`--ch`, displayLength);
  }, [displayLength]);

  useEffect(() => {
    setLocalValue(formatNumLengthToStep(value, step));
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
    <div
      className={`${cx('inputnumber')} ${className || ''}`}
      ref={inputnumberRef}
    >
      <input
        className={`${cx('inputnumber__field')} inputnumber-field`}
        type="number"
        value={localValue}
        min={min}
        max={max}
        step={step}
        onChange={handleChangeInput}
        onBlur={handleBlurInput}
      />
      <div
        className={`${cx(
          'inputnumber__button',
          'inputnumber__button--role-decrease'
        )} inputnumber-decrease-button`}
        ref={decBtnRef}
      >
        &#8722;
      </div>
      <div
        className={`${cx(
          'inputnumber__button',
          'inputnumber__button--role-increase'
        )} inputnumber-increase-button`}
        ref={incBtnRef}
      >
        &#43;
      </div>
    </div>
  );
};

export default Inputnumber;
