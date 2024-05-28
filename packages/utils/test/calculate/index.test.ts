import { describe, expect, test } from '@jest/globals';
import { divDecimals, timesDecimals } from '../../src/calculate';

describe('timesDecimals', () => {
  test('amount x decimals', () => {
    const result = timesDecimals('12.345678', 6).toFixed();
    expect(result).toBe('12345678');
  });
});

describe('divDecimals', () => {
  test('amount / decimals', () => {
    const result = divDecimals('12345678', 6).toFixed();
    expect(result).toBe('12.345678');
  });
});
