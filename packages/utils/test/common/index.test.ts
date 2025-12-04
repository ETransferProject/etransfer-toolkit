import { describe, expect, test } from '@jest/globals';
import { randomId, sleep } from '../../src/common';

describe('sleep', () => {
  test('Test sleep executes normally.', async () => {
    const result = await sleep(100);
    expect(result).toBeUndefined();
  });
});

describe('randomId function', () => {
  test('should generate an ID with the correct format', () => {
    const id = randomId();

    // Check if the generated ID contains a timestamp and a random number
    const parts = id.split('_');
    expect(parts.length).toBe(2);
    expect(Date.now() - parseInt(parts[0], 10)).toBeLessThan(100); // Ensure timestamp is recent (< 100 ms)
    expect(/^\d{1,6}$/.test(parts[1])).toBe(true); // Ensure the second part is a random number with up to 6 digits
  });
});
