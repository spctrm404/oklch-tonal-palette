import { useCallback, useContext, useLayoutEffect, useRef } from 'react';
import {
  NumberField as AriaNumberField,
  Group as AriaGroup,
  Input as AriaInput,
} from 'react-aria-components';
import IconButton from '../IconButton/IconButton.jsx';
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

  const inputRef = useRef(null);

  const isChagedRef = useRef(false);
  const innerValueRef = useRef(value);

  const syncInnerValueToValue = useCallback(() => {
    innerValueRef.current = value;
    isChagedRef.current = false;
  }, [value]);

  const onChangeHandler = useCallback((newValue) => {
    const prevInnerValue = innerValueRef.current;
    innerValueRef.current = newValue;
    isChagedRef.current = prevInnerValue !== innerValueRef.current;
  }, []);
  const onKeyDownHandler = useCallback(
    (e) => {
      if (isChagedRef.current) onChange?.(innerValueRef.current);
      if (e.key === 'Enter') inputRef.current.blur();
    },
    [onChange]
  );
  const onBlurHandler = useCallback(() => {
    if (isChagedRef.current) onChange?.(innerValueRef.current);
  }, [onChange]);
  const onPressHandler = useCallback(() => {
    if (isChagedRef.current) onChange?.(innerValueRef.current);
  }, [onChange]);

  useLayoutEffect(() => {
    syncInnerValueToValue();
  }, [syncInnerValueToValue, props.isDisabled]);

  const digitLength = useCallback(() => {
    const [minIntegerPart, minDecimalPart] = minValue.toString().split('.');
    const [maxIntegerPart, maxDecimalPart] = maxValue.toString().split('.');
    const [stepIntegerPart, stepDecimalPart] = step.toString().split('.');
    const maxIntegerLength = Math.max(
      minIntegerPart.length,
      maxIntegerPart.length,
      stepIntegerPart.length
    );
    const maxDecimalLength = Math.max(
      minDecimalPart ? minDecimalPart.length + 1 : 0,
      maxDecimalPart ? maxDecimalPart.length + 1 : 0,
      stepDecimalPart ? stepDecimalPart.length + 1 : 0
    );
    return maxIntegerLength + maxDecimalLength;
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
      onBlur={onBlurHandler}
      isWheelDisabled={isWheelDisabled}
      data-theme={theme}
      style={{ '--min-ch': digitLength() }}
      {...props}
    >
      <AriaGroup className={cx('number-field__group', 'number-field-group')}>
        <AriaInput
          className={cx('number-field__input', 'number-field-input')}
          ref={inputRef}
        />
        <div
          className={cx(
            'number-field__input__shape',
            'number-field-intput-shape'
          )}
        />
        <div
          className={cx(
            'number-field__input__state',
            'number-field-input-shape'
          )}
        />
        <IconButton
          className={cx(
            'number-field__button',
            'number-field__button--part-decrease',
            'number-field-button-decrease'
          )}
          buttontype={'tonal'}
          materialIcon={'remove'}
          onPress={onPressHandler}
          slot={'decrement'}
        />
        <IconButton
          className={cx(
            'number-field__button',
            'number-field__button--part-increase',
            'number-field-button-increase'
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
