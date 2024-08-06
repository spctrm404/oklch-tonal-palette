import { useContext } from 'react';
import { Radio as AriaRadio } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Radio.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Radio = ({ text = '', className, ...props }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <AriaRadio className={cx('radio', className)} data-theme={theme} {...props}>
      <div className={cx('radio__button')}>
        <div className={cx('radio__button__state')} />
        <div className={cx('radio__button__shape')} />
      </div>
      <div className={cx('radio__text')}>{text}</div>
    </AriaRadio>
  );
};

export default Radio;
