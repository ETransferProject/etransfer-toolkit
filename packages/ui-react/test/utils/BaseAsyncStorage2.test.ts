import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BaseAsyncStorage } from '../../src/utils/BaseAsyncStorage';

describe('BaseAsyncStorage localStorage = undefined', () => {
  let storage: BaseAsyncStorage;

  beforeEach(() => {
    storage = new BaseAsyncStorage();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    // Setup: Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      configurable: true,
    });
  });

  it('2 should get an item from localStorage', async () => {
    // First set value to localStorages
    await storage.setItem('key4', 'value4');

    // Get the item
    const result = await storage.getItem('key4');

    // Ensure the value is null
    expect(result).toBeNull();

    // Remove the item
    await storage.removeItem('key4');

    const result2 = await storage.getItem('key4');

    // Ensure the item is removed
    expect(result2).toBeNull();
  });
});
