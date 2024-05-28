import { describe, expect, test } from '@jest/globals';
import { isValidBase58 } from '../../src/reg';

describe('isValidBase58', () => {
  test('Address is Base58, and return true.', () => {
    const result = isValidBase58('Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft');
    expect(result).toBeTruthy();
  });
});
