export function isValidCNPJ(cnpj: string): boolean {
  const clean = cnpj.replace(/\D/g, '')

  if (clean.length !== 14) return false

  if (/^(\d)\1{13}$/.test(clean)) return false

  let length = clean.length - 2
  let numbers = clean.substring(0, length)
  const digits = clean.substring(length)
  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += +numbers.charAt(length - i) * pos--
    if (pos < 2) pos = 9
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== +digits.charAt(0)) return false

  length = length + 1
  numbers = clean.substring(0, length)
  sum = 0
  pos = length - 7
  for (let i = length; i >= 1; i--) {
    sum += +numbers.charAt(length - i) * pos--
    if (pos < 2) pos = 9
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== +digits.charAt(1)) return false

  return true
}
