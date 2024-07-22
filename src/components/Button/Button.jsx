import { useCallback, useContext, useRef } from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import s from './_Button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const Button = ({
  onChange = null,
  style = 'filled',
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
    >
      <div className={`${cx('button__shape')} "button-shape"`} />
      <div className={`${cx('button__state')} "button-state"`} />
      <div className={`${cx('button__label')} "button-label"`}>{label}</div>
    </div>
  );
};

export default Button;
