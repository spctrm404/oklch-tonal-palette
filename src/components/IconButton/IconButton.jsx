import { useCallback, useContext, useRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_IconButton.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const IconButton = ({
  slot = null,
  id = '',
  ariaLabel = '',
  ariaLabelledby = '',
  ariaDescribedby = '',
  ariaDetails = '',
  buttontype = 'standard',
  materialIcon = '',
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
      className={cx('icon-button', 'icon-button__root', { className })}
      {...(slot && { slot: slot })}
      {...(id && { id: id })}
      {...(ariaLabel && { 'aria-label': ariaLabel })}
      {...(ariaLabelledby && { 'aria-labelledby': ariaLabelledby })}
      {...(ariaDescribedby && { 'aria-describedby': ariaLabelledby })}
      {...(ariaDetails && { 'aria-details': ariaLabelledby })}
      data-button-type={buttontype}
      isDisabled={isDisable}
      onPress={onPressHandler}
      data-theme={theme}
      ref={rootRef}
    >
      <div
        className={cx(
          'icon-button__root__shape',
          'icon-button__root__shape--part-background'
        )}
      />
      <div className={cx('icon-button__state')} />
      <div className={cx('icon-button__content')}>
        <div
          className={cx(
            'icon-button__content__icon',
            'material-symbols-outlined'
          )}
        >
          {materialIcon}
        </div>
      </div>
      <div
        className={cx(
          'icon-button__root__shape',
          'icon-button__root__shape--part-foreground'
        )}
      />
    </AriaButton>
  );
};

export default IconButton;
