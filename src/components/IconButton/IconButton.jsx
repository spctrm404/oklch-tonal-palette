import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import s from './_IconButton.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const IconButton = ({
  value = null,
  onChange = null,
  style = 'standard',
  materialIcon = '',
  disabled = false,
  className = null,
}) => {
  const { theme } = useContext(ThemeContext);

  const buttonRef = useRef(null);

  const handleClick = useCallback(() => {
    if (value !== null) {
      console.log(value);
      onChange?.(!value);
    } else {
      onChange?.();
    }
  }, [value, onChange]);

  const buttonPI = usePointerInteraction();
  useEffect(() => {
    buttonPI.setTargetRef(buttonRef.current);
    buttonPI.setOnPointerClick(handleClick);
  }, [buttonPI, handleClick]);

  useLayoutEffect(() => {
    buttonPI.setDisabled(disabled);
  }, [buttonPI, disabled]);

  return (
    <div
      className={`${cx('icon-button')} ${className || ''}`}
      ref={buttonRef}
      data-theme={theme}
      data-value={value}
      data-is-toggle={value !== null}
      data-state={buttonPI.getState()}
      data-style={style}
      tabIndex={0}
    >
      <div className={cx('icon-button__shape', 'icon-button-shape')} />
      <div className={cx('icon-button__state', 'icon-button-state')} />
      <div className={cx('icon-button__content', 'icon-button-content')}>
        <div
          className={cx(
            'icon-button__content__icon',
            'icon-button-content-icon',
            'material-symbols-outlined'
          )}
        >
          {materialIcon}
        </div>
      </div>
    </div>
  );
};

export default IconButton;
