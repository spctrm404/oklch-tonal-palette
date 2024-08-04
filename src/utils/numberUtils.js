export const closestQuantized = (num, step) => {
  const decimalLength = (step.toString().split('.')[1] || '').length;
  let quantizedValue = Math.round(num / step) * step;
  quantizedValue = parseFloat(quantizedValue.toFixed(decimalLength));
  return quantizedValue;
};

export const clamp = (num, minValue, maxValue) => {
  return Math.min(Math.max(num, minValue), maxValue);
};
