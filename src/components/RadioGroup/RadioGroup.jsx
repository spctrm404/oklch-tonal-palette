import { useCallback, useContext } from 'react';
import { RadioGroup as AriaRadioGroup } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_RadioGroup.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const RadioGroup = ({
  value = '',
  onChange = () => {},
  className,
  children,
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
      {children}
    </AriaRadioGroup>
  );
};

export default RadioGroup;
