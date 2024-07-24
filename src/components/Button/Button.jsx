import { useCallback, useContext, useEffect, useRef } from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import s from './_Button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const Button = ({
  onChange = null,
  style = 'filled',
  materialIcon = '',
  label = '',
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const buttonRef = useRef(null);

  const handleClick = useCallback(() => {
    onChange?.();
  }, [onChange]);

  const buttonPI = usePointerInteraction();
  useEffect(() => {
    buttonPI.setTargetRef(buttonRef.current);
    buttonPI.setOnPointerClick(handleClick);
  }, [buttonPI, handleClick]);

  return (
    <div
      className={`${cx('button')} ${className || ''}`}
      ref={buttonRef}
      data-theme={theme}
      data-state={buttonPI.getState()}
      data-style={style}
      data-has-icon={materialIcon !== ''}
      tabIndex={0}
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
    </div>
  );
};

export default Button;
