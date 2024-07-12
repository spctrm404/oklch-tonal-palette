export const setDigitLength = (num, intLen, decimalLen) => {
  const fixed = num.toFixed(decimalLen);
  const [intPart, decimalPart] = fixed.split('.');
  const paddedInt = intPart.padStart(intLen, '0');
  return `${intLen > 0 ? paddedInt : ``}${
    decimalLen > 0 ? `.${decimalPart}` : ``
  }`;
};

export const setMultipleOfStep = (value, step) => {
  const decimalPlaces = (step.toString().split('.')[1] || '').length;
  const multiplied = Math.round(value / step) * step;
  const steppedValue = parseFloat(multiplied.toFixed(decimalPlaces));
  return steppedValue;
};
