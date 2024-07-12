import { apcach, crToBg, maxChroma } from 'apcach';
import { clampChroma, displayable } from 'culori';

export const getTextColor = (l, c, h, contrast, direction = 'auto') => {
  return apcach(
    crToBg(`oklch(${l * 100}% ${c} ${h}deg)`, contrast, 'apca', direction),
    maxChroma(),
    h,
    100,
    'p3'
  );
};

export const createAChip = (idx, chipNum, lInflect, cMax, hueFrom, hueTo) => {
  if (idx < 0 || chipNum < 1) return null;

  if (idx === 0)
    return {
      id: crypto.randomUUID(),
      mode: `oklch`,
      l: 0,
      c: 0,
      h: hueFrom,
      inP3: true,
      inSrgb: true,
    };

  if (idx === chipNum)
    return {
      id: crypto.randomUUID(),
      mode: `oklch`,
      l: 1,
      c: 0,
      h: hueTo,
      inP3: true,
      inSrgb: true,
    };

  const lightness = idx / chipNum;

  const chroma =
    lInflect === 1
      ? cMax * lightness
      : lInflect === 0
      ? cMax * (1 - lightness)
      : lightness < lInflect
      ? (cMax / lInflect) * lightness
      : (cMax / (1 - lInflect)) * (1 - lightness);

  const hue =
    hueFrom === hueTo
      ? hueFrom
      : hueFrom < hueTo
      ? (hueFrom + (idx * (hueTo - hueFrom)) / chipNum) % 360
      : (hueFrom + (idx * (hueTo + 360 - hueFrom)) / chipNum) % 360;

  const colour = `oklch(${lightness} ${chroma} ${hue})`;
  const clamppedColour = clampChroma(colour, `oklch`, `p3`);
  const inP3 = chroma <= clamppedColour.c;
  const inSrgb = displayable(colour);

  return {
    id: crypto.randomUUID(),
    mode: `oklch`,
    l: clamppedColour.l,
    c: clamppedColour.c,
    h: clamppedColour.h,
    inP3: inP3,
    inSrgb: inSrgb,
  };
};

export const createChips = (chipNum, lInflect, cMax, hueFrom, hueTo) => {
  const chips = [];

  for (let n = 0; n <= chipNum; n++) {
    const aChip = createAChip(n, chipNum, lInflect, cMax, hueFrom, hueTo);
    chips.push(aChip);
  }

  return chips;
};
