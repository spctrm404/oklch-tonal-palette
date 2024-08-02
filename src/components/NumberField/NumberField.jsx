import { useCallback, useContext, useLayoutEffect, useRef } from 'react';
import {
  NumberField as AriaNumberField,
  Group as AriaGroup,
  Input as AriaInput,
} from 'react-aria-components';
import IconButton from '../IconButton/IconButton.jsx';
import { disassembleDigits } from '../../utils/stringUtils.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_NumberField.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const NumberField = ({
  minValue = 0,
  maxValue = 100,
  step = 1,
  value = 50,
  onChange = () => {},
  isWheelDisabled = true,
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const innerValueRef = useRef(0);

  const setInnerValueByValue = useCallback(() => {
    console.log('setInnerVal');
    innerValueRef.current = value;
  }, [value]);

  const onChangeHandler = useCallback((newValue) => {
    console.log('onChange');
    innerValueRef.current = newValue;
  }, []);
  const onKeyDownHandler = useCallback(
    (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
        onChange?.(innerValueRef.current);
        if (e.key === 'Enter') {
          inputRef.current.blur();
        }
      }
    },
    [onChange]
  );
  const onBlurHandler = useCallback(() => {
    console.log('onBlur');
    onChange?.(innerValueRef.current);
  }, [onChange]);
  const onPressHandler = useCallback(() => {
    console.log('onPress');
    onChange?.(innerValueRef.current);
  }, [onChange]);

  useLayoutEffect(() => {
    setInnerValueByValue();
  }, [setInnerValueByValue]);

  const countDigits = useCallback(() => {
    const [minIntPart, minDecimalPart] = disassembleDigits(minValue);
    const [maxIntPart, maxDecimalPart] = disassembleDigits(maxValue);
    const [stepIntPart, stepDecimalPart] = disassembleDigits(step);
    const maxIntLength = Math.max(
      minIntPart.length,
      maxIntPart.length,
      stepIntPart.length
    );
    const maxDecimalLength = Math.max(
      minDecimalPart ? minDecimalPart.length + 1 : 0,
      maxDecimalPart ? maxDecimalPart.length + 1 : 0,
      stepDecimalPart ? stepDecimalPart.length + 1 : 0
    );
    return maxIntLength + maxDecimalLength;
  }, [minValue, maxValue, step]);

  return (
    <AriaNumberField
      className={cx('number-field', 'number-field__root', { className })}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      value={innerValueRef.current}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
      onBlur={onBlurHandler}
      isWheelDisabled={isWheelDisabled}
      data-theme={theme}
      ref={rootRef}
      style={{ '--min-ch': countDigits() }}
      {...props}
    >
      <AriaGroup className={cx('number-field__group')}>
        <AriaInput className={cx('number-field__input')} ref={inputRef} />
        <IconButton
          className={cx(
            'number-field__button',
            'number-field__button--part-decrease'
          )}
          materialIcon="remove"
          onPress={onPressHandler}
          slot="decrement"
        />
        <IconButton
          className={cx(
            'number-field__button',
            'number-field__button--part-increase'
          )}
          materialIcon="add"
          onPress={onPressHandler}
          slot="increment"
        />
      </AriaGroup>
    </AriaNumberField>
  );
};

export default NumberField;
