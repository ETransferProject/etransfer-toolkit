import { describe, expect, it } from '@jest/globals';
import { eTransferCore } from '../src/index';

describe('Packages-Core Export Module', () => {
  it('should correctly export everything from eTransferCore', () => {
    expect(eTransferCore.baseUrl).toBeUndefined();
  });
});
