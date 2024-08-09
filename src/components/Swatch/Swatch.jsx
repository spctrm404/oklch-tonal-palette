import { useContext, useLayoutEffect, useRef } from 'react';
import {
  LIGHTNESS_DECIMAL_LENGTH,
  CHROMA_DECIMAL_LENGTH,
  HUE_INTEGER_LENGTH,
  HUE_DECIMAL_LENGTH,
} from '../../utils/constants.js';
import { formatNumLength } from '../../utils/stringUtils.js';
import { findApcaCompliantColor } from '../../utils/colourUtils.js';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Swatch.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Swatch = ({
  lightness,
  chroma,
  hue,
  inP3,
  inSrgb,
  className = '',
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <li
      className={cx('swatch', 'swatch__root', className)}
      data-gamut={inSrgb ? 'srgb' : inP3 ? 'p3' : 'unknown'}
      data-theme={theme}
      style={{
        '--lightness': lightness,
        '--chroma': chroma,
        '--hue': hue,
      }}
      {...props}
    >
      <div className={cx('swatch__preview')} />
      <div className={cx('swatch__status')}>
        <div
          className={cx(
            'swatch__status__icon',
            'swatch__status__icon--part-warning',
            'material-symbols-outlined'
          )}
        >
          warning
        </div>
        <div
          className={cx(
            'swatch__status__icon',
            'swatch__status__icon--part-error',
            'material-symbols-outlined'
          )}
        >
          error
        </div>
      </div>
    </li>
  );
};

export default Swatch;
