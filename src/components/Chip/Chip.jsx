import { useContext, useLayoutEffect, useRef } from 'react';
import {
  LIGHTNESS_DECIMAL_LENGTH,
  CHROMA_DECIMAL_LENGTH,
  HUE_INTEGER_LENGTH,
  HUE_DECIMAL_LENGTH,
} from '../../utils/constants';
import { useHover } from 'react-aria';
import { formatNumLength } from '../../utils/stringUtils';
import { findApcaCompliantColor } from '../../utils/colourUtils';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Chip.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Chip = ({ l: lightness, c: chroma, h: hue, inP3, inSrgb, className }) => {
  const { theme } = useContext(ThemeContext);

  const renderCnt = useRef(0);
  const rootRef = useRef(null);

  const { hoverProps, isHovered } = useHover({});

  useLayoutEffect(() => {
    const root = rootRef.current;

    root.style.setProperty(`--bg-l`, lightness);
    root.style.setProperty(`--bg-c`, chroma);
    root.style.setProperty(`--bg-h`, hue);

    const textColourStrong = findApcaCompliantColor(
      lightness,
      chroma,
      hue,
      100,
      lightness > 0.5 ? 'darker' : 'lighter'
    );
    root.style.setProperty(`--txt-strong-l`, textColourStrong.lightness);
    root.style.setProperty(`--txt-strong-c`, textColourStrong.chroma);
    root.style.setProperty(`--txt-strong-h`, textColourStrong.hue);

    const textColourWeek = findApcaCompliantColor(
      lightness,
      chroma,
      hue,
      100,
      lightness > 0.5 ? 'darker' : 'lighter'
    );
    root.style.setProperty(`--txt-week-l`, textColourWeek.lightness);
    root.style.setProperty(`--txt-week-c`, textColourWeek.chroma);
    root.style.setProperty(`--txt-week-h`, textColourWeek.hue);

    renderCnt.current = renderCnt.current + 1;
    // console.log('chip', renderCnt.current);
  }, [lightness, chroma, hue, inP3, inSrgb]);

  return (
    <li
      className={cx(
        'chip',
        {
          'chip--gamut-p3': !inSrgb && inP3,
        },
        {
          'chip--gamut-out': !inP3,
        },
        className
      )}
      {...hoverProps}
      {...(isHovered && { 'data-hovered': 'true' })}
      data-theme={theme}
      ref={rootRef}
    >
      <div className={`${cx('chip__sample')}`} />
      <div className={`${cx('chip__info')}`}>
        <div className={`${cx('chip__label', 'chip__label--for-l')}`}>L</div>
        <div className={`${cx('chip__value', 'chip__value--for-l')}`}>
          {formatNumLength(lightness, 0, LIGHTNESS_DECIMAL_LENGTH)}
        </div>
        <div className={`${cx('chip__label', 'chip__label--for-c')}`}>C</div>
        <div className={`${cx('chip__value', 'chip__value--for-c')}`}>
          {formatNumLength(chroma, 0, CHROMA_DECIMAL_LENGTH)}
        </div>
        <div className={`${cx('chip__label', 'chip__label--for-h')}`}>H</div>
        <div className={`${cx('chip__value', 'chip__value--for-h')}`}>
          {formatNumLength(hue, HUE_INTEGER_LENGTH, HUE_DECIMAL_LENGTH)}
        </div>
      </div>
      <div className={`${cx('chip__name')}`}>
        {formatNumLength(lightness * 100, 3, 0)}
      </div>
      <div
        className={cx(
          'chip__icon',
          'chip__icon--part-warning',
          'material-symbols-outlined'
        )}
      >
        warning
      </div>
      <div
        className={cx(
          'chip__icon',
          'chip__icon--part-error',
          'material-symbols-outlined'
        )}
      >
        error
      </div>
    </li>
  );
};

export default Chip;
