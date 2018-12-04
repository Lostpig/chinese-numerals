declare global {
  interface Window {
    chineseNumerals: ChineseNumerals
  }
}

export interface DigitTable {
  digit: [string, string, string, string, string, string, string, string, string, string]
  unit: [string, string, string]
  scale: string[]
  dot: string
  negative: string
}
export interface ChineseNumerals {
  setDigit: (digitTable: DigitTable) => void
  converter: (num: number | string) => string
  transform: (num: number | string) => string
  SimplifiedLetters: DigitTable
  TraditionalLetters: DigitTable
}

const SimplifiedLetters: DigitTable = {
  digit: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
  unit: ['十', '百', '千'],
  scale: ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载'],
  dot: '点',
  negative: '负'
}
const TraditionalLetters: DigitTable = {
  digit: ['零', '壹', '貳', '叁', '肆', '伍', '陸', '柒', '捌', '玖'],
  unit: ['拾', '佰', '仟'],
  scale: ['萬', '億', '兆', '京', '垓', '秭', '穰', '溝', '澗', '正', '載'],
  dot: '點',
  negative: '負'
}

let usingDigit = SimplifiedLetters
const getScale = (scaleIndex: number, section: string) => {
  if (scaleIndex < 1) return ''
  const i = (scaleIndex - 1) % usingDigit.scale.length

  if (i === usingDigit.scale.length - 1) {
    return usingDigit.scale[i]
  } else {
    return section === '' ? '' : usingDigit.scale[i]
  }
}
const getUnit = (num: number, pos: number) => {
  const index = pos % 4
  if (num === 0 || index === 0) return ''
  return usingDigit.unit[index - 1]
}
const getDigit = (num: number, pos: number) => {
  return (pos % 4 === 1 && num === 1) ? '' : usingDigit.digit[num]
}
const getDot = () => {
  return usingDigit.dot
}
const getNegative = () => {
  return usingDigit.negative
}

const warn = (msg: string) => {
  if (typeof console !== 'undefined' && console.warn) {
    console.warn(msg)
  }
}

/**
 * dividing number string by ten thousand
 * @param str integer string
 */
const divideInteger = (str: string) => {
  let section: string[] = []
  const intCollection: string[][] = []
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code < 48 || code > 57) {
      throw new TypeError('argument is not a right digit')
    }
    section.push(str[i])
    if (section.length >= 4) {
      intCollection.push(section)
      section = []
    }
  }
  if (section.length > 0) {
    intCollection.push(section)
  }
  return intCollection
}
/**
 * convert a ten thousand section to chinese word and add power of ten thousand words
 * @param section ten thousand section, it is reverse, ['4', '3', '2' , '1'] => 1234
 * @param scaleLevel power of ten thousand, use to add chinese words like (万,亿,兆)
 */
const convertIntSection = (section: string[], scaleLevel: number) => {
  let notZeroFlag = false
  const sectionStr = section.map((item, unitLevel) => {
    const digit = parseInt(item, 10)
    if (digit === 0 && notZeroFlag) {
      notZeroFlag = false
      return getDigit(0, 0)
    } else if (digit > 0) {
      notZeroFlag = true
      return getDigit(digit, unitLevel) + getUnit(digit, unitLevel)
    } else {
      return ''
    }
  }).reverse().join('')
  return sectionStr + getScale(scaleLevel, sectionStr)
}
/**
 * convert a collection of ten thousand section
 * @param collection a collection of ten thousand section, call splitNumStr function to dividing a number string to collection
 */
const convertIntCollection = (collection: string[][]) => {
  const sectionDes = collection.map((section, index) => {
    const sectionStr = convertIntSection(section, index)
    return sectionStr
  }).reverse().join('')

  return sectionDes
}
/**
 * transform arabic digit to chinese number characters with out chinese syntax, also can convert the decimal part of number
 * @param decimal number or numberic string
 */
const transformDecimal = (decimal: string) => {
  return decimal.split('').map(char => {
    let result
    switch (char) {
      case '-':
        result = getNegative()
        break
      case '.':
        result = getDot()
        break
      default:
        result = getDigit(parseInt(char, 10), 0)
        break
    }
    return result
  }).join('')
}
/**
 * split number to integer part and decimal part
 * @param num numeric string
 */
const splitNumber = (num: string): string[] => {
  const parts = num.split('.')
  if (parts.length > 2) {
    throw new TypeError('argument is not a right number string')
  }
  if (!/^\d+$/.test(parts[0])) {
    throw new TypeError('argument is not a right number string')
  }
  if (parts[1] && !/^\d+$/.test(parts[1])) {
    throw new TypeError('argument is not a right number string')
  }

  if (parts[0].startsWith('0')) {
    const notZeroMatch = parts[0].match(/[^0]/)

    if (notZeroMatch) {
      parts[0] = parts[0].slice(notZeroMatch.index)
    } else {
      parts[0] = '0'
    }
  }
  if (parts[1] && parts[1].endsWith('0')) {
    const zeroMatch = parts[1].match(/0+$/)
    if (zeroMatch) {
      parts[1] = parts[1].slice(0, zeroMatch.index)
    }
  }

  return parts
}
/**
 * convert paramter to chinese
 * @param num numberic string
 */
const toChinese = (num: string): string => {
  let isNegative = num[0] === '-'
  if (isNegative) num = num.slice(1)

  const parts = splitNumber(num)

  const intPart = parts[0]
  const decPart = parts[1]
  let intStr
  if (intPart === '0') {
    intStr = getDigit(0, 0)
  } else {
    const intCollection = divideInteger(intPart)
    intStr = convertIntCollection(intCollection)
  }

  const decStr = decPart ? transformDecimal('.' + decPart) : ''
  const negative = (isNegative && (intPart !== '0' || decPart)) ? getNegative() : ''

  return negative + intStr + decStr
}

/**
 * to set using chinese digit words table
 * @param digit a DigitTable of using digit words
 */
const setDigit = (digit: DigitTable) => {
  usingDigit = digit
}
/**
 * converter number to chinese number words
 * @param num number or numberic string
 */
const converter = (num: string | number) => {
  if (typeof num === 'number') {
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
      warn('the parameter is greater than the MAX_SAFE_INTEGER or less than the MIN_SAFE_INTEGER\ncall with a number string parameter')
    }
    num = num.toString()
  }
  return toChinese(num)
}
/**
 * just transform arabic digit to chinese number characters with out chinese syntax
 * @param num number or numberic string
 */
const transform = (num: string | number) => {
  if (typeof num === 'number') {
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
      warn('the parameter is greater than the MAX_SAFE_INTEGER or less than the MIN_SAFE_INTEGER\ncall with a number string parameter')
    }
    num = num.toString()
  }
  return transformDecimal(num)
}

const chineseNumerals: ChineseNumerals = {
  setDigit, converter, transform, SimplifiedLetters, TraditionalLetters
}
export default chineseNumerals
