Chinese Numerals  
==========================

将阿拉伯数字转换为中文格式  

## Features  
- 以万为进位，转换数字为符合中文语法的中文格式数字  
- 支持使用自定义的文字字符，默认使用简体中文，并内置繁体中文字符集  
- 提供简单转换方式，不使用单位表示，直接使用数字表示  
- 支持以字符串传入的超大数字参数参数  

## Install  
```bash
$ npm install chinese-numerals
```
## Broswer
可以直接通过script引入，也支持amd  
需要Array.prototype.map支持  

## API
```typescript
interface ChineseNumerals {
    setDigit: (digitTable: DigitTable) => void;
    converter: (num: number | string) => string;
    transform: (num: number | string) => string;
    SimplifiedLetters: DigitTable;
    TraditionalLetters: DigitTable;
}
```
  
#### setDigit (digitTable: DigitTable) => void  
> 设置使用的字符集合  
> 其中，传入的digitTable参数格式  

```typescript
interface DigitTable {
    digit: [string, string, string, string, string, string, string, string, string, string];
    unit: [string, string, string];
    scale: string[];
    dot: string;
    negative: string;
}
```

> 可以基于内置的字符集改变部分字符来使用  

```typescript
const customDigits = Object.assign({}, chineseNumerals.SimplifiedLetters, {
  digit: ['〇', '一', '两', '三', '四', '五', '六', '七', '八', '九']
})
chineseNumerals.setDigit(customDigits)
```
  
#### converter (num: number | string) => string  
> 转换数字为符合中文语法的数字字符串，对于超大数字可使用字符串参数  
> 默认使用的位数为['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载']  

```typescript
chineseNumerals.converter(105500050)  // 一亿零五百五十万零五十
// 超大数使用字符串
chineseNumerals.converter('19007199254740993')  // 一京九千零七兆一千九百九十二亿五千四百七十四万零九百九十三

// 可通过自定义字符集来使用特定位表示
const customDigits = Object.assign({}, chineseNumerals.SimplifiedLetters, {
  scale: ['万', '亿'] // 只使用万和亿
})
chineseNumerals.setDigit(customDigits)
chineseNumerals.converter(1000000050005)  // 一万亿零五万零五 (一兆零五万零五)
chineseNumerals.converter('100000000000000000000000')  // 一千万亿亿 (一千垓)
chineseNumerals.converter('10000040004400000320000')  // 一百万零四亿零四万四千亿零三十二万 (一百垓零四京零四兆四千亿零三十二万)
```
  
#### transform (num: number | string) => string  
> 直接转换数字为中文字符数字，不进行基于中文语法的位数转换  

```typescript
const customDigits = Object.assign({}, chineseNumerals.SimplifiedLetters, {
  digit: ['洞', '幺', '两', '三', '四', '五', '六', '拐', '八', '九']
})
chineseNumerals.setDigit(customDigits)

chineseNumerals.transform('001')  // 洞洞幺
chineseNumerals.transform('13012345678')  // 幺三洞幺两三四五六拐八
```

## License
(The MIT License)  
