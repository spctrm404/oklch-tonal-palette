import { useCallback, useContext } from 'react';
import { Switch as AriaSwitch } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Switch.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Switch = ({
  materialIcon = '',
  materialIconAlt = '',
  isSelected = false,
  onChange = () => {},
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const onChangeHandler = useCallback(
    (newBoolean) => {
      onChange?.(newBoolean);
    },
    [onChange]
  );

  return (
    <AriaSwitch
      className={cx('switch', 'switch__root', className)}
      isSelected={isSelected}
      onChange={onChangeHandler}
      data-theme={theme}
      {...props}
    >
      <div className={cx('switch__track', 'switch-track')}>
        <div className={cx('switch__track__shape', 'switch-track-shape')} />
        <div className={cx('switch__thumb', 'switch-thumb')}>
          <div className={cx('switch__thumb__state', 'switch-thumb-state')} />
          <div className={cx('switch__thumb__shape', 'switch-thumb-shape')}>
            {materialIcon && materialIconAlt && (
              <>
                <div
                  className={cx(
                    'switch__icon',
                    'switch__icon--part-a',
                    'material-symbols-outlined',
                    'switch-icon-a'
                  )}
                >
                  {materialIcon}
                </div>
                <div
                  className={cx(
                    'switch__icon',
                    'switch__icon--part-b',
                    'material-symbols-outlined',
                    'switch-icon-b'
                  )}
                >
                  {materialIconAlt}
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
