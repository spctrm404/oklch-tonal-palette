import { useCallback, useContext, useRef } from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Switch.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Switch = ({
  materialIconA = '',
  materialIconB = '',
  value = false,
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
      <div className={cx('switch__track')}>
        <div className={cx('switch__track__shape')} />
        <div className={cx('switch__thumb')}>
          <div className={cx('switch__state')} />
          <div className={cx('switch__thumb__shape')}>
            {materialIconA && materialIconB && (
              <>
                <div
                  className={cx(
                    'switch__icon',
                    'switch__icon--part-a',
                    'material-symbols-outlined'
                  )}
                >
                  {materialIconA}
                </div>
                <div
                  className={cx(
                    'switch__icon',
                    'switch__icon--part-b',
                    'material-symbols-outlined'
                  )}
                >
                  {materialIconB}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AriaSwitch>
  );
};

export default Switch;
