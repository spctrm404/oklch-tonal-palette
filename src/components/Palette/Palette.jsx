import { useEffect, useRef, useState } from 'react';
import { setDigitLength } from '../../utils/numFormat';
import { createChips } from '../../utils/colour';
import Chip from '../Chip/Chip.jsx';
import style from './Palette.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Palette = ({
  chipNum,
  lInflect,
  cMax,
  hueFrom,
  hueTo,
  selected,
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
      console.log(newChips);
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
      className={`${cx('palette', { 'palette--state-selected': selected })}`}
      ref={paletteRef}
    >
      <div className={`${cx('palette__info')}`}>
        <div className={`${cx('palette__info__sticky')}`}>
          <span className={`${cx('palette__info__label')}`}>#</span>
          <span className={`${cx('palette__info__value')}`}>
            {`${chipNum + 1}`}
          </span>
          {` `}
          <span className={`${cx('palette__info__label')}`}>{`H:`}</span>
          <span className={`${cx('palette__info__value')}`}>
            {`${setDigitLength(hueFrom, 3, 1)}-${setDigitLength(hueTo, 3, 1)}`}
          </span>{' '}
          <span className={`${cx('palette__info__label')}`}>{`Cm:`}</span>
          <span className={`${cx('palette__info__value')}`}>
            {`${setDigitLength(cMax, 0, 3)}`}
          </span>{' '}
          <span className={`${cx('palette__info__label')}`}>{`Li:`}</span>
          <span className={`${cx('palette__info__value')}`}>
            {`${setDigitLength(lInflect, 0, 3)}`}
          </span>
        </div>
      </div>
      <ul className={`${cx('palette__chips')}`}>
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
