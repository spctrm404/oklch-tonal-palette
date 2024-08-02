import { useCallback, useContext, useRef } from 'react';
import {
  NumberField as AriaNumberField,
  Group as AriaGroup,
  Input as AriaInput,
  Button as AriaButton,
} from 'react-aria-components';
import IconButton from '../IconButton/IconButton.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_NumberField.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const NumberField = ({
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
  isWheelDisable = true,
  isDisable = false,
  onChange = () => {},
  className = '',
}) => {
  const { theme } = useContext(ThemeContext);

  const onChangeHandler = useCallback(
    (newValue) => {
      console.log(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  return (
    <AriaNumberField
      className={cx('numberfield', 'numberfield__root', { className })}
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
      isWheelDisabled={isWheelDisable}
      isDisabled={isDisable}
      onChange={onChangeHandler}
      data-theme={theme}
    >
      <AriaGroup className={cx('numberfield__group')}>
        <AriaInput className={cx('numberfield__input')} />
        {/* <AriaButton
          className={cx(
            'numberfield__button',
            'numberfield__button--part-decrease'
          )}
          slot="decrement"
        >
          -
        </AriaButton>
        <AriaButton
          className={cx(
            'numberfield__button',
            'numberfield__button--part-increase'
          )}
          slot="increment"
        >
          +
        </AriaButton> */}
        <IconButton
          className={cx(
            'numberfield__button',
            'numberfield__button--part-decrease'
          )}
          materialIcon="remove"
          slot="decrement"
        />
        <IconButton
          className={cx(
            'numberfield__button',
            'numberfield__button--part-increase'
          )}
          materialIcon="add"
          slot="increment"
        />
      </AriaGroup>
    </AriaNumberField>
  );
};

export default NumberField;
