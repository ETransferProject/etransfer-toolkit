import { describe, expect, test } from '@jest/globals';
import { aelfInstance } from '../../src/aelf/aelfInstance';

describe('AelfAbstract', () => {
  test('Create singleton and instance', () => {
    const instance = aelfInstance.getInstance('AELF', 'https://testnet.aelfscan.io/AELF');
    expect(instance).toHaveProperty('chain');
  });
  test('Get aelf instance', () => {
    const instance = aelfInstance.getInstance('AELF', 'https://testnet.aelfscan.io/AELF');
    expect(instance).toHaveProperty('chain');
  });
});
