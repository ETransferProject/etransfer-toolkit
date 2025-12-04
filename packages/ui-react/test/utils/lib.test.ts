import { describe, expect, it, jest } from '@jest/globals';
import * as uuid from 'uuid';
import { dealURLLastChar, randomId } from '../../src/utils/lib';

// Mock uuid module
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('dealURLLastChar', () => {
  it('should return the same URL if it does not end with a slash', () => {
    const url = 'http://example.com';
    expect(dealURLLastChar(url)).toBe(url);
  });

  it('should remove the trailing slash from the URL', () => {
    const url = 'http://example.com/';
    expect(dealURLLastChar(url)).toBe('http://example.com');
  });

  it('should return an empty string if input URL is undefined', () => {
    expect(dealURLLastChar(undefined)).toBe('');
  });
});

describe('randomId', () => {
  it('should generate a random ID without dashes', () => {
    const mockUuid = '123e4567-e89b-12d3-a456-426614174000'; // Mock UUID format
    (uuid.v4 as jest.Mock).mockReturnValue(mockUuid); // Mock uuid.v4 to return a specific value

    const id = randomId();
    expect(id).toBe('123e4567e89b12d3a456426614174000'); // Ensure that dashes are removed
  });
});
