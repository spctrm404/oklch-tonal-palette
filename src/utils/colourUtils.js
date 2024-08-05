import { apcach, crToBg, maxChroma } from 'apcach';
import { clampChroma, displayable } from 'culori';
import { CHROMA_STEP, CHROMA_LIMIT } from './constants';

export const hueOfLightness = (lightness, hueFrom, hueTo) => {
  const hue =
    hueFrom === hueTo
      ? hueFrom
      : hueFrom < hueTo
      ? (hueFrom + lightness * (hueTo - hueFrom)) % 360
      : (hueFrom + lightness * (hueTo + 360 - hueFrom)) % 360;
  return hue;
};

export const chromaOfLightness = (lightness, lightnessInflect, peakChroma) => {
  const chroma =
    lightnessInflect === 1
      ? peakChroma * lightness
      : lightnessInflect === 0
      ? peakChroma * (1 - lightness)
      : lightness < lightnessInflect
      ? (peakChroma / lightnessInflect) * lightness
      : (peakChroma / (1 - lightnessInflect)) * (1 - lightness);
  return chroma;
};

export const findApcaCompliantColor = (
  lightness,
  chroma,
  hue,
  contrast,
  direction = 'auto'
) => {
  return apcach(
    crToBg(
      `oklch(${lightness * 100}% ${chroma} ${hue}deg)`,
      contrast,
      'apca',
      direction
    ),
    maxChroma(),
    hue,
    100,
    'p3'
  );
};

// todo: remove uuid (move to other component)
export const createColour = (
  idx,
  totalColours,
  lightnessInflect,
  peakChroma,
  hueFrom,
  hueTo
) => {
  if (idx < 0 || totalColours < 1) return null;

  if (idx === 0)
    return {
      mode: `oklch`,
      l: 0,
      c: 0,
      h: hueFrom,
      inP3: true,
      inSrgb: true,
    };

  if (idx === totalColours)
    return {
      mode: `oklch`,
      l: 1,
      c: 0,
      h: hueTo,
      inP3: true,
      inSrgb: true,
    };

  const lightness = idx / totalColours;
  const chroma = chromaOfLightness(lightness, lightnessInflect, peakChroma);
  const hue = hueOfLightness(lightness, hueFrom, hueTo);

  const rawColour = `oklch(${lightness} ${chroma} ${hue})`;
  const p3ClamppedColour = clampChroma(rawColour, `oklch`, `p3`);
  const inP3 = chroma <= p3ClamppedColour.c;
  const inSrgb = displayable(rawColour);

  return {
    mode: `oklch`,
    l: p3ClamppedColour.l,
    c: p3ClamppedColour.c,
    h: p3ClamppedColour.h,
    inP3: inP3,
    inSrgb: inSrgb,
  };
};

export const createColours = (
  totalColours,
  lightnessInflect,
  peakChroma,
  hueFrom,
  hueTo
) => {
  const colours = [];
  for (let n = 0; n <= totalColours; n++) {
    const colour = createColour(
      n,
      totalColours,
      lightnessInflect,
      peakChroma,
      hueFrom,
      hueTo
    );
    colours.push(colour);
  }
  return colours;
};

export const maxChromaOfLightness = (lightness, hueFrom, hueTo) => {
  const hue = hueOfLightness(lightness, hueFrom, hueTo);
  for (let c = CHROMA_LIMIT; c >= 0; c -= CHROMA_STEP) {
    const rawColour = `oklch(${lightness} ${c} ${hue})`;
    const p3ClamppedColour = clampChroma(rawColour, `oklch`, `p3`);
    const inP3 = c <= p3ClamppedColour.c;

    if (inP3) return c;
  }
  return 0;
};
