import { useCallback, useContext, useEffect, useRef, useState } from 'react';
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

  const [isHovered, setHovered] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [isPressed, setPressed] = useState(false);
  const isFocusedByPointer = useRef(false);

  const handleClickToggle = useCallback(() => {
    onChange?.(!value);
  }, [value, onChange]);
  const handleClickHandle = useCallback(
    (e) => {
      if (isFocused) {
        handleRef.current.blur();
      }
      e.stopPropagation();
      onChange?.(!value);
    },
    [value, onChange, handleRef, isFocused]
  );
  const handleMouseEnterHandle = useCallback(() => {
    setHovered(true);
  }, []);
  const handleMouseLeaveHandle = useCallback(() => {
    setHovered(false);
  }, []);
  const handleFocusHandle = useCallback(() => {
    if (isFocusedByPointer.current) return;
    setFocused(true);
  }, [isFocusedByPointer]);
  const handleBlurHandle = useCallback(() => {
    setFocused(false);
  }, []);
  const handlePointerDownHandle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();

    isFocusedByPointer.current = true;
    setPressed(true);

    const handlePointerMove = (e) => {
      e.preventDefault();
    };

    const handlePointerUp = (e) => {
      e.preventDefault();

      isFocusedByPointer.current = false;
      setPressed(false);

      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }, []);

  useEffect(() => {
    const toggle = toggleRef.current;
    const handle = handleRef.current;

    toggle.addEventListener('click', handleClickToggle);
    handle.addEventListener('click', handleClickHandle);

    handle.addEventListener('mouseenter', handleMouseEnterHandle);
    handle.addEventListener('mouseleave', handleMouseLeaveHandle);
    handle.addEventListener('focus', handleFocusHandle);
    handle.addEventListener('blur', handleBlurHandle);
    handle.addEventListener('pointerdown', handlePointerDownHandle);

    return () => {
      toggle.removeEventListener('click', handleClickToggle);
      handle.removeEventListener('click', handleClickHandle);

      handle.removeEventListener('mouseenter', handleMouseEnterHandle);
      handle.removeEventListener('mouseleave', handleMouseLeaveHandle);
      handle.removeEventListener('focus', handleFocusHandle);
      handle.removeEventListener('blur', handleBlurHandle);
      handle.removeEventListener('pointerdown', handlePointerDownHandle);
    };
  }, [
    handleClickToggle,
    handleClickHandle,
    handleMouseEnterHandle,
    handleMouseLeaveHandle,
    handleFocusHandle,
    handleBlurHandle,
    handlePointerDownHandle,
  ]);

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
