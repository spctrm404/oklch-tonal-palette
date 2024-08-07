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
      className={cx('palette', className)}
      {...(isSelected && { 'data-selected': true })}
      {...(isHovered && { 'data-hovered': true })}
      data-total-swatches={Math.floor(100 / swatchStep) + 1}
      data-theme={theme}
      {...rootInteractionProps}
      {...props}
    >
      <ul className={cx('palette__swatches')}>
        {swatches.map((aSwatch) => {
          return (
            <Swatch
              className={cx('palette__swatch')}
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
  );
};
export default Palette;
