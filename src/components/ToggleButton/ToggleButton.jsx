import { useCallback, useContext } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_NumberField.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const ToggleButton = ({ isDisable = false, className = '' }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <AriaToggleButton
      className={`${cx('button')} ${className || ''}`}
      data-theme={theme}
    >
      Pin
    </AriaToggleButton>
  );
};

export default ToggleButton;
