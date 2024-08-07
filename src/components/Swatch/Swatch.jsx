import { useContext, useLayoutEffect, useRef } from 'react';
import {
  LIGHTNESS_DECIMAL_LENGTH,
  CHROMA_DECIMAL_LENGTH,
  HUE_INTEGER_LENGTH,
  HUE_DECIMAL_LENGTH,
} from '../../utils/constants.js';
import { useHover } from 'react-aria';
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

  const rootRef = useRef(null);

  const { hoverProps, isHovered } = useHover({});

  useLayoutEffect(() => {
    const root = rootRef.current;

    root.style.setProperty('--bg-l', lightness);
    root.style.setProperty('--bg-c', chroma);
    root.style.setProperty('--bg-h', hue);

    const textColourStrong = findApcaCompliantColor(
      lightness,
      chroma,
      hue,
      100,
      lightness > 0.5 ? 'darker' : 'lighter'
    );
    root.style.setProperty('--txt-strong-l', textColourStrong.lightness);
    root.style.setProperty('--txt-strong-c', textColourStrong.chroma);
    root.style.setProperty('--txt-strong-h', textColourStrong.hue);

    const textColourWeek = findApcaCompliantColor(
      lightness,
      chroma,
      hue,
      100,
      lightness > 0.5 ? 'darker' : 'lighter'
    );
    root.style.setProperty('--txt-week-l', textColourWeek.lightness);
    root.style.setProperty('--txt-week-c', textColourWeek.chroma);
    root.style.setProperty('--txt-week-h', textColourWeek.hue);

    // console.log('swatch', renderCnt.current);
  }, [lightness, chroma, hue, inP3, inSrgb]);

  return (
    <li
      className={cx(
        'swatch',
        {
          'swatch--gamut-p3': !inSrgb && inP3,
        },
        {
          'swatch--gamut-out': !inP3,
        },
        className
      )}
      {...hoverProps}
      {...(isHovered && { 'data-hovered': 'true' })}
      data-theme={theme}
      ref={rootRef}
      {...props}
    >
      <div className={cx('swatch__paint')} />
      <div className={cx('swatch__info')}>
        <div className={cx('swatch__label', 'swatch__label--for-l')}>L</div>
        <div className={cx('swatch__value', 'swatch__value--for-l')}>
          {formatNumLength(lightness, 0, LIGHTNESS_DECIMAL_LENGTH)}
        </div>
        <div className={cx('swatch__label', 'swatch__label--for-c')}>C</div>
        <div className={cx('swatch__value', 'swatch__value--for-c')}>
          {formatNumLength(chroma, 0, CHROMA_DECIMAL_LENGTH)}
        </div>
        <div className={cx('swatch__label', 'swatch__label--for-h')}>H</div>
        <div className={cx('swatch__value', 'swatch__value--for-h')}>
          {formatNumLength(hue, HUE_INTEGER_LENGTH, HUE_DECIMAL_LENGTH)}
        </div>
      </div>
      <div className={cx('swatch__name')}>
        {formatNumLength(lightness * 100, 3, 0)}
      </div>
      <div
        className={cx(
          'swatch__icon',
          'swatch__icon--part-warning',
          'material-symbols-outlined'
        )}
      >
        warning
      </div>
      <div
        className={cx(
          'swatch__icon',
          'swatch__icon--part-error',
          'material-symbols-outlined'
        )}
      >
        error
      </div>
    </li>
  );
};

export default Swatch;
