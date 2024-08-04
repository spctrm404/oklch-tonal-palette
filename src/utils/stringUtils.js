export const formatNumLength = (num, integerLength, decimalLength) => {
  const [integerPart, decimalPart] = num.toFixed(decimalLength).split('.');
  const paddedInteger = integerPart.padStart(integerLength, '0');
  return `${
    integerLength > 0 ? paddedInteger : integerLength < 0 ? integerPart : ``
  }${decimalLength > 0 ? `.${decimalPart}` : ``}`;
};

export const formatNumLengthToStepPrecision = (num, step) => {
  const decimalLen = (step.toString().split('.')[1] || '').length;
  return formatNumLength(num, -1, decimalLen);
};

export const camelToKebab = (camelString) => {
  const trimmedString = camelString.trim();
  const kebabString = trimmedString
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .replace(/(\d)([a-zA-Z])/g, '$1-$2')
    .toLowerCase();
  return kebabString;
};

export const replaceCamelCaseWord = (
  camelString,
  targetWord,
  replacementWord
) => {
  const trimmed = camelString.trim();
  return trimmed.replace(new RegExp(targetWord, 'gi'), () => {
    return replacementWord
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
  });
};

export const disassembleDigits = (num) => {
  const [intPart, decimalPart] = num.toString().split('.');
  return [intPart, decimalPart];
};
