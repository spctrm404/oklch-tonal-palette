import { useCallback, useContext } from 'react';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
} from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_RadioGroup.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const RadioGroup = ({
  items = null,
  value = '',
  onChange = () => {},
  className,
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const onChangeHandler = useCallback(
    (newString) => {
      onChange?.(newString);
    },
    [onChange]
  );

  return (
    <AriaRadioGroup
      value={value}
      onChange={onChangeHandler}
      className={cx('radio-group', 'radio-group__root', className)}
      data-theme={theme}
      {...props}
    >
      {items.map((anItem) => {
        return (
          <AriaRadio
            className={cx('radio')}
            key={anItem.uid}
            uid={anItem.uid}
            value={anItem.value}
            data-theme={theme}
          >
            <div className={cx('radio__button')}>
              <div className={cx('radio__button__state')} />
              <div className={cx('radio__button__shape')} />
            </div>
            <div className={cx('radio__text')}>{anItem.text}</div>
          </AriaRadio>
        );
      })}
    </AriaRadioGroup>
  );
};

export default RadioGroup;
