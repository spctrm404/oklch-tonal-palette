import { converter } from 'culori';
import { createColours } from './colourUtils';

export const exportCss = (selectedPalette, name = 'colour') => {
  console.log(selectedPalette);
  let script = '';
  const colours = createColours(
    Math.floor(100 / selectedPalette.swatchStep),
    selectedPalette.lightnessInflect,
    selectedPalette.peakChroma,
    selectedPalette.hueFrom,
    selectedPalette.hueTo
  );
  const normalGamutProperties = colours.map((aColour, idx) => {
    const toRgb = converter('rgb');
    const sRgbClamppedRgb = toRgb(aColour);
    const num = idx * selectedPalette.swatchStep;
    if (num === 0) {
      return `${'\n'}  --${name}-${num}: rgb(0, 0, 0)`;
    } else if (num === 100) {
      return `${'\n'}  --${name}-${num}: rgb(255, 255, 255)`;
    }
    return `${'\n'}  --${name}-${num}: rgb(${Math.floor(
      255 * sRgbClamppedRgb.r
    )}, ${Math.floor(255 * sRgbClamppedRgb.g)}, ${Math.floor(
      255 * sRgbClamppedRgb.b
    )})`;
  });
  const wideGamutProperties = colours.map((aColour, idx) => {
    const num = idx * selectedPalette.swatchStep;
    return `${'\n'}    --${name}-${num}: oklch(${aColour.l} ${aColour.c} ${
      aColour.h
    }deg)`;
  });
  script += ':root {';
  script += normalGamutProperties;
  script += '\n';
  script += '};';
  script += '\n';
  script += '@media (color-gamut: srgb) {';
  script += '\n';
  script += '  ';
  script += ':root {';
  script += wideGamutProperties;
  script += '\n';
  script += '  ';
  script += '};';
  script += '\n';
  script += '};';
  return script;
};
