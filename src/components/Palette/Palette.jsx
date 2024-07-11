import { useEffect, useRef, useState } from 'react';
import { setDigitLength } from '../../utils/numFormat';
import { createChips } from '../../utils/colour';
import Chip from '../Chip/Chip.jsx';
import style from './Palette.module.scss';

const Palette = ({
  chipNum,
  lInflect,
  cMax,
  hueFrom,
  hueTo,
  isSelected,
  onClickPalette,
}) => {
  const renderCnt = useRef(0);
  const paletteRef = useRef(null);

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
  }, [chipNum, lInflect, cMax, hueFrom, hueTo]);

  useEffect(() => {
    const palette = paletteRef.current;
    palette.addEventListener('click', onClickPalette);

    return () => {
      palette.removeEventListener('click', onClickPalette);
    };
  }, [onClickPalette]);

  return (
    <div
      className={`${style.palette} ${
        isSelected ? style[`palette-selected`] : ``
      }`}
      ref={paletteRef}
    >
      <div className={style.info}>
        <div className={style.sticky}>
          {`Num: ${chipNum + 1}; H: ${setDigitLength(
            hueFrom,
            3,
            1
          )} - ${setDigitLength(hueTo, 3, 1)}; C_Max: ${setDigitLength(
            cMax,
            0,
            3
          )} @L: ${setDigitLength(lInflect, 0, 3)};`}
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
