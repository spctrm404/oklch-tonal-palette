import { apcach, crToBg, maxChroma } from 'apcach';
import { useCallback, useEffect, useRef } from 'react';
import style from './Chip.module.scss';

const Chip = ({ l, c, h, inP3, inSrgb, className }) => {
  const renderCnt = useRef(0);
  const chipRef = useRef();

  const formatNum = useCallback((num, intLen, decimalLen) => {
    const fixed = num.toFixed(decimalLen);
    const [intPart, decimalPart] = fixed.split('.');
    const paddedInt = intPart.padStart(intLen, '0');
    return `${intLen > 0 ? paddedInt : ``}${
      decimalLen > 0 ? `.${decimalPart}` : ``
    }`;
  }, []);

  const getGamut = useCallback((inP3, inSrgb) => {
    if (inSrgb) return 'srgb';
    if (inP3) return 'p3';
    return 'out';
  }, []);

  const getTxtColour = useCallback((l, c, h, contrast) => {
    return apcach(
      crToBg(
        `oklch(${l * 100}% ${c} ${h}deg)`,
        contrast,
        'apca',
        l > 0.5 ? 'darker' : 'lighter'
      ),
      maxChroma(),
      h,
      100,
      'p3'
    );
  }, []);

  useEffect(() => {
    chipRef.current.style.setProperty(`--bg-l`, l);
    chipRef.current.style.setProperty(`--bg-c`, c);
    chipRef.current.style.setProperty(`--bg-h`, h);

    const txtColourStrong = getTxtColour(l, c, h, 100);
    chipRef.current.style.setProperty(
      `--txt-strong-l`,
      txtColourStrong.lightness
    );
    chipRef.current.style.setProperty(`--txt-strong-c`, txtColourStrong.chroma);
    chipRef.current.style.setProperty(`--txt-strong-h`, txtColourStrong.hue);

    const txtColourWeek = getTxtColour(l, c, h, 100);
    chipRef.current.style.setProperty(`--txt-week-l`, txtColourWeek.lightness);
    chipRef.current.style.setProperty(`--txt-week-c`, txtColourWeek.chroma);
    chipRef.current.style.setProperty(`--txt-week-h`, txtColourWeek.hue);

    renderCnt.current = renderCnt.current + 1;
    console.log('chip', renderCnt.current);
  }, [l, c, h, inP3, inSrgb, getTxtColour]);

  return (
    <li
      className={`${className} ${style.chip} ${
        style[`chip--gamut-${getGamut(inP3, inSrgb)}`]
      }`}
      ref={chipRef}
    >
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
        </div>
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
      <div className={style.name}>{formatNum(l * 100, 3, 0)}</div>
    </li>
  );
};

export default Chip;
