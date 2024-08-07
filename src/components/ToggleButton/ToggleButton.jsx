import { useCallback, useContext } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_ToggleButton.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const ToggleButton = ({
  buttontype = 'standard',
  materialIconA: materialIcon = '',
  materialIconB: materialIconAlt = '',
  isSelected = null,
  onChange = () => {},
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const onChangeHandler = useCallback(
    (newValue) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  return (
    <AriaToggleButton
      className={cx('toggle-button', 'toggle-button__root', className)}
      data-button-type={buttontype}
      isSelected={isSelected}
      onChange={onChangeHandler}
      data-theme={theme}
      {...props}
    >
      <div
        className={cx(
          'toggle-button__shape',
          'toggle-button__shape--part-bg',
          'toggle-button'
        )}
      />
      <div className={cx('toggle-button__state', 'toggle-button-state')} />
      <div className={cx('toggle-button__content', 'toggle-button-content')}>
        <div
          className={cx(
            'toggle-button__content__icon',
            'toggle-button__content__icon--part-a',
            'material-symbols-outlined',
            'toggle-button-icon'
          )}
        >
          {materialIcon}
        </div>
        {materialIconAlt && (
          <div
            className={cx(
              'toggle-button__content__icon',
              'toggle-button__content__icon--part-b',
              'material-symbols-outlined',
              'toggle-button-icon-alt'
            )}
          >
            {materialIconAlt}
          </div>
        )}
      </div>
      <div
        className={cx(
          'toggle-button__shape',
          'toggle-button__shape--part-fg',
          'toggle-button-fg'
        )}
      />
    </AriaToggleButton>
  );
};

export default ToggleButton;
