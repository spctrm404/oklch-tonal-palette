import { useCallback, useContext, useEffect, useState } from 'react';
import {
  HUE_INTEGER_LENGTH,
  LIGHTNESS_DECIMAL_LENGTH,
  CHROMA_DECIMAL_LENGTH,
  HUE_DECIMAL_LENGTH,
} from '../../utils/constants';
import { mergeProps, useHover, usePress } from 'react-aria';
import { formatNumLength } from '../../utils/stringUtils';
import { createColours } from '../../utils/colourUtils';
import Swatch from '../Swatch/Swatch.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Palette.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Palette = ({
  uid,
  totalChips: totalSwatches,
  lInflect: lightnessInflect,
  cMax: maxChroma,
  hFrom: hueFrom,
  hTo: hueTo,
  selected: isSelected,
  onClickPalette: onPress = () => {},
  className = '',
  ...props
}) => {
  const initialSwatch = useCallback(() => {
    const newColours = createColours(
      totalSwatches,
      lightnessInflect,
      maxChroma,
      hueFrom,
      hueTo
    );
    return newColours.map((aColour) => {
      return { ...aColour, uid: crypto.randomUUID() };
    });
  }, [totalSwatches, lightnessInflect, maxChroma, hueFrom, hueTo]);
  const updateSwatch = useCallback(() => {
    setSwatches((prevSwatches) => {
      const newColours = createColours(
        totalSwatches,
        lightnessInflect,
        maxChroma,
        hueFrom,
        hueTo
      );
      return newColours.map((aNewColour, idx) => {
        const aPrevSwatchToBeUpdated = prevSwatches[idx];
        return aPrevSwatchToBeUpdated
          ? { ...aNewColour, uid: aPrevSwatchToBeUpdated.uid }
          : { ...aNewColour, uid: crypto.randomUUID() };
      });
    });
  }, [totalSwatches, lightnessInflect, maxChroma, hueFrom, hueTo]);

  const { theme } = useContext(ThemeContext);

  const [swatches, setSwatches] = useState(initialSwatch);

  const onPressHandler = useCallback(() => {
    onPress?.(uid);
  }, [onPress, uid]);

  const { hoverProps, isHovered } = useHover({
    onHoverStart: () => {},
    onHoverEnd: () => {},
    onHoverChange: () => {},
  });
  const { pressProps } = usePress({
    onPress: () => {
      onPressHandler();
    },
    onPressStart: () => {},
    onPressEnd: () => {},
    onPressChange: () => {},
    onPressUp: () => {},
  });
  const rootInteractionProps = mergeProps(hoverProps, pressProps);

  useEffect(() => {
    updateSwatch();
  }, [updateSwatch]);

  return (
    <div
      className={cx('palette', className)}
      {...(isSelected && { 'data-selected': true })}
      {...(isHovered && { 'data-hovered': true })}
      data-total-swatches={totalSwatches}
      data-theme={theme}
      {...rootInteractionProps}
      {...props}
    >
      <div className={cx('palette__header')}>
        <div className={cx('palette__header__stikcy')}>
          <span className={cx('palette__info', 'palette__info--part-label')}>
            #
          </span>
          <span className={cx('palette__info', 'palette__info--part-value')}>
            {totalSwatches + 1}
          </span>
          {` `}
          <span className={cx('palette__info', 'palette__info--part-label')}>
            {'H:'}
          </span>
          <span className={cx('palette__info', 'palette__info--part-value')}>
            {`${formatNumLength(
              hueFrom,
              HUE_INTEGER_LENGTH,
              HUE_DECIMAL_LENGTH
            )}-${formatNumLength(
              hueTo,
              HUE_INTEGER_LENGTH,
              HUE_DECIMAL_LENGTH
            )}`}
          </span>{' '}
          <span className={cx('palette__info', 'palette__info--part-label')}>
            {'Cm:'}
          </span>
          <span className={cx('palette__info', 'palette__info--part-value')}>
            {formatNumLength(maxChroma, 0, CHROMA_DECIMAL_LENGTH)}
          </span>{' '}
          <span className={cx('palette__info', 'palette__info--part-label')}>
            {'Li:'}
          </span>
          <span className={cx('palette__info', 'palette__info--part-value')}>
            {formatNumLength(lightnessInflect, 0, LIGHTNESS_DECIMAL_LENGTH)}
          </span>
        </div>
      </div>
      <ul className={cx('palette__swatches')}>
        {swatches.map((aSwatch) => {
          return (
            <Swatch
              className={cx('palette__swatch')}
              key={aSwatch.id}
              l={aSwatch.l}
              c={aSwatch.c}
              h={aSwatch.h}
              inP3={aSwatch.inP3}
              inSrgb={aSwatch.inSrgb}
            ></Swatch>
          );
        })}
      </ul>
    </div>
  );
};
export default Palette;
