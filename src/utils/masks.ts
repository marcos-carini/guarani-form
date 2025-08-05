export const phoneMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length === 0) {
    return '';
  }

  const limitedNumbers = numbers.slice(0, 11);

  if (limitedNumbers.length < 2) {
    return `(${limitedNumbers}`;
  } else if (limitedNumbers.length === 2) {
    return `(${limitedNumbers}`;
  } else if (limitedNumbers.length <= 6) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 10) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
  }
};

export const cpfMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length === 0) return '';

  const limitedNumbers = numbers.slice(0, 11);

  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
  } else if (limitedNumbers.length <= 9) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9, 11)}`;
  }
};

export const cnpjMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length === 0) return '';

  const limitedNumbers = numbers.slice(0, 14);

  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 5) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 8) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5)}`;
  } else if (limitedNumbers.length <= 12) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8)}`;
  } else {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2, 5)}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8, 12)}-${limitedNumbers.slice(12, 14)}`;
  }
};

export const cepMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '')

  if (numbers.length === 0) return ''

  const limitedNumbers = numbers.slice(0, 8) 

  if (limitedNumbers.length <= 5) {
    return limitedNumbers
  }

  return `${limitedNumbers.slice(0, 5)}-${limitedNumbers.slice(5)}`
}


export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '');
};
