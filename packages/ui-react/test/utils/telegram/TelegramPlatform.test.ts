import { beforeEach, describe, expect, it } from '@jest/globals';
import { TelegramPlatform } from '../../../src/utils/telegram/TelegramPlatform';

describe('TelegramPlatform', () => {
  beforeEach(() => {
    delete (window as any)?.Telegram;
  });

  it('should return Telegram object from window', () => {
    // Mock the window object to contain Telegram
    const mockTelegram = { WebApp: {} };
    (window as any).Telegram = mockTelegram;

    const telegram = TelegramPlatform.getTelegram();

    // Verify Telegram object is returned
    expect(telegram).toBe(mockTelegram);
  });

  it('should return undefined if window.Telegram is not defined', () => {
    const telegram = TelegramPlatform.getTelegram();

    // Ensure undefined is returned when Telegram is not defined
    expect(telegram).toBeUndefined();
  });

  it('should return WebApp from Telegram', () => {
    const mockTelegram = { WebApp: { platform: 'myPlatform' } };
    (window as any).Telegram = mockTelegram;

    const webApp = TelegramPlatform.getWebApp();

    // Ensure the WebApp is returned
    expect(webApp).toEqual(mockTelegram.WebApp);
  });

  it('should return undefined from WebApp if Telegram is not defined', () => {
    const webApp = TelegramPlatform.getWebApp();

    // Ensure undefined is returned from getWebApp
    expect(webApp).toBeUndefined();
  });

  it('should determine if the platform is Telegram correctly', () => {
    const mockTelegram = { WebApp: { platform: 'telegram' } };
    (window as any).Telegram = mockTelegram;

    const result = TelegramPlatform.isTelegramPlatform();

    // Should return true for a recognized Telegram platform
    expect(result).toBe(true);
  });

  it('should return false if the platform is unknown', () => {
    const mockTelegram = { WebApp: { platform: 'unknown' } };
    (window as any).Telegram = mockTelegram;

    const result = TelegramPlatform.isTelegramPlatform();

    // Should return false for an unknown platform
    expect(result).toBe(false);
  });

  it('should return false if Telegram is not defined', () => {
    const result = TelegramPlatform.isTelegramPlatform();

    // Should return false if Telegram object is not available
    expect(result).toBe(false);
  });
});
