import { useCallback, useContext } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Button = ({
  name = '',
  buttontype = 'text',
  materialIcon = 'add',
  label = '',
  isDisable = false,
  onPress = () => {},
  className = '',
}) => {
  const { theme } = useContext(ThemeContext);

  const onPressHandler = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <AriaButton
      name={name}
      className={`${cx('button')} ${className || ''}`}
      data-theme={theme}
      data-has-icon={materialIcon !== ''}
      data-type={buttontype}
      onPress={onPressHandler}
    >
      <div className={cx('button__shape', 'button-shape')} />
      <div className={cx('button__state', 'button-state')} />
      <div className={cx('button__content', 'button-content')}>
        {materialIcon && (
          <div
            className={cx(
              'button__content__icon',
              'button-content-icon',
              'material-symbols-outlined'
            )}
          >
            {materialIcon}
          </div>
        )}
        <div className={cx('button__content__label', 'button-content-label')}>
          {label}
        </div>
      </div>
    </AriaButton>
  );
};

export default Button;
