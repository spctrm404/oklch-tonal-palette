import { clampChroma, converter } from 'culori';
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
  const normalGamutProperties = () => {
    let text = '';
    colours.forEach((aColour, idx) => {
      const num = idx * selectedPalette.swatchStep;
      if (aColour.inSrgb) {
        text += `${'\n'}    --${name}-${num}: oklch(${aColour.l} ${aColour.c} ${
          aColour.h
        }deg);`;
      } else {
        const sRgbClamppedOklch = clampChroma(aColour, 'oklch', 'rgb');
        text += `${'\n'}    --${name}-${num}: oklch(${closestQuantized(
          sRgbClamppedOklch.l,
          LIGHTNESS_STEP
        )} ${closestQuantized(
          sRgbClamppedOklch.c,
          CHROMA_STEP
        )} ${closestQuantized(sRgbClamppedOklch.h, HUE_STEP)}deg);`;
      }
    });
    return text;
  };
  const wideGamutProperties = () => {
    let text = '';
    colours.forEach((aColour, idx) => {
      const num = idx * selectedPalette.swatchStep;
      text += `${'\n'}  --${name}-${num}: oklch(${aColour.l} ${aColour.c} ${
        aColour.h
      }deg);`;
    });
    return text;
  };
  script += ':root {';
  script += wideGamutProperties();
  script += '\n';
  script += '}';
  script += '\n';
  script += '@supports not(color-gamut: p3) {';
  script += '\n';
  script += '  ';
  script += ':root {';
  script += normalGamutProperties();
  script += '\n';
  script += '  ';
  script += '}';
  script += '\n';
  script += '}';
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
  const normalGamutProperties = () => {
    let text = '';
    colours.forEach((aColour, idx) => {
      const toRgb = converter('rgb');
      const num = idx * selectedPalette.swatchStep;
      const sRgbClamppedRgb = toRgb(
        aColour.inSrgb ? aColour : clampChroma(aColour, 'oklch', 'rgb')
      );
      if (num === 0) {
        text += `${'\n'}    --${name}-${num}: color(srgb 0 0 0);`;
      } else if (num === 100) {
        text += `${'\n'}    --${name}-${num}: color(srgb 255 255 255);`;
      } else {
        text += `${'\n'}    --${name}-${num}: color(srgb ${Math.floor(
          255 * sRgbClamppedRgb.r
        )} ${Math.floor(255 * sRgbClamppedRgb.g)} ${Math.floor(
          255 * sRgbClamppedRgb.b
        )});`;
      }
    });
    return text;
  };
  const wideGamutProperties = () => {
    let text = '';
    colours.forEach((aColour, idx) => {
      const toRgb = converter('p3');
      const p3Rgb = toRgb(aColour);
      const num = idx * selectedPalette.swatchStep;
      if (num === 0) {
        text += `${'\n'}  --${name}-${num}: color(display-p3 0 0 0);`;
      } else if (num === 100) {
        text += `${'\n'}  --${name}-${num}: color(display-p3 1 1 1);`;
      } else {
        text += `${'\n'}  --${name}-${num}: color(display-p3 ${closestQuantized(
          p3Rgb.r,
          COLOUR_FLOAT_DECIMAL_PRECISION
        )} ${closestQuantized(
          p3Rgb.g,
          COLOUR_FLOAT_DECIMAL_PRECISION
        )} ${closestQuantized(p3Rgb.b, COLOUR_FLOAT_DECIMAL_PRECISION)});`;
      }
    });
    return text;
  };
  script += ':root {';
  script += wideGamutProperties();
  script += ';';
  script += '\n';
  script += '}';
  script += '\n';
  script += '@supports not(color-gamut: p3) {';
  script += '\n';
  script += '  ';
  script += ':root {';
  script += normalGamutProperties();
  script += '\n';
  script += '  ';
  script += '}';
  script += '\n';
  script += '}';
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
  const normalGamutProperties = () => {
    let text = '';
    colours.forEach((aColour, idx) => {
      const toRgb = converter('rgb');
      const num = idx * selectedPalette.swatchStep;
      const sRgbClamppedRgb = toRgb(
        aColour.inSrgb ? aColour : clampChroma(aColour, 'oklch', 'rgb')
      );
      if (num === 0) {
        text += `${'\n'}  --${name}-${num}: #000000;`;
      } else if (num === 100) {
        text += `${'\n'}  --${name}-${num}: #FFFFFF;`;
      } else {
        text += `${'\n'}  --${name}-${num}: #${Math.floor(
          255 * sRgbClamppedRgb.r
        )
          .toString(16)
          .toUpperCase()
          .padStart(2, '0')}${Math.floor(255 * sRgbClamppedRgb.g)
          .toString(16)
          .toUpperCase()
          .padStart(2, '0')}${Math.floor(255 * sRgbClamppedRgb.b)
          .toString(16)
          .toUpperCase()
          .padStart(2, '0')};`;
      }
    });
    return text;
  };
  script += ':root {';
  script += normalGamutProperties();
  script += '\n';
  script += '}';
  return script;
};

export const exportFigmaHex = (selectedPalette, name = 'colour') => {
  let script = '';
  const colours = createColours(
    Math.floor(100 / selectedPalette.swatchStep),
    selectedPalette.lightnessInflect,
    selectedPalette.peakChroma,
    selectedPalette.hueFrom,
    selectedPalette.hueTo
  );
  const wideGamutProperties = () => {
    let text = '';
    colours.forEach((aColour, idx) => {
      const toRgb = converter('p3');
      const p3Rgb = toRgb(aColour);
      const num = idx * selectedPalette.swatchStep;
      if (num === 0) {
        text += `${'\n'}${name}-${num}: #000000FF;`;
      } else if (num === 100) {
        text += `${'\n'}${name}-${num}: #FFFFFFFF;`;
      } else {
        text += `${'\n'}${name}-${num}: #${Math.floor(255 * p3Rgb.r)
          .toString(16)
          .toUpperCase()
          .padStart(2, '0')}${Math.floor(255 * p3Rgb.g)
          .toString(16)
          .toUpperCase()
          .padStart(2, '0')}${Math.floor(255 * p3Rgb.b)
          .toString(16)
          .toUpperCase()
          .padStart(2, '0')}FF;`;
      }
    });
    return text;
  };
  script += wideGamutProperties();
  return script;
};
