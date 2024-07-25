import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import IconButton from '../IconButton/IconButton.jsx';
import usePointerInteraction from '../../hooks/usePointerInteraction';
import { clamp, setMultipleOfStep } from '../../utils/numberUtils';
import { formatNumLengthToStep } from '../../utils/stringUtils';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import s from './NumberBox.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const NumberBox = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  displayLength = 6,
  disabled = false,
  onChange = null,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const [localValue, setLocalValue] = useState(
    formatNumLengthToStep(value, step)
  );
  const numberBoxRef = useRef(null);
  const inputNumberRef = useRef(null);

  const handleChangeInputNumber = useCallback((e) => {
    setLocalValue(e.currentTarget.value);
  }, []);

  const handlePointerDownInputNumber = useCallback(() => {
    inputNumberRef.current.focus();
  }, []);

  const handleBlurInputNumber = useCallback(
    (e) => {
      console.log(e);
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

  useLayoutEffect(() => {
    const inputnumber = numberBoxRef.current;
    inputnumber.style.setProperty(`--ch`, displayLength);
  }, [displayLength]);

  useLayoutEffect(() => {
    setLocalValue(formatNumLengthToStep(value, step));
  }, [value, step]);

  const inputNumberPI = usePointerInteraction();
  useEffect(() => {
    inputNumberPI.setTargetRef(inputNumberRef.current);
    inputNumberPI.setOnPointerDown(handlePointerDownInputNumber);

    inputNumberPI.setOnBlur(handleBlurInputNumber);
  }, [inputNumberPI, handlePointerDownInputNumber, handleBlurInputNumber]);

  return (
    <div
      className={`${cx('inputnumber')} ${className || ''}`}
      ref={numberBoxRef}
    >
      <input
        className={`${cx('inputnumber__field')} inputnumber-field`}
        type="number"
        value={localValue}
        min={min}
        max={max}
        step={step}
        ref={inputNumberRef}
        onChange={handleChangeInputNumber}
      />
      <IconButton
        style="standard"
        materialIcon="remove"
        onChange={handleDecButtonClick}
      />
      <IconButton
        style="standard"
        materialIcon="add"
        onChange={handleIncButtonClick}
      />
    </div>
  );
};

export default NumberBox;
