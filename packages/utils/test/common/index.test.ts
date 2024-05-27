import { describe, expect, test } from '@jest/globals';
import { sleep } from '../../src/common';

describe('sleep', () => {
  test('Test sleep executes normally.', async () => {
    const result = await sleep(100);
    expect(result).toBeUndefined();
  });
});
