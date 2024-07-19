import { useCallback, useEffect, useRef, useState } from 'react';
import style from './_Toggle.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Toggle = ({
  state: value = false,
  onChange = null,
  className = null,
}) => {
  const toggleRef = useRef(null);
  const handleRef = useRef(null);
  const [isHovered, setHovered] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [isPressed, setPressed] = useState(false);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      setPressed(false);
      onChange?.(!value);
    },
    [value, onChange]
  );
  const handleMouseEnterHandle = useCallback(() => {
    setHovered(true);
  }, []);
  const handleMouseLeaveHandle = useCallback(() => {
    setHovered(false);
  }, []);
  const handleFocusHandle = useCallback(() => {
    setFocused(true);
  }, []);
  const handleBlurHandle = useCallback(() => {
    setFocused(false);
  }, []);
  const handlePointerDownHandle = useCallback(() => {
    setPressed(true);
  }, []);

  useEffect(() => {
    const toggle = toggleRef.current;
    const handle = handleRef.current;

    toggle.addEventListener('click', handleClick);
    handle.addEventListener('click', handleClick);

    handle.addEventListener('mouseenter', handleMouseEnterHandle);
    handle.addEventListener('mouseleave', handleMouseLeaveHandle);
    handle.addEventListener('focus', handleFocusHandle);
    handle.addEventListener('blur', handleBlurHandle);
    handle.addEventListener('pointerdown', handlePointerDownHandle);

    return () => {
      toggle.removeEventListener('click', handleClick);
      handle.removeEventListener('click', handleClick);

      handle.removeEventListener('mouseenter', handleMouseEnterHandle);
      handle.removeEventListener('mouseleave', handleMouseLeaveHandle);
      handle.removeEventListener('focus', handleFocusHandle);
      handle.removeEventListener('blur', handleBlurHandle);
      handle.removeEventListener('pointerdown', handlePointerDownHandle);
    };
  });

  return (
    <div
      className={`${cx(
        'toggle',
        { 'toggle--value-false': !value },
        { 'toggle--value-true': value },
        { 'toggle--state-idle': !isHovered && !isFocused && !isPressed },
        { 'toggle--state-hovered': isHovered },
        { 'toggle--state-focused': isFocused },
        { 'toggle--state-pressed': isPressed }
      )} ${className || ''}`}
      ref={toggleRef}
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
