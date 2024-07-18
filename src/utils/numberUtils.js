export const setMultipleOfStep = (num, step) => {
  const decimalLen = (step.toString().split('.')[1] || '').length;
  const multiplied = Math.round(num / step) * step;
  const steppedValue = parseFloat(multiplied.toFixed(decimalLen));
  return steppedValue;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};
