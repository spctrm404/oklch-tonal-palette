import { clampChroma, displayable } from 'culori';
import { useState } from 'react';
import Chip from '../Chip/Chip.jsx';
import style from './Palette.module.scss';

const Palette = (chipNum, lInflection, cMax, hueFrom, hueTo) => {
  const getAChip = (idx, chipNum, lInflection, cMax, hueFrom, hueTo) => {
    if (idx < 0 || chipNum < 1) return null;

    if (idx === 0)
      return {
        mode: `oklch`,
        l: 0,
        c: 0,
        h: hueFrom,
        inP3: true,
        inSrgb: true,
      };

    if (idx === chipNum)
      return {
        mode: `oklch`,
        l: 1,
        c: 0,
        h: hueTo,
        inP3: true,
        inSrgb: true,
      };

    const lightness = idx / chipNum;

    const alpha = lightness / lInflection;
    const chroma = alpha <= 1 ? alpha * cMax : cMax - (alpha - 1) * cMax;

    const hue =
      hueFrom +
      (idx *
        (hueTo > hueFrom ? hueTo - hueFrom : (hueTo + 360 - hueFrom) % 360)) /
        chipNum;

    const color = `oklch(${lightness} ${chroma} ${hue})`;
    const clamppedColor = clampChroma(color, `oklch`, `p3`);
    const inP3 = chroma <= clamppedColor.c;
    const inSrgb = displayable(color);

    return {
      mode: `oklch`,
      l: clamppedColor.l,
      c: clamppedColor.c,
      h: clamppedColor.h,
      inP3: inP3,
      inSrgb: inSrgb,
    };
  };

  const getChips = (chipNum, lInflection, cMax, hueFrom, hueTo) => {
    console.log('working');

    const arry = [];

    for (let n = 0; n <= chipNum; n++) {
      console.log('n', n);
      const aChip = getAChip(n, chipNum, lInflection, cMax, hueFrom, hueTo);
      arry.push(aChip);
    }

    return arry;
  };

  console.log(chipNum, lInflection, cMax, hueFrom, hueTo);
  const chipsInit = getChips(chipNum, lInflection, cMax, hueFrom, hueTo);
  console.log(chipsInit);

  const [chips, setChips] = useState();

  return (
    <ul className={style.palette}>
      {getChips(chipNum, lInflection, cMax, hueFrom, hueTo).map((aChip) => {
        return (
          <Chip
            key={`chip_${aChip.l}_${aChip.c}_${aChip.h}_by_${chipNum}_${lInflection}_${cMax}_${hueFrom}_${hueTo}`}
            l={aChip.l}
            c={aChip.c}
            h={aChip.h}
            inP3={aChip.inP3}
            inSrgb={aChip.inSrgb}
          ></Chip>
        );
      })}
    </ul>
  );
};

export default Palette;
