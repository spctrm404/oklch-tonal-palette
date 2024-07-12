import { useCallback, useEffect, useRef } from 'react';
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
  onChange = null,
  className = null,
}) => {
  const decBtnRef = useRef(null);
  const incBtnRef = useRef(null);

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
    <div className={`${cx('numbox')}`}>
      <div
        className={`${cx('numbox__button', 'numbox__button--role-decrease')}`}
        ref={decBtnRef}
      >
        &#8722;
      </div>
      <div className={`${cx('numbox__field')}`}>
        {matchDigitToStep(value, step)}
      </div>
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
