import { apcach, crToBg, maxChroma } from 'apcach';
import { clampChroma, displayable } from 'culori';
import { clamp } from './numberUtils';
import { CHROMA_STEP, CHROMA_MAX, P3_CHROMA_MAX_OFFSET } from './constants';

export const getHueOfLightness = (l, hFrom, hTo) => {
  const h =
    hFrom === hTo
      ? hFrom
      : hFrom < hTo
      ? (hFrom + l * (hTo - hFrom)) % 360
      : (hFrom + l * (hTo + 360 - hFrom)) % 360;
  return h;
};

export const getApcaTxtColour = (l, c, h, contrast, dir = 'auto') => {
  return apcach(
    crToBg(`oklch(${l * 100}% ${c} ${h}deg)`, contrast, 'apca', dir),
    maxChroma(),
    h,
    100,
    'p3'
  );
};

export const createAChip = (idx, totalChips, lInflect, cMax, hFrom, hTo) => {
  if (idx < 0 || totalChips < 1) return null;

  if (idx === 0)
    return {
      id: crypto.randomUUID(),
      mode: `oklch`,
      l: 0,
      c: 0,
      h: hFrom,
      inP3: true,
      inSrgb: true,
    };

  if (idx === totalChips)
    return {
      id: crypto.randomUUID(),
      mode: `oklch`,
      l: 1,
      c: 0,
      h: hTo,
      inP3: true,
      inSrgb: true,
    };

  const l = idx / totalChips;

  const c =
    lInflect === 1
      ? cMax * l
      : lInflect === 0
      ? cMax * (1 - l)
      : l < lInflect
      ? (cMax / lInflect) * l
      : (cMax / (1 - lInflect)) * (1 - l);

  const h = getHueOfLightness(l, hFrom, hTo);

  const rawColour = `oklch(${l} ${c} ${h})`;
  const p3ClamppedColour = clampChroma(rawColour, `oklch`, `p3`);
  const inP3 = c <= p3ClamppedColour.c;
  const inSrgb = displayable(rawColour);

  return {
    id: crypto.randomUUID(),
    mode: `oklch`,
    l: p3ClamppedColour.l,
    c: p3ClamppedColour.c,
    h: p3ClamppedColour.h,
    inP3: inP3,
    inSrgb: inSrgb,
  };
};

export const createChips = (totalChips, lInflect, cMax, hFrom, hTo) => {
  const chips = [];

  for (let n = 0; n <= totalChips; n++) {
    const aChip = createAChip(n, totalChips, lInflect, cMax, hFrom, hTo);
    chips.push(aChip);
  }

  return chips;
};

export const getMaxChromaOfLightness = (l, hFrom, hTo) => {
  const h = getHueOfLightness(l, hFrom, hTo);

  for (let c = CHROMA_MAX; c >= 0; c -= CHROMA_STEP) {
    const rawColour = `oklch(${l} ${c} ${h})`;
    const p3ClamppedColour = clampChroma(rawColour, `oklch`, `p3`);
    const inP3 = c <= p3ClamppedColour.c;

    if (inP3) return clamp(c - P3_CHROMA_MAX_OFFSET, 0, CHROMA_MAX);
  }
  return 0;
};
