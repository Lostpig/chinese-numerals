import cnumber from '../src/index'
import * as assert from 'assert'

describe('convert number to chinese', function () {
  it('convert integer', function () {
    const cases = [
      [0, '零'],
      [10, '十'],
      [15, '十五'],
      [20, '二十'],
      [25, '二十五'],
      [100, '一百'],
      [105, '一百零五'],
      [110, '一百十'],
      [115, '一百十五'],
      [120, '一百二十'],
      [125, '一百二十五'],
      [205, '二百零五'],
      [225, '二百二十五'],
      [1000, '一千'],
      [1005, '一千零五'],
      [1050, '一千零五十'],
      [1155, '一千一百五十五'],
      [10000, '一万'],
      [10500, '一万零五百'],
      [100005, '十万零五'],
      [1000005, '一百万零五'],
      [10000005, '一千万零五'],
      [100000005, '一亿零五'],
      [105500050, '一亿零五百五十万零五十']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.converter(item[0]), item[1])
    })
  })
  it('convert decimal', function () {
    const cases = [
      [0.5, '零点五'],
      [0.00005, '零点零零零零五'],
      [1.5, '一点五'],
      [10.5, '十点五'],
      [100.54321, '一百点五四三二一']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.converter(item[0]), item[1])
    })
  })
  it('convert negative', function () {
    const cases = [
      [-1, '负一'],
      [-1.5, '负一点五'],
      [-10, '负十'],
      [-12525, '负一万二千五百二十五'],
      [-5000000005, '负五十亿零五']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.converter(item[0]), item[1])
    })
  })
  it('convert not safe number', function () {
    const cases = [
      [9007199254740993, '九千零七兆一千九百九十二亿五千四百七十四万零九百九十三'],
      [19007199254740993, '一京九千零七兆一千九百九十二亿五千四百七十四万零九百九十三']
    ]
    cases.forEach(item => {
      assert.notEqual(cnumber.converter(item[0]), item[1])
    })
  })
})

describe('convert number string to chinese', function () {
  it('convert integer string', function () {
    const cases = [
      ['0', '零'],
      ['0000000000', '零'],
      ['00005', '五'],
      ['10', '十'],
      ['15', '十五'],
      ['125', '一百二十五'],
      ['10000', '一万'],
      ['105500050', '一亿零五百五十万零五十']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.converter(item[0]), item[1])
    })
  })
  it('convert decimal string', function () {
    const cases = [
      ['0.5000000000', '零点五'],
      ['0.00005', '零点零零零零五'],
      ['1.5', '一点五'],
      ['0000000010.5', '十点五'],
      ['0000000100.543210000000', '一百点五四三二一']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.converter(item[0]), item[1])
    })
  })
  it('convert negative number string', function () {
    const cases = [
      ['-0000001', '负一'],
      ['-1.5', '负一点五'],
      ['-12525', '负一万二千五百二十五'],
      ['-00000', '零']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.converter(item[0]), item[1])
    })
  })
  it('convert not safe number string', function () {
    const cases = [
      ['9007199254740993', '九千零七兆一千九百九十二亿五千四百七十四万零九百九十三'],
      ['19007199254740993', '一京九千零七兆一千九百九十二亿五千四百七十四万零九百九十三']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.converter(item[0]), item[1])
    })
  })
})

describe('set using digit words table', function () {
  it('using traditional chinese', function () {
    cnumber.setDigit(cnumber.TraditionalLetters)
    const cases = [
      [0, '零'],
      [1, '壹'],
      [14587744, '壹仟肆佰伍拾捌萬柒仟柒佰肆拾肆']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.converter(item[0]), item[1])
    })
  })
  it('using custom digit words', function () {
    const customTable = Object.assign({}, cnumber.SimplifiedLetters, {
      digit: ['〇', '一', '两', '三', '四', '五', '六', '七', '八', '九']
    })
    cnumber.setDigit(customTable)

    const cases = [
      [105, '一百〇五'],
      [255, '两百五十五']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.converter(item[0]), item[1])
    })
  })
  it('number greater than using digittable\'s scale count', function () {
    const customTable = Object.assign({}, cnumber.SimplifiedLetters, {
      scale: ['万', '亿']
    })
    cnumber.setDigit(customTable)

    const cases = [
      [1778776554223, '一万七千七百八十七亿七千六百五十五万四千二百二十三'],
      [1000000050005, '一万亿零五万零五'],
      [25780000000000, '二十五万七千八百亿'],
      ['100000000000000000000000', '一千万亿亿']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.converter(item[0]), item[1])
    })
  })
})

describe('transform number to chinese characters', function () {
  it('using custom digit characters', function () {
    const customTable = Object.assign({}, cnumber.SimplifiedLetters, {
      digit: ['洞', '幺', '两', '三', '四', '五', '六', '拐', '八', '九']
    })
    cnumber.setDigit(customTable)

    const cases = [
      [105, '幺洞五'],
      [255, '两五五'],
      ['17055336628', '幺拐洞五五三三六六两八'],
      ['-00010002', '负洞洞洞幺洞洞洞两']
    ]
    cases.forEach(item => {
      assert.equal(cnumber.transform(item[0]), item[1])
    })
  })
})
