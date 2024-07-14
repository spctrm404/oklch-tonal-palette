import { useCallback, useEffect, useRef, useState } from 'react';
import style from './Toggle.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Toggle = ({ state = false, onChange = null, className = null }) => {
  const toggleRef = useRef(null);

  const handleClickThumb = useCallback(() => {
    onChange?.(!state);
  }, [state, onChange]);

  useEffect(() => {
    const toggle = toggleRef.current;

    toggle.addEventListener('click', handleClickThumb);

    return () => {
      toggle.removeEventListener('click', handleClickThumb);
    };
  });

  return (
    <div
      className={`${cx('toggle', { 'toggle--state-true': state })} ${
        className || ''
      }`}
      ref={toggleRef}
    >
      <div className={`${cx('toggle__thumb')} "toggle-thumb"`} />
    </div>
  );
};

export default Toggle;
