import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { etransferCore } from '../../src/utils/core';
import { useReCaptcha, useReCaptchaModal } from '../../src/hooks/recaptcha';
import { ETransferConfig } from '../../src/provider/ETransferConfigProvider';
import { ReCaptchaType } from '../../src/components/GoogleReCaptcha/types';
import { setReCaptchaModal } from '../../src/utils/recaptcha';

jest.mock('../../src/utils/core', () => {
  const originalModule: any = jest.requireActual('../../src/utils/core');

  return {
    __esModule: true,
    ...originalModule,
    etransferCore: {
      setStorage: jest.fn(),
      services: {
        checkEOARegistration: jest.fn().mockResolvedValue({ result: false } as never),
      },
    },
  };
});

jest.mock('../../src/utils/recaptcha', () => ({
  setReCaptchaModal: jest.fn(),
}));

jest.mock('@etransfer/utils', () => ({
  etransferEvents: {
    SetRecaptchaConfig: {
      emit: jest.fn(),
      addListener: jest.fn().mockImplementation((fn: any) => {
        fn();
        return {
          remove: jest.fn(),
        };
      }), // Mock addListener
    },
    ETransferConfigUpdated: {
      emit: jest.fn(),
    },
  },
  handleErrorMessage: jest.fn((_e, msg) => msg),
}));

describe('useReCaptcha', () => {
  it('should initialize with config value', () => {
    ETransferConfig.setConfig({
      reCaptchaConfig: { theme: 'dark', size: 'compact' },
    });

    const { result } = renderHook(() => useReCaptcha());

    expect(result.current).toHaveProperty('theme');
    expect(result.current?.theme).toBe('dark');
    expect(result.current).toHaveProperty('size');
    expect(result.current?.size).toBe('compact');
  });
});

describe('useReCaptchaModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use custom handler when available', async () => {
    const customHandler: any = jest.fn().mockResolvedValue({
      type: ReCaptchaType.success,
      message: 'custom-token',
    } as never);

    ETransferConfig.setConfig({
      reCaptchaConfig: { customReCaptchaHandler: customHandler },
    });

    // Mock checkEOARegistration return false
    (etransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: false } as never);

    const { result } = renderHook(() => useReCaptchaModal(), {});

    await act(async () => {
      const res = await result.current({ walletAddress: '0x123', open: true });

      expect(res).toBe('custom-token');
    });
  });

  it('should use default modal when no custom handler', async () => {
    (etransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: false } as never);

    ETransferConfig.setConfig({
      reCaptchaConfig: { customReCaptchaHandler: undefined },
    });

    // Mock setReCaptchaModal return successful info
    (setReCaptchaModal as jest.Mock).mockReturnValue({
      type: ReCaptchaType.success,
      message: 'default-token',
    } as never);

    const { result } = renderHook(() => useReCaptchaModal());

    await act(async () => {
      const res = await result.current({ walletAddress: '0x123', open: true });
      expect(res).toBe('default-token');
    });
  });

  it('should handle cancel types', async () => {
    const customHandler: any = jest.fn().mockResolvedValue({
      type: ReCaptchaType.cancel,
      message: 'Cancel',
    } as never);

    ETransferConfig.setConfig({
      reCaptchaConfig: { customReCaptchaHandler: customHandler },
    });

    // Mock checkEOARegistration return false
    (etransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: false } as never);

    const { result } = renderHook(() => useReCaptchaModal());

    await act(async () => {
      try {
        await result.current({ walletAddress: '0x123', open: true });
      } catch (error) {
        expect(error).toBe('User Cancel');
      }
    });
  });

  it('should handle expired types', async () => {
    // Mock checkEOARegistration return false
    (etransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: false } as never);

    ETransferConfig.setConfig({
      reCaptchaConfig: undefined,
    });

    // Mock setReCaptchaModal return expired info
    (setReCaptchaModal as jest.Mock).mockReturnValue({
      type: ReCaptchaType.expire,
      message: 'Failed',
    } as never);

    const { result } = renderHook(() => useReCaptchaModal());

    await act(async () => {
      try {
        await result.current({ walletAddress: '0x123', open: true });
      } catch (error) {
        expect(error).toBe('ReCaptcha expired');
      }
    });
  });

  it('should handle error types', async () => {
    // Mock checkEOARegistration return false
    (etransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: false } as never);

    ETransferConfig.setConfig({
      reCaptchaConfig: undefined,
    });

    // Mock setReCaptchaModal return error info
    (setReCaptchaModal as jest.Mock).mockReturnValue({
      type: ReCaptchaType.error,
      message: 'Failed',
    } as never);

    const { result } = renderHook(() => useReCaptchaModal());

    await act(async () => {
      try {
        await result.current({ walletAddress: '0x123', open: true });
      } catch (error) {
        expect(error).toBe('ReCaptcha error');
      }
    });
  });

  it('should handle checkEOARegistration error', async () => {
    // Mock checkEOARegistration rejection
    (etransferCore.services.checkEOARegistration as jest.Mock).mockRejectedValue({ message: 'Failed' } as never);

    const { result } = renderHook(() => useReCaptchaModal());

    await act(async () => {
      try {
        await result.current({ walletAddress: '0x123', open: true });
      } catch (error) {
        expect(error.message).toBe('Failed');
      }
    });
  });

  it('should return undefined if already registration', async () => {
    // Mock checkEOARegistration return true
    (etransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: true } as never);

    const { result } = renderHook(() => useReCaptchaModal());

    await act(async () => {
      const res = await result.current({ walletAddress: '0x123', open: true });
      expect(res).toBe(undefined);
    });
  });

  it('should return undefined if open is false', async () => {
    // Mock checkEOARegistration return true
    (etransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: true } as never);

    const { result } = renderHook(() => useReCaptchaModal());

    await act(async () => {
      const res = await result.current({ walletAddress: '0x123', open: false });
      expect(res).toBe(undefined);
    });
  });
});
