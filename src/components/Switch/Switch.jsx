import { useCallback, useContext, useRef } from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Switch.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Switch = ({
  state: value = false,
  onChange = () => {},
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const rootRef = useRef(null);

  const onChangeHandler = useCallback(
    (newValue) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  return (
    <AriaSwitch
      className={cx('switch', 'switch__root', className)}
      value={value}
      onChange={onChangeHandler}
      data-theme={theme}
      ref={rootRef}
      {...props}
    >
      <div className={cx('switch__track', className)}>
        <div className={cx('switch__track__shape', className)} />
        <div className={cx('switch__thumb', className)}>
          <div className={cx('switch__state', className)} />
          <div className={cx('switch__thumb__shape', className)} />
        </div>
      </div>
    </AriaSwitch>
  );
};

export default Switch;
