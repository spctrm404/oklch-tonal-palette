export const formatNumLength = (num, intLen, decimalLen) => {
  const fixed = num.toFixed(decimalLen);
  const [intPart, decimalPart] = fixed.split('.');
  const paddedInt = intPart.padStart(intLen, '0');
  return `${intLen > 0 ? paddedInt : intLen < 0 ? intPart : ``}${
    decimalLen > 0 ? `.${decimalPart}` : ``
  }`;
};

export const formatNumLengthToStep = (num, step) => {
  const decimalLen = (step.toString().split('.')[1] || '').length;
  return formatNumLength(num, -1, decimalLen);
};

export const camelToKebab = (camelStr) => {
  const kebabStr = camelStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  return kebabStr;
};
