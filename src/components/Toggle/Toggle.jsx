import { useCallback, useContext, useRef } from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import style from './_Toggle.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Toggle = ({
  state: value = false,
  onChange = null,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const toggleRef = useRef(null);
  const handleRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onChange?.(!value);
    },
    [value, onChange]
  );

  usePointerInteraction({
    targetRef: toggleRef,
    onPointerClick: handleClick,
  });
  const handlePI = usePointerInteraction({
    targetRef: handleRef,
    onPointerClick: handleClick,
  });

  return (
    <div
      className={`${cx(
        'toggle',
        { 'toggle--value-false': !value },
        { 'toggle--value-true': value },
        {
          'toggle--state-idle':
            !handlePI.isHovered && !handlePI.isFocused && !handlePI.isPressed,
        },
        { 'toggle--state-hovered': handlePI.isHovered },
        { 'toggle--state-focused': handlePI.isFocused },
        { 'toggle--state-pressed': handlePI.isPressed }
      )} ${className || ''}`}
      ref={toggleRef}
      data-theme={theme}
    >
      <div className={`${cx('toggle__track')} "toggle-track"`} />
      <div
        className={`${cx('toggle__handle')} "toggle-handle"`}
        ref={handleRef}
        tabIndex={0}
      >
        <div
          className={`${cx('toggle__handle-state')} "toggle-handle-state"`}
        />
        <div
          className={`${cx('toggle__handle-shape')} "toggle-handle-shape"`}
        />
      </div>
    </div>
  );
};

export default Toggle;
