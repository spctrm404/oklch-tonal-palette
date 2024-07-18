import { useEffect, useRef, useState } from 'react';
import {
  HUE_INT_LEN,
  LIGHTNESS_DECIMAL_LEN,
  CHROMA_DECIMAL_LEN,
  HUE_DECIMAL_LEN,
} from '../../utils/constants';
import { formatNumLength } from '../../utils/stringUtils';
import { createChips } from '../../utils/colourUtils';
import Chip from '../Chip/Chip.jsx';
import style from './Palette.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const Palette = ({
  totalChips,
  lInflect,
  cMax,
  hFrom,
  hTo,
  selected,
  onClickPalette,
}) => {
  const renderCnt = useRef(0);
  const paletteRef = useRef(null);

  const [chips, setChips] = useState(
    createChips(totalChips, lInflect, cMax, hFrom, hTo)
  );

  useEffect(() => {
    setChips((prevChips) => {
      const newChips = createChips(totalChips, lInflect, cMax, hFrom, hTo);
      console.log(newChips);
      return newChips.map((aNewChip, idx) => {
        const aPrevChip = prevChips[idx];
        return aPrevChip ? { ...aNewChip, id: aPrevChip.id } : aNewChip;
      });
    });

    renderCnt.current = renderCnt.current + 1;
    console.log('palette', renderCnt.current);
  }, [totalChips, lInflect, cMax, hFrom, hTo]);

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
            {`${totalChips + 1}`}
          </span>
          {` `}
          <span className={`${cx('palette__info__label')}`}>{`H:`}</span>
          <span className={`${cx('palette__info__value')}`}>
            {`${formatNumLength(
              hFrom,
              HUE_INT_LEN,
              HUE_DECIMAL_LEN
            )}-${formatNumLength(hTo, HUE_INT_LEN, HUE_DECIMAL_LEN)}`}
          </span>{' '}
          <span className={`${cx('palette__info__label')}`}>{`Cm:`}</span>
          <span className={`${cx('palette__info__value')}`}>
            {`${formatNumLength(cMax, 0, CHROMA_DECIMAL_LEN)}`}
          </span>{' '}
          <span className={`${cx('palette__info__label')}`}>{`Li:`}</span>
          <span className={`${cx('palette__info__value')}`}>
            {`${formatNumLength(lInflect, 0, LIGHTNESS_DECIMAL_LEN)}`}
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
