import { apcach, crToBg, maxChroma } from 'apcach';
import { useCallback, useEffect, useRef } from 'react';
import { getLengthFormattedNumberString } from '../../utils/getLengthFormattedNumberString';
import style from './Chip.module.scss';

const Chip = ({ l, c, h, inP3, inSrgb, className }) => {
  const renderCnt = useRef(0);
  const chipRef = useRef(null);

  const formatNum = useCallback(getLengthFormattedNumberString, []);

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
    const chip = chipRef.current;

    chip.style.setProperty(`--bg-l`, l);
    chip.style.setProperty(`--bg-c`, c);
    chip.style.setProperty(`--bg-h`, h);

    const txtColourStrong = getTxtColour(l, c, h, 100);
    chip.style.setProperty(`--txt-strong-l`, txtColourStrong.lightness);
    chip.style.setProperty(`--txt-strong-c`, txtColourStrong.chroma);
    chip.style.setProperty(`--txt-strong-h`, txtColourStrong.hue);

    const txtColourWeek = getTxtColour(l, c, h, 100);
    chip.style.setProperty(`--txt-week-l`, txtColourWeek.lightness);
    chip.style.setProperty(`--txt-week-c`, txtColourWeek.chroma);
    chip.style.setProperty(`--txt-week-h`, txtColourWeek.hue);

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
        <div className={`${style.label} ${style[`label-l`]}`}>L</div>
        <div className={`${style.value} ${style[`value-l`]}`}>
          {formatNum(l, 0, 3)}
        </div>
        <div className={`${style.label} ${style[`label-c`]}`}>C</div>
        <div className={`${style.value} ${style[`value-c`]}`}>
          {formatNum(c, 0, 3)}
        </div>
        <div className={`${style.label} ${style[`label-h`]}`}>H</div>
        <div className={`${style.value} ${style[`value-h`]}`}>
          {formatNum(h, 3, 1)}
        </div>
      </div>
      <div className={style.name}>{formatNum(l * 100, 3, 0)}</div>
    </li>
  );
};

export default Chip;
