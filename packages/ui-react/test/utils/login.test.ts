import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  getETransferReCaptcha,
  getNetworkType,
  getAccountInfo,
  getAccountAddress,
  getAuth,
  isHaveTotalAccountInfo,
} from '../../src/utils/login';
import googleReCaptchaModal from '../../src/components/GoogleReCaptcha/googleReCaptchaModal';
import { ReCaptchaType } from '../../src/components/GoogleReCaptcha/types';
import { ETransferConfig } from '../../src/provider/ETransferConfigProvider';
import { WalletTypeEnum } from '../../src/provider/types';
import { etransferCore } from '../../src/utils/core';

jest.mock('../../src/provider/ETransferConfigProvider', () => ({
  ETransferConfig: {
    getConfig: jest.fn(),
  },
}));

jest.mock('../../src/components/GoogleReCaptcha/googleReCaptchaModal', () => jest.fn());

jest.mock('../../src/utils/core', () => ({
  etransferCore: {
    services: {
      checkEOARegistration: jest.fn(),
    },
  },
}));

describe('Login Core Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getETransferReCaptcha', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should get the reCAPTCHA result if the address is not registered', async () => {
      const mockWalletAddress = 'mockWalletAddress';
      const mockNetworkType = 'TESTNET';
      const mockModalWidth = 300;

      // Mock the EOA registration check
      (etransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: false } as never);

      // Mock the reCAPTCHA modal result
      (googleReCaptchaModal as jest.Mock).mockResolvedValue({
        type: ReCaptchaType.success,
        data: 'mockCaptchaResponse',
      } as never);

      const result = await getETransferReCaptcha(mockWalletAddress, mockNetworkType, mockModalWidth);

      // Verify the returned value
      expect(result).toBe('mockCaptchaResponse');
      // Ensure the registration check was called
      expect(etransferCore.services.checkEOARegistration).toHaveBeenCalledWith({ address: mockWalletAddress });
      // Verify the modal was opened
      expect(googleReCaptchaModal).toHaveBeenCalledWith(mockNetworkType, mockModalWidth);
    });

    it('should return undefined if the address is registered', async () => {
      const mockWalletAddress = 'mockWalletAddress';
      (etransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: true } as never);

      const result = await getETransferReCaptcha(mockWalletAddress);

      // Ensure it returns undefined
      expect(result).toBeUndefined();
    });
  });

  describe('getNetworkType', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return the network type from config', () => {
      const mockNetworkType = 'mainnet';
      (ETransferConfig.getConfig as jest.Mock).mockReturnValue(mockNetworkType);

      const result = getNetworkType();

      // Ensure the returned network type is correct
      expect(result).toBe(mockNetworkType);

      // Ensure correct config key is used
      expect(ETransferConfig.getConfig).toHaveBeenCalledWith('networkType');
    });
  });

  describe('getAccountInfo', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return account info from config', () => {
      const mockAccountInfo = { accounts: {} };
      (ETransferConfig.getConfig as jest.Mock).mockReturnValue(mockAccountInfo);

      const result = getAccountInfo();

      // Ensure the returned account info is correct
      expect(result).toEqual(mockAccountInfo);

      // Ensure correct config key
      expect(ETransferConfig.getConfig).toHaveBeenCalledWith('accountInfo');
    });
  });

  describe('getAccountAddress', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return account address for given chainId', () => {
      const mockAccountInfo = { accounts: { AELF: 'mockAddress' } };
      (ETransferConfig.getConfig as jest.Mock).mockReturnValue(mockAccountInfo);

      const result = getAccountAddress('AELF' as any);

      // Ensure the address matches
      expect(result).toBe('mockAddress');
    });

    it('should return undefined if accountInfo.accounts is undefined', () => {
      const mockAccountInfo = { accounts: undefined };
      (ETransferConfig.getConfig as jest.Mock).mockReturnValue(mockAccountInfo);

      const result = getAccountAddress('AELF' as any);

      // Ensure the address matches
      expect(result).toBeUndefined();
    });
  });

  describe('getAuth', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return JWT token from config', () => {
      const mockAuth = { jwt: 'mockJwtToken' };
      (ETransferConfig.getConfig as jest.Mock).mockReturnValue(mockAuth);

      const result = getAuth();

      // Ensure the returned JWT token is correct
      expect(result).toBe('mockJwtToken');

      // Ensure correct config key
      expect(ETransferConfig.getConfig).toHaveBeenCalledWith('authorization');
    });

    it('should return undefined', () => {
      (ETransferConfig.getConfig as jest.Mock).mockReturnValue(undefined);

      const result = getAuth();

      // Ensure the returned JWT token is correct
      expect(result).toBeUndefined();

      // Ensure correct config key
      expect(ETransferConfig.getConfig).toHaveBeenCalledWith('authorization');
    });
  });

  describe('isHaveTotalAccountInfo', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return true when all info is complete', () => {
      const mockAccountInfo = {
        accounts: { AELF: 'mockAddress' },
        walletType: WalletTypeEnum.discover,
        jwt: 'mockJwtToken',
      };
      (ETransferConfig.getConfig as jest.Mock).mockReturnValue(mockAccountInfo);

      const result = isHaveTotalAccountInfo();

      // Ensure it returns true
      expect(result).toBe(true);
    });

    it('should return false when account address is missing', () => {
      const mockAccountInfo = {
        accounts: {},
        walletType: WalletTypeEnum.discover,
        jwt: 'mockJwtToken',
      };
      (ETransferConfig.getConfig as jest.Mock).mockReturnValue(mockAccountInfo);

      const result = isHaveTotalAccountInfo();

      // Ensure it returns false
      expect(result).toBe(false);
    });

    it('should return false when wallet type is unknown', () => {
      const mockAccountInfo = {
        accounts: { AELF: 'mockAddress' },
        walletType: WalletTypeEnum.unknown,
        jwt: 'mockJwtToken',
      };
      (ETransferConfig.getConfig as jest.Mock).mockReturnValue(mockAccountInfo);

      const result = isHaveTotalAccountInfo();

      // Ensure it returns false
      expect(result).toBe(false);
    });

    it('should return false when JWT is missing', () => {
      const mockAccountInfo = {
        accounts: { AELF: 'mockAddress' },
        walletType: WalletTypeEnum.discover,
        jwt: undefined,
      };
      (ETransferConfig.getConfig as jest.Mock).mockReturnValue(mockAccountInfo);

      const result = isHaveTotalAccountInfo();

      // Ensure it returns false
      expect(result).toBe(false);
    });
  });
});
