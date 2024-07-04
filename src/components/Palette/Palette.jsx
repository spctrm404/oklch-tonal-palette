import { toGamut, displayable } from 'culori';
import Chip from '../Chip/Chip.jsx';
import style from './Palette.module.scss';

const Palette = ({ chipNum, lInflection, cMax, hueFrom, hueTo }) => {
  const toP3 = toGamut('p3', 'oklch', null);

  const getAChipInfo = (idx, chipNum, lInflection, cMax, hueFrom, hueTo) => {
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
    const p3Color = toP3(color);
    const inP3 = chroma <= p3Color.c;
    const inSrgb = displayable(color);

    return {
      mode: `oklch`,
      l: lightness,
      c: chroma,
      h: hue,
      inP3: inP3,
      inSrgb: inSrgb,
    };
  };

  const getChipsInfo = (chipNum, lInflection, cMax, hueFrom, hueTo) => {
    const arry = [];

    for (let n = 0; n <= chipNum; n++) {
      const aChipInfo = getAChipInfo(
        n,
        chipNum,
        lInflection,
        cMax,
        hueFrom,
        hueTo
      );
      arry.push(aChipInfo);
    }

    return arry;
  };

  return (
    <ul className={style.palette}>
      {getChipsInfo(chipNum, lInflection, cMax, hueFrom, hueTo).map(
        (aChipInfo) => {
          return (
            <Chip
              key={crypto.randomUUID()}
              l={aChipInfo.l}
              c={aChipInfo.c}
              h={aChipInfo.h}
              inP3={aChipInfo.inP3}
              inSrgb={aChipInfo.inSrgb}
            ></Chip>
          );
        }
      )}
    </ul>
  );
};

export default Palette;
