import { describe, expect, test } from '@jest/globals';
import { divDecimals, timesDecimals } from '../../src/calculate';
import BigNumber from 'bignumber.js';

describe('timesDecimals', () => {
  test('amount is undefined, and return ZERO', () => {
    const result = timesDecimals(undefined);
    expect(result).toBeInstanceOf(BigNumber);
  });
  test('amount is USDT, and return ZERO', () => {
    const result = timesDecimals('USDT');
    expect(result).toBeInstanceOf(BigNumber);
  });
  test('amount is 1.2345678 and decimals is 10000000000, and return 12345678000', () => {
    const result = timesDecimals('1.2345678', '10000000000').toFixed();
    expect(result).toBe('12345678000');
  });
  test('amount is 1.2345678 and decimals is 6, return 1234567.8', () => {
    const result = timesDecimals('1.2345678', 6).toFixed();
    expect(result).toBe('1234567.8');
  });
});

describe('divDecimals', () => {
  test('amount is undefined, and return ZERO', () => {
    const result = divDecimals(undefined);
    expect(result).toBeInstanceOf(BigNumber);
  });
  test('amount is USDT, and return ZERO', () => {
    const result = divDecimals('USDT');
    expect(result).toBeInstanceOf(BigNumber);
  });
  test('amount is 12345678 and decimals is 10000000000, and return 12345678000', () => {
    const result = divDecimals('12345678', '10000000000').toFixed();
    expect(result).toBe('0.0012345678');
  });
  test('amount is 12345678 and decimals is 6, and return 12.345678', () => {
    const result = divDecimals('12345678', 6).toFixed();
    expect(result).toBe('12.345678');
  });
});
