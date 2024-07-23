import { useCallback, useContext, useRef } from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import s from './_Switch.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const Switch = ({
  state: value = false,
  onChange = null,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const switchRef = useRef(null);
  const handleRef = useRef(null);

  const handleClick = useCallback(() => {
    onChange?.(!value);
  }, [value, onChange]);

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
      className={`${cx('switch')} ${className || ''}`}
      ref={switchRef}
      data-theme={theme}
      data-value={value}
      data-state={
        switchPI.getState() === 'pressed' ? 'pressed' : handlePI.getState()
      }
    >
      <div className={cx('switch__shape', 'switch-shape')} />
      <div
        className={cx('switch__handle', 'switch-handle')}
        ref={handleRef}
        tabIndex={0}
      >
        <div className={cx('switch__handle__state', 'switch-handle-state')} />
        <div className={cx('switch__handle__shape', 'switch-handle-shape')} />
      </div>
    </div>
  );
};

export default Switch;
