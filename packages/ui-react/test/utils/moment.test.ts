import { afterAll, describe, expect, it, jest } from '@jest/globals';
import { formatPastTime } from '../../src/utils/moment';

describe('formatPastTime', () => {
  const currentTime = new Date();

  afterAll(() => {
    jest.useRealTimers(); // Restore the real timer
  });

  it('should format past time in days', () => {
    const time = currentTime.getTime() - 5 * 24 * 60 * 60 * 1000; // 5 days ago

    const result = formatPastTime(time);

    // Expect 'MMM D, YYYY HH:mm:ss' format
    expect(result).toMatch(/^\w{3} \d{1,2}, \d{4} \d{2}:\d{2}:\d{2}$/);
  });

  it('should return hours ago', () => {
    const time = currentTime.getTime() - 3 * 60 * 60 * 1000; // 3 hours ago

    const result = formatPastTime(time);

    expect(result).toBe('3 hours ago');
  });

  it('should return minutes ago', () => {
    const time = currentTime.getTime() - 45 * 60 * 1000; // 45 mins ago

    const result = formatPastTime(time);

    expect(result).toBe('45 minutes ago');
  });

  it('should return "just now" for recent time', () => {
    const time = currentTime.getTime() - 30 * 1000; // 30s ago

    const result = formatPastTime(time);

    expect(result).toBe('just now');
  });

  it('should return "just now" for current time', () => {
    const time = currentTime.getTime(); // now

    const result = formatPastTime(time);

    expect(result).toBe('just now');
  });
});
