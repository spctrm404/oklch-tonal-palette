export const setDigitLength = (num, intLen, decimalLen) => {
  const fixed = num.toFixed(decimalLen);
  const [intPart, decimalPart] = fixed.split('.');
  const paddedInt = intPart.padStart(intLen, '0');
  return `${intLen > 0 ? paddedInt : intLen < 0 ? intPart : ``}${
    decimalLen > 0 ? `.${decimalPart}` : ``
  }`;
};

export const matchDigitToStep = (num, step) => {
  const decimalLen = (step.toString().split('.')[1] || '').length;
  return setDigitLength(num, -1, decimalLen);
};

export const setMultipleOfStep = (num, step) => {
  const decimalLen = (step.toString().split('.')[1] || '').length;
  const multiplied = Math.round(num / step) * step;
  const steppedValue = parseFloat(multiplied.toFixed(decimalLen));
  return steppedValue;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};
