import { useCallback, useContext, useRef } from 'react';
import usePointerInteraction from '../../hooks/usePointerInteraction.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import s from './_Button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const IconButton = ({
  onChange = null,
  style = 'filled',
  materialIcon = '',
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
      className={`${cx('icon-button')} ${className || ''}`}
      ref={buttonRef}
      data-theme={theme}
      data-state={buttonPI.getState()}
      data-style={style}
      tabIndex={0}
    >
      <div className={cx('icon-button__shape', 'icon-button-shape')} />
      <div className={cx('icon-button__state', 'icon-button-state')} />
      <div className={cx('icon-button__content', 'icon-button-content')}>
        {materialIcon && (
          <div
            className={cx(
              'icon-button__content__icon',
              'icon-button-content-icon',
              'material-symbols-outlined'
            )}
          >
            {materialIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default IconButton;
