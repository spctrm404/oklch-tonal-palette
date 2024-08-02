import { useCallback, useContext, useRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Button = ({
  slot = null,
  id = '',
  ariaLabel = '',
  ariaLabelledby = '',
  ariaDescribedby = '',
  ariaDetails = '',
  buttontype = 'text',
  materialIcon = '',
  label = '',
  isDisable = false,
  onPress = () => {},
  className = '',
}) => {
  const { theme } = useContext(ThemeContext);

  const rootRef = useRef(null);

  const onPressHandler = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <AriaButton
      className={cx('button', 'button__root', { className })}
      {...(slot && { slot: slot })}
      {...(id && { id: id })}
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      {...(ariaLabelledby && { 'aria-labelledby': ariaLabelledby })}
      {...(ariaDescribedby && { 'aria-describedby': ariaLabelledby })}
      {...(ariaDetails && { 'aria-details': ariaLabelledby })}
      data-button-type={buttontype}
      {...(materialIcon && { 'data-has-icon': materialIcon })}
      isDisabled={isDisable}
      onPress={onPressHandler}
      data-theme={theme}
      ref={rootRef}
    >
      <div
        className={cx(
          'button__root__shape',
          'button__root__shape--part-background'
        )}
      />
      <div className={cx('button__state')} />
      <div className={cx('button__content')}>
        {materialIcon && (
          <div
            className={cx('button__content__icon', 'material-symbols-outlined')}
          >
            {materialIcon}
          </div>
        )}
        <div className={cx('button__content__label')}>{label}</div>
        <div
          className={cx(
            'button__root__shape',
            'button__root__shape--part-foreground'
          )}
        />
      </div>
    </AriaButton>
  );
};

export default Button;
