import { useEffect, useRef } from 'react';
import {
  HUE_INT_LEN,
  LIGHTNESS_DECIMAL_LEN,
  CHROMA_DECIMAL_LEN,
  HUE_DECIMAL_LEN,
} from '../../utils/constants';
import { formatNumLength } from '../../utils/stringUtils';
import { getApcaTxtColour } from '../../utils/colourUtils';
import s from './Chip.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(s);

const Chip = ({ l, c, h, inP3, inSrgb, className }) => {
  const renderCnt = useRef(0);
  const chipRef = useRef(null);

  useEffect(() => {
    const chip = chipRef.current;

    chip.style.setProperty(`--bg-l`, l);
    chip.style.setProperty(`--bg-c`, c);
    chip.style.setProperty(`--bg-h`, h);

    const txtColourStrong = getApcaTxtColour(
      l,
      c,
      h,
      100,
      l > 0.5 ? 'darker' : 'lighter'
    );
    chip.style.setProperty(`--txt-strong-l`, txtColourStrong.lightness);
    chip.style.setProperty(`--txt-strong-c`, txtColourStrong.chroma);
    chip.style.setProperty(`--txt-strong-h`, txtColourStrong.hue);

    const txtColourWeek = getApcaTxtColour(
      l,
      c,
      h,
      100,
      l > 0.5 ? 'darker' : 'lighter'
    );
    chip.style.setProperty(`--txt-week-l`, txtColourWeek.lightness);
    chip.style.setProperty(`--txt-week-c`, txtColourWeek.chroma);
    chip.style.setProperty(`--txt-week-h`, txtColourWeek.hue);

    renderCnt.current = renderCnt.current + 1;
    // console.log('chip', renderCnt.current);
  }, [l, c, h, inP3, inSrgb]);

  return (
    <li
      className={`${cx(
        'chip',
        {
          'chip--gamut-p3': !inSrgb && inP3,
        },
        {
          'chip--gamut-out': !inP3,
        }
      )} ${className || ''}`}
      ref={chipRef}
    >
      <div className={`${cx('chip__sample')}`} />
      <div className={`${cx('chip__info')}`}>
        <div className={`${cx('chip__label', 'chip__label--for-l')}`}>L</div>
        <div className={`${cx('chip__value', 'chip__value--for-l')}`}>
          {formatNumLength(l, 0, LIGHTNESS_DECIMAL_LEN)}
        </div>
        <div className={`${cx('chip__label', 'chip__label--for-c')}`}>C</div>
        <div className={`${cx('chip__value', 'chip__value--for-c')}`}>
          {formatNumLength(c, 0, CHROMA_DECIMAL_LEN)}
        </div>
        <div className={`${cx('chip__label', 'chip__label--for-h')}`}>H</div>
        <div className={`${cx('chip__value', 'chip__value--for-h')}`}>
          {formatNumLength(h, HUE_INT_LEN, HUE_DECIMAL_LEN)}
        </div>
      </div>
      <div className={`${cx('chip__name')}`}>
        {formatNumLength(l * 100, 3, 0)}
      </div>
    </li>
  );
};

export default Chip;
