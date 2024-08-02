import { useContext, useRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Button = ({
  buttontype = 'text',
  materialIcon = '',
  label = '',
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const rootRef = useRef(null);

  return (
    <AriaButton
      className={cx('button', 'button__root', { className })}
      data-button-type={buttontype}
      {...(materialIcon && { 'data-has-icon': materialIcon })}
      data-theme={theme}
      ref={rootRef}
      {...props}
    >
      <div
        className={cx(
          'button__root__shape',
          'button__root__shape--part-background'
        )}
      />
      <div className={cx('button__state')} />
      <div className={cx('button__content')}>
        {materialIcon && (
          <div
            className={cx('button__content__icon', 'material-symbols-outlined')}
          >
            {materialIcon}
          </div>
        )}
        <div className={cx('button__content__label')}>{label}</div>
        <div
          className={cx(
            'button__root__shape',
            'button__root__shape--part-foreground'
          )}
        />
      </div>
    </AriaButton>
  );
};

export default Button;
