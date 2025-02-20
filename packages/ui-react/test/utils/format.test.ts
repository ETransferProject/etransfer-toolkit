import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import BigNumber from 'bignumber.js';
import {
  AmountSign,
  formatStr2Ellipsis,
  formatSymbolDisplay,
  formatWithCommas,
  parseWithCommas,
  parseWithStringCommas,
  replaceCharacter,
} from '../../src/utils/format';
import { divDecimals } from '@etransfer/utils';

jest.mock('@etransfer/utils', () => ({
  divDecimals: jest.fn(),
  ZERO: new BigNumber(0),
}));

describe('formatStr2Ellipsis', () => {
  it('should return an empty string for empty address', () => {
    expect(formatStr2Ellipsis()).toBe(''); // Default to empty string
    expect(formatStr2Ellipsis('')).toBe(''); // Passing empty string
  });

  it('should return the original string if its length is less than the sum of digits', () => {
    const address = '123456';
    expect(formatStr2Ellipsis(address, [5, 5])).toBe(address); // Length is less than sum of 5 and 5
    expect(formatStr2Ellipsis(address, [10, 10])).toBe(address); // Length is less than sum of 10 and 10
  });

  it('should truncate the string with middle ellipsis', () => {
    const address = '1234567890abcdef';
    expect(formatStr2Ellipsis(address, [5, 4], 'middle')).toBe('12345...cdef');
  });

  it('should truncate the string with tail ellipsis', () => {
    const address = '1234567890abcdef';
    expect(formatStr2Ellipsis(address, [8, 2], 'tail')).toBe('12345678...'); // Only show the first 8 characters
  });

  it('should handle digits correctly when sum of digits is equal to address length', () => {
    const address = '123456';
    expect(formatStr2Ellipsis(address, [3, 3], 'middle')).toBe('123...456');
  });

  it('should handle digits correctly when address length is less than the specified digits', () => {
    const address = 'abcdef';
    expect(formatStr2Ellipsis(address, [10, 10], 'middle')).toBe(address); // Length is less than 20
  });
});

describe('formatWithCommas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format number with commas and default values', () => {
    (divDecimals as jest.Mock).mockImplementation(() => {
      return {
        decimalPlaces: () => ({
          toFormat: jest.fn().mockReturnValue('10,000'),
        }),
      };
    });

    const result = formatWithCommas({ amount: '10000', decimals: 0 });

    expect(result).toBe('10,000'); // Check the formatted result
  });

  it('should format fractional values correctly', () => {
    (divDecimals as jest.Mock).mockImplementation(() => {
      return {
        decimalPlaces: () => ({
          toFormat: jest.fn().mockReturnValue('100'),
        }),
      };
    });

    const result = formatWithCommas({ amount: 10000.4567, decimals: 2 });

    expect(result).toBe('100.4567'); // Check the formatted result
  });

  it('should handle sign for non-zero amounts', () => {
    (divDecimals as jest.Mock).mockImplementation(() => {
      return {
        decimalPlaces: () => ({
          toFormat: jest.fn().mockReturnValue('10,000'),
        }),
      };
    });

    const result = formatWithCommas({ amount: 10000, decimals: 0, sign: AmountSign.PLUS });

    expect(result).toBe('+10,000'); // Check the formatted result with sign
  });

  it('should handle zero amounts without sign', () => {
    (divDecimals as jest.Mock).mockImplementation(() => {
      return {
        decimalPlaces: () => ({
          toFormat: jest.fn().mockReturnValue('0'),
        }),
      };
    });

    const result = formatWithCommas({ amount: 0, decimals: 0 });

    expect(result).toBe('0'); // Check the formatted result for zero
  });

  it('should return default amount if no amount provided', () => {
    (divDecimals as jest.Mock).mockImplementation(() => {
      return {
        decimalPlaces: () => ({
          toFormat: jest.fn().mockReturnValue('0'),
        }),
      };
    });

    const result = formatWithCommas({});

    expect(result).toBe('0'); // Check default case
  });

  it('should handle negative amounts', () => {
    (divDecimals as jest.Mock).mockImplementation(() => {
      return {
        decimalPlaces: () => ({
          toFormat: jest.fn().mockReturnValue('-10,000'),
        }),
      };
    });

    const result = formatWithCommas({ amount: -10000, decimals: 0 });

    expect(result).toBe('-10,000'); // Ensure that it formats the negative number correctly
  });
});

describe('parseWithCommas', () => {
  it('should return an empty string if input is undefined or null', () => {
    expect(parseWithCommas(undefined)).toBe('');
    expect(parseWithCommas(null)).toBe('');
  });

  it('should parse strings with commas into numbers', () => {
    const result = parseWithCommas('1,234.56');
    expect(result).toBe(new BigNumber('1234.56').toFixed()); // Ensure proper conversion
  });

  it('should handle invalid numbers properly', () => {
    const result = parseWithCommas('invalid-number');
    expect(result).toBe(new BigNumber(NaN).toFixed()); // Ensure NaN handling, depending on your implementation
  });
});

describe('parseWithStringCommas', () => {
  it('should return an empty string if input is undefined or null', () => {
    expect(parseWithStringCommas(undefined)).toBe('');
    expect(parseWithStringCommas(null)).toBe('');
  });

  it('should remove commas from a string', () => {
    const result = parseWithStringCommas('1,234,567.89');
    expect(result).toBe('1234567.89'); // Ensure commas are removed
  });

  it('should return the original string if no commas exist', () => {
    const result = parseWithStringCommas('123456789');
    expect(result).toBe('123456789'); // Ensure no changes for strings without commas
  });
});

describe('replaceCharacter', () => {
  it('should replace specified characters in a string', () => {
    const result = replaceCharacter('Hello World', 'World', 'Everyone');
    expect(result).toBe('Hello Everyone');
  });

  it('should return the original string if the character to replace is not found', () => {
    const result = replaceCharacter('Hello World', 'NotFound', 'Everyone');
    expect(result).toBe('Hello World'); // No replacement should occur
  });

  it('should return undefined if input string is undefined', () => {
    const result = replaceCharacter(undefined as any, 'World', 'Everyone');
    expect(result).toBeUndefined();
  });
});

describe('formatSymbolDisplay', () => {
  it('should replace specified characters in a string', () => {
    const result = formatSymbolDisplay('SGR-1');
    expect(result).toBe('SGR');
  });
});
