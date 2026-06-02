const EASTERN = '٠١٢٣٤٥٦٧٨٩'

/** Convert Eastern Arabic-Indic digits to Western (0-9) for slides */
export function toWesternDigits(text) {
  if (text == null) return ''
  return String(text).replace(/[٠-٩]/g, (d) => String(EASTERN.indexOf(d)))
}

export function formatPageNum(n) {
  return String(n)
}
