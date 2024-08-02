import { useContext, useRef } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_ToggleButton.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const ToggleButton = ({
  buttontype = 'standard',
  materialIconA = '',
  materialIconB = '',
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const rootRef = useRef(null);

  return (
    <AriaToggleButton
      className={cx('toggle-button', 'toggle-button__root', { className })}
      data-button-type={buttontype}
      data-theme={theme}
      ref={rootRef}
      {...props}
    >
      <div
        className={cx(
          'toggle-button__root__shape',
          'toggle-button__root__shape--part-background'
        )}
      />
      <div className={cx('toggle-button__state')} />
      <div className={cx('toggle-button__content')}>
        <div
          className={cx(
            'toggle-button__content__icon',
            'toggle-button__content__icon--part-a',
            'material-symbols-outlined'
          )}
        >
          {materialIconA}
        </div>
        {materialIconB && (
          <div
            className={cx(
              'toggle-button__content__icon',
              'toggle-button__content__icon--part-b',
              'material-symbols-outlined'
            )}
          >
            {materialIconB}
          </div>
        )}
      </div>
      <div
        className={cx(
          'toggle-button__root__shape',
          'toggle-button__root__shape--part-foreground'
        )}
      />
    </AriaToggleButton>
  );
};

export default ToggleButton;
