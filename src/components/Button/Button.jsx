import { useCallback, useContext, useRef } from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import s from './_Button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const Button = ({
  onChange = null,
  style = 'filled',
  icon = '',
  label = '',
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const buttonRef = useRef(null);

  const handleClick = useCallback(() => {
    onChange?.();
  }, [onChange]);

  const buttonPI = usePointerInteraction({
    targetRef: buttonRef,
    onPointerClick: handleClick,
  });

  return (
    <div
      className={`${cx('button')} ${className || ''}`}
      ref={buttonRef}
      data-theme={theme}
      data-state={buttonPI.getState()}
      data-style={style}
      data-has-icon={icon !== ''}
    >
      <div className={`${cx('button__shape')} "button-shape"`} />
      <div className={`${cx('button__state')} "button-state"`} />
      <div className={`${cx('button__content')} "button-content"`}>
        {icon && (
          <div
            className={`${cx('button__content__icon')} "button-content-icon"`}
          >
            {icon}
          </div>
        )}
        <div
          className={`${cx('button__content__label')} "button-content-label"`}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default Button;
