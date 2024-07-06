import { useEffect, useRef, useState } from 'react';
import style from './Chip.module.scss';

const Chip = ({ l, c, h, inP3, inSrgb }) => {
  const [render, setRender] = useState(0);
  const chipRef = useRef();
  const lRef = useRef(l);
  const cRef = useRef(c);
  const hRef = useRef(h);
  const inP3Ref = useRef(inP3);
  const inSrgbRef = useRef(inSrgb);

  const formatNum = (num, intLen, floatLen) => {
    const fixed = num.toFixed(floatLen);
    const [intPart, floatPart] = fixed.split('.');
    const paddedInt = intPart.padStart(intLen, '0');
    return `${intLen > 0 ? paddedInt : ``}${
      floatLen > 0 ? `.${floatPart}` : ``
    }`;
  };

  const getGamut = (inP3, inSrgb) => {
    if (inSrgb) return 'srgb';
    if (inP3) return 'p3';
    return 'out';
  };

  useEffect(() => {
    chipRef.current.style.setProperty(`--l`, lRef.current);
    chipRef.current.style.setProperty(`--c`, cRef.current);
    chipRef.current.style.setProperty(`--h`, hRef.current);
  });

  useEffect(() => {
    lRef.current = l;
    cRef.current = c;
    hRef.current = h;
    inP3Ref.current = inP3;
    inSrgbRef.current = inSrgb;
    setRender(render + 1);
    console.log(render);
  }, [l, c, h, inP3, inSrgb]);

  return (
    <li
      className={`${style.chip} ${
        style[`chip--gamut-${getGamut(inP3Ref.current, inSrgbRef.current)}`]
      }`}
      ref={chipRef}
    >
      <div className={style.sample}></div>
      <div className={style.info}>
        <div className={`${style[`info__label`]} ${style[`info__label-l`]}`}>
          L
        </div>
        <div className={`${style[`info__value`]} ${style[`info__value-l`]}`}>
          {formatNum(lRef.current, 0, 3)}
        </div>
        <div className={`${style[`info__label`]} ${style[`info__label-c`]}`}>
          C
        </div>{' '}
        <div className={`${style[`info__value`]} ${style[`info__value-c`]}`}>
          {formatNum(cRef.current, 0, 3)}
        </div>
        <div className={`${style[`info__label`]} ${style[`info__label-h`]}`}>
          H
        </div>
        <div className={`${style[`info__value`]} ${style[`info__value-h`]}`}>
          {formatNum(hRef.current, 3, 1)}
        </div>
      </div>
    </li>
  );
};

export default Chip;
