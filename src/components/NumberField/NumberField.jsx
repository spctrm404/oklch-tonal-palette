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
  minValue = 0,
  maxValue = 100,
  step = 1,
  value = 50,
  isWheelDisabled = true,
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <AriaNumberField
      className={cx('numberfield', 'numberfield__root', { className })}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      value={value}
      isWheelDisabled={isWheelDisabled}
      data-theme={theme}
      {...props}
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
