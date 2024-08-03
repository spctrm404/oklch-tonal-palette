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

  const isChagedRef = useRef(false);
  const innerValueRef = useRef(0);

  const syncInnerValueToValue = useCallback(() => {
    console.log('setInnerVal');
    innerValueRef.current = value;
    isChagedRef.current = false;
  }, [value]);

  const onChangeHandler = useCallback((newValue) => {
    console.log('onChange');
    const prevInnerValue = innerValueRef.current;
    innerValueRef.current = newValue;
    isChagedRef.current = prevInnerValue !== innerValueRef.current;
  }, []);
  const onKeyDownHandler = useCallback(
    (e) => {
      console.log('onKeyDown');
      console.log(inputRef.current);
      if (isChagedRef.current) onChange?.(innerValueRef.current);
      if (e.key === 'Enter') inputRef.current.blur();
    },
    [onChange]
  );
  const onFocusHandler = useCallback(() => {
    console.log('onFocus');
  }, []);
  const onBlurHandler = useCallback(() => {
    console.log('onBlur');
    if (isChagedRef.current) onChange?.(innerValueRef.current);
  }, [onChange]);
  const onPressHandler = useCallback(() => {
    console.log('onPress');
    if (isChagedRef.current) onChange?.(innerValueRef.current);
  }, [onChange]);

  useLayoutEffect(() => {
    syncInnerValueToValue();
  }, [syncInnerValueToValue]);

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
      className={cx('number-field', 'number-field__root', className)}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      value={innerValueRef.current}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      isWheelDisabled={isWheelDisabled}
      data-theme={theme}
      ref={rootRef}
      style={{ '--min-ch': countDigits() }}
      {...props}
    >
      <AriaGroup className={cx('number-field__group')}>
        <AriaInput className={cx('number-field__input')} ref={inputRef} />
        <div className={cx('number-field__input__shape')} />
        <div className={cx('number-field__input__state')} />
        <IconButton
          className={cx(
            'number-field__button',
            'number-field__button--part-decrease'
          )}
          buttontype={'tonal'}
          materialIcon={'remove'}
          onPress={onPressHandler}
          slot={'decrement'}
        />
        <IconButton
          className={cx(
            'number-field__button',
            'number-field__button--part-increase'
          )}
          buttontype={'tonal'}
          materialIcon={'add'}
          onPress={onPressHandler}
          slot={'increment'}
        />
      </AriaGroup>
    </AriaNumberField>
  );
};

export default NumberField;
