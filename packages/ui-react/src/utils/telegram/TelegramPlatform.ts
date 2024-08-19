declare const window: Window &
  typeof globalThis & {
    Telegram?: ITelegram;
  };

export class TelegramPlatform {
  static getTelegram() {
    if (typeof window !== 'undefined') {
      return window?.Telegram;
    }
    return undefined;
  }

  static getWebApp() {
    return TelegramPlatform.getTelegram()?.WebApp;
  }

  static isTelegramPlatform() {
    const Telegram = TelegramPlatform.getTelegram();
    return !!(Telegram && Telegram.WebApp.platform && Telegram.WebApp.platform !== 'unknown');
  }
}
