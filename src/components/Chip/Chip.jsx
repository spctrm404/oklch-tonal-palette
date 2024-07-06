import { useCallback, useEffect, useRef } from 'react';
import style from './Chip.module.scss';

const Chip = ({ l, c, h, inP3, inSrgb }) => {
  const renderCnt = useRef(0);
  const chipRef = useRef();

  const formatNum = useCallback((num, intLen, floatLen) => {
    const fixed = num.toFixed(floatLen);
    const [intPart, floatPart] = fixed.split('.');
    const paddedInt = intPart.padStart(intLen, '0');
    return `${intLen > 0 ? paddedInt : ``}${
      floatLen > 0 ? `.${floatPart}` : ``
    }`;
  }, []);

  const getGamut = (inP3, inSrgb) => {
    if (inSrgb) return 'srgb';
    if (inP3) return 'p3';
    return 'out';
  };

  useEffect(() => {
    chipRef.current.style.setProperty(`--l`, l);
    chipRef.current.style.setProperty(`--c`, c);
    chipRef.current.style.setProperty(`--h`, h);
    renderCnt.current = renderCnt.current + 1;
    console.log('noDependencies', renderCnt.current);
  }, []);

  useEffect(() => {
    chipRef.current.style.setProperty(`--l`, l);
    chipRef.current.style.setProperty(`--c`, c);
    chipRef.current.style.setProperty(`--h`, h);
    renderCnt.current = renderCnt.current + 1;
    console.log('props', renderCnt.current);
  }, [l, c, h, inP3, inSrgb]);

  return (
    <li
      className={`${style.chip} ${
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
    </li>
  );
};

export default Chip;
