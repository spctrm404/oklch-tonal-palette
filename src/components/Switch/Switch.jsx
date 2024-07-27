import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Switch.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Switch = ({
  state: value = false,
  disabled = false,
  onChange = null,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const rootDomRef = useRef(null);
  const handleDomRef = useRef(null);

  const onPointerClickHandler = useCallback(() => {
    onChange?.(!value);
  }, [value, onChange]);

  const switchPI = usePointerInteraction();
  useEffect(() => {
    switchPI.setTargetRef(rootDomRef.current);
    switchPI.setOnPointerClick(onPointerClickHandler);
  }, [switchPI, onPointerClickHandler]);
  const handlePI = usePointerInteraction();
  useEffect(() => {
    handlePI.setTargetRef(handleDomRef.current);
    handlePI.setOnPointerClick(onPointerClickHandler);
  }, [handlePI, onPointerClickHandler]);

  useLayoutEffect(() => {
    switchPI.setDisabled(disabled);
    handlePI.setDisabled(disabled);
  }, [switchPI, handlePI, disabled]);

  return (
    <div
      className={`${cx('switch')} ${className || ''}`}
      ref={rootDomRef}
      data-theme={theme}
      data-value={value}
      data-state={
        switchPI.getState() === 'pressed' ? 'pressed' : handlePI.getState()
      }
    >
      <div className={cx('switch__shape', 'switch-shape')} />
      <div
        className={cx('switch__handle', 'switch-handle')}
        ref={handleDomRef}
        tabIndex={disabled ? -1 : 0}
      >
        <div className={cx('switch__handle__state', 'switch-handle-state')} />
        <div className={cx('switch__handle__shape', 'switch-handle-shape')} />
      </div>
    </div>
  );
};

export default Switch;
