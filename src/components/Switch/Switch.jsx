import { useCallback, useContext, useRef } from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import style from './_Switch.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Switch = ({
  state: value = false,
  onChange = null,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const switchRef = useRef(null);
  const handleRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onChange?.(!value);
    },
    [value, onChange]
  );

  const switchPI = usePointerInteraction({
    targetRef: switchRef,
    onPointerClick: handleClick,
  });
  const handlePI = usePointerInteraction({
    targetRef: handleRef,
    onPointerClick: handleClick,
  });

  return (
    <div
      className={`${cx(
        'switch',
        { 'switch--value-false': !value },
        { 'switch--value-true': value },
        {
          'switch--state-idle':
            !handlePI.isHovered && !handlePI.isFocused && !handlePI.isPressed,
        },
        { 'switch--state-hovered': handlePI.isHovered },
        { 'switch--state-focused': handlePI.isFocused },
        { 'switch--state-pressed': handlePI.isPressed || switchPI.isPressed }
      )} ${className || ''}`}
      ref={switchRef}
      data-theme={theme}
    >
      <div className={`${cx('switch__shape')} "toggle-bg"`} />
      <div
        className={`${cx('switch__handle')} "toggle-handle"`}
        ref={handleRef}
        tabIndex={0}
      >
        <div
          className={`${cx('switch__handle__state')} "toggle-handle-state"`}
        />
        <div
          className={`${cx('switch__handle__shape')} "toggle-handle-shape"`}
        />
      </div>
    </div>
  );
};

export default Switch;
