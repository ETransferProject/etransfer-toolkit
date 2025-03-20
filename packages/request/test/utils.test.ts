import { describe, expect, test, jest } from '@jest/globals';
import { isDeniedRequest, spliceUrl, getRequestConfig } from '../src/utils';
import { TBaseConfig, TRequestConfig } from '../src/types';

describe('isDeniedRequest', () => {
  test('returns true if error message contains "401"', () => {
    const error = { message: 'Request failed with status code 401' };
    const result = isDeniedRequest(error);
    expect(result).toBe(true);
  });

  test('returns false if error message does not contain "401"', () => {
    const error = { message: 'Request failed with status code 404' };
    const result = isDeniedRequest(error);
    expect(result).toBe(false);
  });

  test('handles errors without message property', () => {
    // @ts-ignore
    const error = {};
    const result = isDeniedRequest(error as any);
    expect(result).toBe(false);
  });

  test('logs warnings if an error occurs within isDeniedRequest', () => {
    console.warn = jest.fn();
    // @ts-ignore
    isDeniedRequest(null);
    expect(console.warn).toHaveBeenCalled();
  });
});

describe('spliceUrl', () => {
  test('appends extendArg to baseUrl if extendArg is provided', () => {
    const baseUrl = 'http://example.com/api';
    const extendArg = 'users';
    const result = spliceUrl(baseUrl, extendArg);
    expect(result).toBe('http://example.com/api/users');
  });

  test('returns baseUrl if extendArg is not provided', () => {
    const baseUrl = 'http://example.com/api';
    const result = spliceUrl(baseUrl);
    expect(result).toBe('http://example.com/api');
  });
});

describe('getRequestConfig', () => {
  test('returns config as-is if base is a string', () => {
    const base: TBaseConfig = 'http://example.com/api';
    const config: TRequestConfig = { query: 'user=123', method: 'GET' };
    const result = getRequestConfig(base, config);
    expect(result).toEqual(config);
  });

  test('merges baseConfig and config properties properly when base is an object', () => {
    const base: TBaseConfig = {
      target: 'http://example.com/api',
      baseConfig: {
        query: 'id=1',
        method: 'POST',
        params: { foo: 'bar' },
        data: { name: 'John' },
      },
    };

    const config: TRequestConfig = {
      query: '&page=2',
      params: { search: 'test' },
      data: { age: 30 },
    };

    const result = getRequestConfig(base, config);

    expect(result).toEqual({
      query: 'id=1&page=2',
      method: 'POST',
      params: { foo: 'bar', search: 'test' },
      data: { name: 'John', age: 30 },
    });
  });

  test('method in config', () => {
    const base: TBaseConfig = {
      target: 'http://example.com/api',
      baseConfig: {
        query: 'id=1',
        params: { foo: 'bar' },
        data: { name: 'John' },
      },
    };

    const config: TRequestConfig = {
      query: '&page=2',
      method: 'POST',
      params: { search: 'test' },
      data: { age: 30 },
    };

    const result = getRequestConfig(base, config);

    expect(result).toEqual({
      query: 'id=1&page=2',
      method: 'POST',
      params: { foo: 'bar', search: 'test' },
      data: { name: 'John', age: 30 },
    });
  });

  test('properly handles undefined base and config', () => {
    const result = getRequestConfig(undefined as any, undefined as any);

    expect(result).toEqual({ query: '', method: undefined, params: {}, data: {} });
  });
});
