import { useCallback, useContext } from 'react';
import {
  NumberField as AriaNumberField,
  Label as AriaLabel,
  Group as AriaGroup,
  Input as AriaInput,
  Button as AriaButton,
} from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_NumberField.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const NumberField = ({ isDisable = false, className = '' }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <AriaNumberField
      defaultValue={1024}
      minValue={0}
      className={`${cx('button')} ${className || ''}`}
      data-theme={theme}
    >
      <AriaLabel>Width</AriaLabel>
      <AriaGroup>
        <AriaButton slot="decrement">-</AriaButton>
        <AriaInput />
        <AriaButton slot="increment">+</AriaButton>
      </AriaGroup>
    </AriaNumberField>
  );
};

export default NumberField;
