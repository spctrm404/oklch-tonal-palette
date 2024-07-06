import style from './Chip.module.scss';

const Chip = ({ l, c, h, inP3, inSrgb }) => {
  const formatNum = (num, intLen, floatLen) => {
    const fixed = num.toFixed(floatLen);
    const [intPart, floatPart] = fixed.split('.');
    const paddedInt = intPart.padStart(intLen, '0');
    return `${intLen > 0 ? paddedInt : ``}${
      floatLen > 0 ? `.${floatPart}` : ``
    }`;
  };

  const itsGamut = (inP3, inSrgb) => {
    if (inSrgb) return 'srgb';
    if (inP3) return 'p3';
    return 'out';
  };

  return (
    <li className={`${style.chip} ${style[`chip-${itsGamut(inP3, inSrgb)}`]}`}>
      <div
        className={style.sample}
        style={{ backgroundColor: `oklch(${l} ${c} ${h}deg)` }}
      ></div>
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
