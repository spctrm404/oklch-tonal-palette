import { useCallback, useEffect, useRef } from 'react';
import style from './Button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Button = ({ label }) => {
  const buttonRef = useRef(null);

  // const clickButtonHandler = useCallback(() => {
  //   onClick?.(!state);
  // }, [state, onClick]);

  // useEffect(() => {
  //   const button = buttonRef.current;
  //   if (type === 'toggle') button.addEventListener('click', clickButtonHandler);

  //   return () => {
  //     if (type === 'toggle') button.removeListener('click', clickButtonHandler);
  //   };
  // }, [type, onClick, buttonRef, clickButtonHandler]);

  return (
    <div className={`${cx('button')}`} ref={buttonRef}>
      {`A${label}`}
    </div>
  );
};

export default Button;
