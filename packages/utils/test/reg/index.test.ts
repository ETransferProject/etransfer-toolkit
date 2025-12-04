import { describe, expect, it, test } from '@jest/globals';
import { isSymbol, isUrl, isValidBase58, isValidNumber, isValidPositiveNumber } from '../../src/reg';

describe('isUrl', () => {
  it('should return false for non-string input', () => {
    expect(isUrl('')).toBe(false);
    expect(isUrl(null as any)).toBe(false);
    expect(isUrl(undefined as any)).toBe(false);
  });

  it('should return false for invalid URLs', () => {
    expect(isUrl('invalid-url')).toBe(false);
    expect(isUrl('ftp://example.com')).toBe(true);
    expect(isUrl('')).toBe(false);
  });

  it('should return true for valid localhost URLs', () => {
    expect(isUrl('http://localhost')).toBe(true);
    expect(isUrl('http://localhost:3000')).toBe(true);
    expect(isUrl('http://localhost/test')).toBe(true);
  });

  it('should return true for valid non-localhost URLs', () => {
    expect(isUrl('http://example.com')).toBe(true);
    expect(isUrl('https://subdomain.example.com/path?query=1')).toBe(true);
    expect(isUrl('https://example.com:8080')).toBe(true);
  });
});

describe('isSymbol', () => {
  it('should return false for undefined or empty input', () => {
    expect(isSymbol()).toBe(false);
    expect(isSymbol('')).toBe(false);
  });

  it('should return true for valid symbols', () => {
    expect(isSymbol('A')).toBe(true);
    expect(isSymbol('1')).toBe(true);
    expect(isSymbol('a1')).toBe(true);
  });

  it('should return false for invalid symbols', () => {
    expect(isSymbol(' ')).toBe(false);
    expect(isSymbol('-')).toBe(false);
    expect(isSymbol('A#')).toBe(false);
    expect(isSymbol('A B')).toBe(false);
  });
});

describe('isValidNumber', () => {
  it('should return false for undefined or empty input', () => {
    expect(isValidNumber()).toBe(false);
    expect(isValidNumber('')).toBe(false);
  });

  it('should return true for valid numbers', () => {
    expect(isValidNumber('123')).toBe(true);
    expect(isValidNumber('-123')).toBe(true);
    expect(isValidNumber('123.45')).toBe(true);
    expect(isValidNumber('-123.45')).toBe(true);
  });

  it('should return true for just a dash', () => {
    expect(isValidNumber('-')).toBe(true);
  });

  it('should return false for invalid numbers', () => {
    expect(isValidNumber('abc')).toBe(false);
    expect(isValidNumber('1abc')).toBe(false);
    expect(isValidNumber('123.45.67')).toBe(false);
    expect(isValidNumber('')).toBe(false);
  });
});

describe('isValidPositiveNumber', () => {
  it('should return false for undefined or empty input', () => {
    expect(isValidPositiveNumber()).toBe(false);
    expect(isValidPositiveNumber('')).toBe(false);
  });

  it('should return false for negative numbers', () => {
    expect(isValidPositiveNumber('-123')).toBe(false);
  });

  it('should return true for valid positive numbers', () => {
    expect(isValidPositiveNumber('123')).toBe(true);
    expect(isValidPositiveNumber('123.45')).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isValidPositiveNumber('abc')).toBe(false);
    expect(isValidPositiveNumber('1abc')).toBe(false);
    expect(isValidPositiveNumber('123.45.67')).toBe(false);
  });
});

describe('isValidBase58', () => {
  test('Address is Base58, and return true.', () => {
    const result = isValidBase58('Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft');
    expect(result).toBeTruthy();
  });
});
