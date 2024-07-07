import { clampChroma, displayable } from 'culori';
import { useCallback, useEffect, useRef, useState } from 'react';
import Chip from '../Chip/Chip.jsx';
import style from './Palette.module.scss';

const Palette = ({ chipNum, lInflection, cMax, hueFrom, hueTo }) => {
  const renderCnt = useRef(0);
  const paletteRef = useRef();

  const getAChip = (idx, chipNum, lInflection, cMax, hueFrom, hueTo) => {
    if (idx < 0 || chipNum < 1) return null;

    if (idx === 0)
      return {
        key: `chip_${idx}/${chipNum}_${0}_${0}_${hueFrom}`,
        mode: `oklch`,
        l: 0,
        c: 0,
        h: hueFrom,
        inP3: true,
        inSrgb: true,
      };

    if (idx === chipNum)
      return {
        key: `chip_${idx}/${chipNum}_${1}_${0}_${hueTo}`,
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
      key: `chip_${idx}/${chipNum}_${clamppedColor.l}_${clamppedColor.c}_${clamppedColor.h}`,
      mode: `oklch`,
      l: clamppedColor.l,
      c: clamppedColor.c,
      h: clamppedColor.h,
      inP3: inP3,
      inSrgb: inSrgb,
    };
  };

  const getChips = (chipNum, lInflection, cMax, hueFrom, hueTo) => {
    const arry = [];

    for (let n = 0; n <= chipNum; n++) {
      const aChip = getAChip(n, chipNum, lInflection, cMax, hueFrom, hueTo);
      arry.push(aChip);
    }

    return arry;
  };

  const initChips = getChips((chipNum, lInflection, cMax, hueFrom, hueTo));

  const [chips, setChips] = useState(initChips);

  useEffect(() => {
    // renderCnt.current = renderCnt.current + 1;
    // console.log('props', renderCnt.current);
  }, []);

  return (
    <ul className={style.palette} ref={paletteRef}>
      {chips.map((aChip) => {
        return (
          <Chip
            key={aChip.key}
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
