import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BaseAsyncStorage } from '../../src/utils/BaseAsyncStorage';

describe('BaseAsyncStorage', () => {
  let storage: BaseAsyncStorage;

  beforeEach(() => {
    storage = new BaseAsyncStorage();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    // Setup: Mock localStorage
    const localStorageMock = (() => {
      let store: { [key: string]: string } = {};

      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });
  });

  it('should get an item from localStorage', async () => {
    // First set value to localStorages
    await storage.setItem('key1', 'value1');

    // Get the item
    const result = await storage.getItem('key1');

    // Ensure the value is correct
    expect(result).toBe('value1');
  });

  it('should return null for a non-existing key', async () => {
    // Get a non-existing key
    const result = await storage.getItem('nonExistingKey');

    // Ensure it returns null
    expect(result).toBe(null);
  });

  it('should set an item in localStorage', async () => {
    // Set value to localStorage
    await storage.setItem('key2', 'value2');

    const result = await storage.getItem('key2');

    // Ensure the value is set correctly
    expect(result).toBe('value2');
  });

  it('should remove an item from localStorage', async () => {
    // Set initial value
    await storage.setItem('key3', 'value3');

    // Remove the item
    await storage.removeItem('key3');

    const result = await storage.getItem('key3');

    // Ensure the item is removed
    expect(result).toBe(null);
  });
});
