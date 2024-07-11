import { useEffect, useRef } from 'react';
import { setDigitLength } from '../../utils/numFormat';
import { getTextColor } from '../../utils/colour';
import style from './Chip.module.scss';

const Chip = ({ l, c, h, inP3, inSrgb, className }) => {
  const renderCnt = useRef(0);
  const chipRef = useRef(null);

  useEffect(() => {
    const chip = chipRef.current;

    chip.style.setProperty(`--bg-l`, l);
    chip.style.setProperty(`--bg-c`, c);
    chip.style.setProperty(`--bg-h`, h);

    const txtColourStrong = getTextColor(
      l,
      c,
      h,
      100,
      l > 0.5 ? 'darker' : 'lighter'
    );
    chip.style.setProperty(`--txt-strong-l`, txtColourStrong.lightness);
    chip.style.setProperty(`--txt-strong-c`, txtColourStrong.chroma);
    chip.style.setProperty(`--txt-strong-h`, txtColourStrong.hue);

    const txtColourWeek = getTextColor(
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
    console.log('chip', renderCnt.current);
  }, [l, c, h, inP3, inSrgb]);

  return (
    <li
      className={`${style.chip} ${
        !inSrgb ? style[`chip-${inP3 ? `p3` : `out`}`] : ``
      } ${className}`}
      ref={chipRef}
    >
      <div className={style.sample}></div>
      <div className={style.info}>
        <div className={`${style.label} ${style[`label-l`]}`}>L</div>
        <div className={`${style.value} ${style[`value-l`]}`}>
          {setDigitLength(l, 0, 3)}
        </div>
        <div className={`${style.label} ${style[`label-c`]}`}>C</div>
        <div className={`${style.value} ${style[`value-c`]}`}>
          {setDigitLength(c, 0, 3)}
        </div>
        <div className={`${style.label} ${style[`label-h`]}`}>H</div>
        <div className={`${style.value} ${style[`value-h`]}`}>
          {setDigitLength(h, 3, 1)}
        </div>
      </div>
      <div className={style.name}>{setDigitLength(l * 100, 3, 0)}</div>
    </li>
  );
};

export default Chip;
