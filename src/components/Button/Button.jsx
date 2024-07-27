import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Button = ({
  onChange = null,
  style: type = 'text',
  materialIcon = '',
  label = '',
  disabled = false,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const buttonRef = useRef(null);

  const onPointerClickHandler = useCallback(() => {
    onChange?.();
  }, [onChange]);

  const buttonPI = usePointerInteraction();
  useEffect(() => {
    buttonPI.setTargetRef(buttonRef.current);
    buttonPI.setOnPointerClick(onPointerClickHandler);
  }, [buttonPI, onPointerClickHandler]);

  useLayoutEffect(() => {
    buttonPI.setDisabled(disabled);
  }, [buttonPI, disabled]);

  return (
    <div
      className={`${cx('button')} ${className || ''}`}
      ref={buttonRef}
      data-theme={theme}
      data-has-icon={materialIcon !== ''}
      data-state={buttonPI.getState()}
      data-type={type}
      tabIndex={disabled ? -1 : 0}
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
