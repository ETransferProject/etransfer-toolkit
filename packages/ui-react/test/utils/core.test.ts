import { describe, expect, it } from '@jest/globals';
import { eTransferCore as _etransferCore } from '@etransfer/core';
import { etransferCore } from '../../src/utils/core';

describe('etransferCore', () => {
  it('should be equal to the imported eTransferCore', () => {
    expect(etransferCore).toEqual(_etransferCore);
  });
});
