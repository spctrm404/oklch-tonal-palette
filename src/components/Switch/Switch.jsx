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

  const rootDom = useRef(null);
  const handleDom = useRef(null);

  const onClickHandler = useCallback(() => {
    onChange?.(!value);
  }, [value, onChange]);

  const switchPI = usePointerInteraction();
  useEffect(() => {
    switchPI.setTargetRef(rootDom.current);
    switchPI.setOnPointerClick(onClickHandler);
  }, [switchPI, onClickHandler]);
  const handlePI = usePointerInteraction();
  useEffect(() => {
    handlePI.setTargetRef(handleDom.current);
    handlePI.setOnPointerClick(onClickHandler);
  }, [handlePI, onClickHandler]);

  useLayoutEffect(() => {
    switchPI.setDisabled(disabled);
    handlePI.setDisabled(disabled);
  }, [switchPI, handlePI, disabled]);

  return (
    <div
      className={`${cx('switch')} ${className || ''}`}
      ref={rootDom}
      data-theme={theme}
      data-value={value}
      data-state={
        switchPI.getState() === 'pressed' ? 'pressed' : handlePI.getState()
      }
    >
      <div className={cx('switch__shape', 'switch-shape')} />
      <div
        className={cx('switch__handle', 'switch-handle')}
        ref={handleDom}
        tabIndex={0}
      >
        <div className={cx('switch__handle__state', 'switch-handle-state')} />
        <div className={cx('switch__handle__shape', 'switch-handle-shape')} />
      </div>
    </div>
  );
};

export default Switch;
