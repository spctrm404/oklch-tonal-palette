import { useCallback, useContext, useRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_IconButton.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const IconButton = ({
  buttontype = 'standard',
  materialIcon = '',
  className = '',
  onPress = () => {},
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const rootRef = useRef(null);

  const onPressHandler = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <AriaButton
      className={cx('icon-button', 'icon-button__root', className)}
      data-button-type={buttontype}
      onPress={onPressHandler}
      data-theme={theme}
      ref={rootRef}
      {...props}
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
