import { useCallback, useContext } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Button = ({
  buttontype = 'text',
  materialIcon = '',
  text = '',
  onPress = () => {},
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const onPressHandler = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <AriaButton
      className={cx('button', 'button__root', className)}
      data-button-type={buttontype}
      {...(materialIcon && { 'data-has-icon': materialIcon })}
      onPress={onPressHandler}
      data-theme={theme}
      {...props}
    >
      <div
        className={cx('button__shape', 'button__shape--part-bg', 'button-bg')}
      />
      <div className={cx('button__state', 'button-state')} />
      <div className={cx('button__content', 'button-content')}>
        {materialIcon && (
          <div
            className={cx(
              'button__content__icon',
              'material-symbols-outlined',
              'button-icon'
            )}
          >
            {materialIcon}
          </div>
        )}
        <div className={cx('button__content__text', 'button-text')}>{text}</div>
      </div>
      <div
        className={cx('button__shape', 'button__shape--part-fg', 'button-fg')}
      />
    </AriaButton>
  );
};

export default Button;
