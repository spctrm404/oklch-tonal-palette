import { clampChroma, displayable } from 'culori';
import { useCallback, useEffect, useRef, useState } from 'react';
import Chip from '../Chip/Chip.jsx';
import style from './Palette.module.scss';

const Palette = ({
  chipNum,
  lInflect,
  cMax,
  hueFrom,
  hueTo,
  isSelected,
  onClick,
}) => {
  const renderCnt = useRef(0);

  const formatNum = useCallback((num, intLen, decimalLen) => {
    const fixed = num.toFixed(decimalLen);
    const [intPart, decimalPart] = fixed.split('.');
    const paddedInt = intPart.padStart(intLen, '0');
    return `${intLen > 0 ? paddedInt : ``}${
      decimalLen > 0 ? `.${decimalPart}` : ``
    }`;
  }, []);

  const createAChip = useCallback(
    (idx, chipNum, lInflect, cMax, hueFrom, hueTo) => {
      if (idx < 0 || chipNum < 1) return null;

      if (idx === 0)
        return {
          id: crypto.randomUUID(),
          mode: `oklch`,
          l: 0,
          c: 0,
          h: hueFrom,
          inP3: true,
          inSrgb: true,
        };

      if (idx === chipNum)
        return {
          id: crypto.randomUUID(),
          mode: `oklch`,
          l: 1,
          c: 0,
          h: hueTo,
          inP3: true,
          inSrgb: true,
        };

      const lightness = idx / chipNum;

      const alpha = lightness / lInflect;
      const chroma = alpha <= 1 ? alpha * cMax : cMax - (alpha - 1) * cMax;

      const hue =
        hueFrom === hueTo
          ? hueFrom
          : hueFrom < hueTo
          ? (hueFrom + (idx * (hueTo - hueFrom)) / chipNum) % 360
          : (hueFrom + (idx * (hueTo + 360 - hueFrom)) / chipNum) % 360;

      const colour = `oklch(${lightness} ${chroma} ${hue})`;
      const clamppedColour = clampChroma(colour, `oklch`, `p3`);
      const inP3 = chroma <= clamppedColour.c;
      const inSrgb = displayable(colour);

      return {
        id: crypto.randomUUID(),
        mode: `oklch`,
        l: clamppedColour.l,
        c: clamppedColour.c,
        h: clamppedColour.h,
        inP3: inP3,
        inSrgb: inSrgb,
      };
    },
    []
  );
  const createChips = useCallback(
    (chipNum, lInflect, cMax, hueFrom, hueTo) => {
      const arry = [];

      for (let n = 0; n <= chipNum; n++) {
        const aChipInfo = createAChip(
          n,
          chipNum,
          lInflect,
          cMax,
          hueFrom,
          hueTo
        );
        arry.push(aChipInfo);
      }

      return arry;
    },
    [createAChip]
  );

  const [chips, setChips] = useState(
    createChips(chipNum, lInflect, cMax, hueFrom, hueTo)
  );

  useEffect(() => {
    setChips((prevChips) => {
      const newChips = createChips(chipNum, lInflect, cMax, hueFrom, hueTo);
      return newChips.map((aNewChip, idx) => {
        const aPrevChip = prevChips[idx];
        return aPrevChip ? { ...aNewChip, id: aPrevChip.id } : aNewChip;
      });
    });

    renderCnt.current = renderCnt.current + 1;
    console.log('palette', renderCnt.current);
  }, [chipNum, lInflect, cMax, hueFrom, hueTo, createChips]);

  return (
    <div
      className={`${style.palette} ${
        isSelected ? style[`palette-selected`] : ``
      }`}
      onClick={onClick}
    >
      <div className={style.info}>
        <div className={`${style[`info__sticky`]}`}>
          {`Num: ${chipNum + 1}; H: ${formatNum(hueFrom, 3, 1)} - ${formatNum(
            hueTo,
            3,
            1
          )}; C_Max: ${formatNum(cMax, 0, 3)} @L: ${formatNum(
            lInflect,
            0,
            3
          )};`}
        </div>
      </div>
      <ul className={style.chips}>
        {chips.map((aChip) => {
          return (
            <Chip
              className={style.chip}
              key={aChip.id}
              l={aChip.l}
              c={aChip.c}
              h={aChip.h}
              inP3={aChip.inP3}
              inSrgb={aChip.inSrgb}
            ></Chip>
          );
        })}
      </ul>
    </div>
  );
};
export default Palette;
