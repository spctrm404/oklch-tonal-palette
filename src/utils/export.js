import { clampChroma, converter, formatHex } from 'culori';
import {
  LIGHTNESS_STEP,
  CHROMA_STEP,
  HUE_STEP,
  COLOUR_FLOAT_DECIMAL_PRECISION,
} from './constants';
import { closestQuantized } from './numberUtils';
import { createColours } from './colourUtils';

export const exportCssOklch = (selectedPalette, name = 'colour') => {
  let script = '';
  const colours = createColours(
    Math.floor(100 / selectedPalette.swatchStep),
    selectedPalette.lightnessInflect,
    selectedPalette.peakChroma,
    selectedPalette.hueFrom,
    selectedPalette.hueTo
  );
  const normalGamutProperties = colours.map((aColour, idx) => {
    const num = idx * selectedPalette.swatchStep;
    if (aColour.inSrgb)
      return `${'\n'}  --${name}-${num}: oklch(${aColour.l} ${aColour.c} ${
        aColour.h
      }deg)`;
    const sRgbClamppedOklch = clampChroma(aColour, 'oklch', 'rgb');
    return `${'\n'}  --${name}-${num}: oklch(${closestQuantized(
      sRgbClamppedOklch.l,
      LIGHTNESS_STEP
    )} ${closestQuantized(sRgbClamppedOklch.c, CHROMA_STEP)} ${closestQuantized(
      sRgbClamppedOklch.h,
      HUE_STEP
    )}deg)`;
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
  script += '@media (color-gamut: p3) {';
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

export const exportCssRgb = (selectedPalette, name = 'colour') => {
  let script = '';
  const colours = createColours(
    Math.floor(100 / selectedPalette.swatchStep),
    selectedPalette.lightnessInflect,
    selectedPalette.peakChroma,
    selectedPalette.hueFrom,
    selectedPalette.hueTo
  );
  // need to fix
  const normalGamutProperties = colours.map((aColour, idx) => {
    const sRgbClamppedOklch = clampChroma(aColour, 'oklch', 'rgb');
    const toSrgb = converter('rgb');
    const sRgbClamppedRgb = toSrgb(sRgbClamppedOklch);
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
    const toP3Rgb = converter('p3');
    const p3Rgb = toP3Rgb(aColour);
    const num = idx * selectedPalette.swatchStep;
    if (num === 0) {
      return `${'\n'}    --${name}-${num}: color(display-p3 0 0 0)`;
    } else if (num === 100) {
      return `${'\n'}    --${name}-${num}: color(display-p3 1 1 1)`;
    }
    return `${'\n'}    --${name}-${num}: color(display-p3 ${closestQuantized(
      p3Rgb.r,
      COLOUR_FLOAT_DECIMAL_PRECISION
    )} ${closestQuantized(
      p3Rgb.g,
      COLOUR_FLOAT_DECIMAL_PRECISION
    )} ${closestQuantized(p3Rgb.b, COLOUR_FLOAT_DECIMAL_PRECISION)})`;
    // return `${'\n'}    --${name}-${num}: color(display-p3 ${Math.floor(
    //   255 * p3Rgb.r
    // )} ${Math.floor(255 * p3Rgb.g)} ${Math.floor(255 * p3Rgb.b)})`;
  });
  script += ':root {';
  script += normalGamutProperties;
  script += '\n';
  script += '};';
  script += '\n';
  script += '@media (color-gamut: p3) {';
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

export const exportCssHex = (selectedPalette, name = 'colour') => {
  let script = '';
  const colours = createColours(
    Math.floor(100 / selectedPalette.swatchStep),
    selectedPalette.lightnessInflect,
    selectedPalette.peakChroma,
    selectedPalette.hueFrom,
    selectedPalette.hueTo
  );
  const normalGamutProperties = colours.map((aColour, idx) => {
    const sRgbClamppedOklch = clampChroma(aColour, 'oklch', 'rgb');
    const toSrgb = converter('rgb');
    const sRgbClamppedRgb = toSrgb(sRgbClamppedOklch);
    const sRgbClamppedHex = formatHex(sRgbClamppedRgb);
    const num = idx * selectedPalette.swatchStep;
    if (num === 0) {
      return `${'\n'}  --${name}-${num}: #000000`;
    } else if (num === 100) {
      return `${'\n'}  --${name}-${num}: #FFFFFF`;
    }
    return `${'\n'}  --${name}-${num}: ${sRgbClamppedHex}`;
  });
  const wideGamutProperties = colours.map((aColour, idx) => {
    const hex = formatHex(aColour);
    const num = idx * selectedPalette.swatchStep;
    if (num === 0) {
      return `${'\n'}    --${name}-${num}: #000000`;
    } else if (num === 100) {
      return `${'\n'}    --${name}-${num}: #FFFFFF`;
    }
    return `${'\n'}    --${name}-${num}: ${hex}`;
  });
  script += ':root {';
  script += normalGamutProperties;
  script += '\n';
  script += '};';
  script += '\n';
  script += '@media (color-gamut: p3) {';
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
