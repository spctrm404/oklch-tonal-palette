import { useCallback, useContext, useEffect, useState } from 'react';
import { mergeProps, useHover, usePress } from 'react-aria';
import { createColours } from '../../utils/colourUtils';
import Swatch from '../Swatch/Swatch.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import st from './_Palette.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(st);

const Palette = ({
  uid,
  swatchStep,
  lightnessInflect,
  peakChroma,
  hueFrom,
  hueTo,
  isSelected,
  onPress = () => {},
  className = '',
  ...props
}) => {
  const initialSwatch = useCallback(() => {
    const newColours = createColours(
      Math.floor(100 / swatchStep),
      lightnessInflect,
      peakChroma,
      hueFrom,
      hueTo
    );
    return newColours.map((aColour) => {
      return { ...aColour, uid: crypto.randomUUID() };
    });
  }, [swatchStep, lightnessInflect, peakChroma, hueFrom, hueTo]);
  const updateSwatch = useCallback(() => {
    setSwatches((prevSwatches) => {
      const newColours = createColours(
        Math.floor(100 / swatchStep),
        lightnessInflect,
        peakChroma,
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
  }, [swatchStep, lightnessInflect, peakChroma, hueFrom, hueTo]);

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
      className={cx('palette', 'palette__root', className)}
      {...(isSelected && { 'data-selected': true })}
      {...(isHovered && { 'data-hovered': true })}
      data-total-swatches={Math.floor(100 / swatchStep)}
      data-theme={theme}
      {...rootInteractionProps}
      {...props}
    >
      <div className={cx('palette__grid', 'palette-grid')}>
        <div className={cx('palette__scale', 'palette-scale')}>
          <div className={cx('palette__scale__num')}>0</div>
          <div className={cx('palette__scale__num')}>10</div>
          <div className={cx('palette__scale__num')}>20</div>
          <div className={cx('palette__scale__num')}>30</div>
          <div className={cx('palette__scale__num')}>40</div>
          <div className={cx('palette__scale__num')}>50</div>
          <div className={cx('palette__scale__num')}>60</div>
          <div className={cx('palette__scale__num')}>70</div>
          <div className={cx('palette__scale__num')}>80</div>
          <div className={cx('palette__scale__num')}>90</div>
          <div className={cx('palette__scale__num')}>100</div>
        </div>
        <ul className={cx('palette__swatches', 'palette-swatches')}>
          {swatches.map((aSwatch) => {
            return (
              <Swatch
                className={cx('palette__swatch', 'palette-swatch')}
                key={aSwatch.uid}
                lightness={aSwatch.l}
                chroma={aSwatch.c}
                hue={aSwatch.h}
                inP3={aSwatch.inP3}
                inSrgb={aSwatch.inSrgb}
              ></Swatch>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default Palette;
