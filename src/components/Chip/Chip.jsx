import { apcach, crToBg, maxChroma } from 'apcach';
import { useCallback, useEffect, useRef } from 'react';
import style from './Chip.module.scss';

const Chip = ({ l, c, h, inP3, inSrgb }) => {
  const renderCnt = useRef(0);
  const chipRef = useRef();

  const formatNum = useCallback(
    (num, intLen, floatLen) => {
      const fixed = num.toFixed(floatLen);
      const [intPart, floatPart] = fixed.split('.');
      const paddedInt = intPart.padStart(intLen, '0');
      return `${intLen > 0 ? paddedInt : ``}${
        floatLen > 0 ? `.${floatPart}` : ``
      }`;
    },
    [l, c, h]
  );

  const getGamut = useCallback(
    (inP3, inSrgb) => {
      if (inSrgb) return 'srgb';
      if (inP3) return 'p3';
      return 'out';
    },
    [inP3, inSrgb]
  );

  const getTextColour = useCallback(
    (l, c, h, contrast, direction = 'auto') => {
      return apcach(
        crToBg(`oklch(${l * 100}% ${c} ${h}deg)`, contrast, 'apca', direction),
        maxChroma(),
        h,
        100,
        'p3'
      );
    },
    [l, c, h]
  );

  useEffect(() => {
    chipRef.current.style.setProperty(`--bg-l`, l);
    chipRef.current.style.setProperty(`--bg-c`, c);
    chipRef.current.style.setProperty(`--bg-h`, h);

    const txtColourStrong = getTextColour(
      l,
      c,
      h,
      90,
      l >= 0.55 ? 'darker' : 'lighter'
    );
    chipRef.current.style.setProperty(
      `--txt-strong-l`,
      txtColourStrong.lightness
    );
    chipRef.current.style.setProperty(`--txt-strong-c`, txtColourStrong.chroma);
    chipRef.current.style.setProperty(`--txt-strong-h`, txtColourStrong.hue);

    const txtColourWeek = getTextColour(
      l,
      c,
      h,
      75,
      l >= 0.55 ? 'darker' : 'lighter'
    );
    chipRef.current.style.setProperty(`--txt-week-l`, txtColourWeek.lightness);
    chipRef.current.style.setProperty(`--txt-week-c`, txtColourWeek.chroma);
    chipRef.current.style.setProperty(`--txt-week-h`, txtColourWeek.hue);

    // renderCnt.current = renderCnt.current + 1;
    // console.log('props', renderCnt.current);
  }, [l, c, h, inP3, inSrgb]);

  return (
    <li
      className={`${style.chip} ${
        style[`chip--gamut-${getGamut(inP3, inSrgb)}`]
      }`}
      ref={chipRef}
    >
      <div className={style.container}>
        <div className={style.sample}></div>
        <div className={style.info}>
          <div className={`${style[`info__label`]} ${style[`info__label-l`]}`}>
            L
          </div>
          <div className={`${style[`info__value`]} ${style[`info__value-l`]}`}>
            {formatNum(l, 0, 3)}
          </div>
          <div className={`${style[`info__label`]} ${style[`info__label-c`]}`}>
            C
          </div>{' '}
          <div className={`${style[`info__value`]} ${style[`info__value-c`]}`}>
            {formatNum(c, 0, 3)}
          </div>
          <div className={`${style[`info__label`]} ${style[`info__label-h`]}`}>
            H
          </div>
          <div className={`${style[`info__value`]} ${style[`info__value-h`]}`}>
            {formatNum(h, 3, 1)}
          </div>
        </div>
        <div className={style[`tone-num`]}>{formatNum(l * 100, 3, 0)}</div>
      </div>
    </li>
  );
};

export default Chip;
