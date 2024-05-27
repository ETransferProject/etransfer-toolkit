import { describe, expect, test } from '@jest/globals';
import { handleError } from '../../src/error';
import { ServicesError } from '../__mocks__/error';

describe('handleError', () => {
  test('Format error structure, and return the main error body.', async () => {
    const error = handleError(ServicesError);
    expect(error).toHaveProperty('code');
    expect(error.code).toBe(ServicesError.code);
  });

  test('Format error.error structure, and return the main error body.', async () => {
    const error = handleError({ error: ServicesError });
    expect(error).toHaveProperty('code');
    expect(error.code).toBe(ServicesError.code);
  });
});
