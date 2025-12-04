import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  checkTokenAllowanceAndApprove,
  createTransferTokenTransaction,
  getAllowance,
  getBalance,
  getETransferJWT,
  getTokenInfo,
} from '@etransfer/utils';
import { ETransferCore } from '../src/core';
import { AuthTokenSource, PortkeyVersion, TWalletType } from '@etransfer/types';
import { Services } from '@etransfer/services';
import BigNumber from 'bignumber.js';
import {
  INSUFFICIENT_ALLOWANCE_MESSAGE,
  WITHDRAW_ERROR_MESSAGE,
  WITHDRAW_TRANSACTION_ERROR_CODE_LIST,
  WithdrawErrorNameType,
} from '../src/constants';
import { ChainId } from '@portkey/types';

jest.mock('@etransfer/utils', () => {
  const originalModule: any = jest.requireActual('@etransfer/utils');

  return {
    __esModule: true,
    ...originalModule,
    getETransferJWT: jest.fn(),
    setETransferJWT: jest.fn(),
    getTokenContract: jest.fn(),
    getAllowance: jest.fn(),
    getBalance: jest.fn(),
    getTokenInfo: jest.fn(),
    approveAllowance: jest.fn(),
    checkTokenAllowanceAndApprove: jest.fn(),
    createTransferTokenTransaction: jest.fn(),
    etransferEvents: {
      AuthTokenSuccess: { emit: jest.fn() },
      UpdateNewRecordStatus: { emit: jest.fn() },
    },
  };
});

jest.mock('@etransfer/services');

describe('ETransferCore', () => {
  const correctAelfAddress = 'ELF_Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft_AELF';
  const services = new Services();
  (services.getAuthToken as jest.Mock).mockResolvedValue({
    token_type: 'Bearer',
    access_token: 'mockAccessToken',
  } as never);

  let eTransferCore: ETransferCore;
  let mockStorage: {};
  const _etransferUrl = 'http://etransfer.etransfer';
  const _mockETransferUrl = 'http://localhost/etransfer';
  const _mockETransferSocketUrl = 'http://localhost/socket';

  beforeEach(() => {
    eTransferCore = new ETransferCore({
      storage: {
        getItem: async (key: string) => {
          return mockStorage[key];
        },
        setItem: async (key: string, value: string) => {
          mockStorage[key] = value;
        },
        removeItem: async (key: string) => {
          delete mockStorage[key];
        },
      }, // Mock the storage as necessary
      etransferUrl: _mockETransferUrl,
      etransferSocketUrl: _mockETransferSocketUrl,
    });

    eTransferCore.services = new Services();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('setBaseUrl', () => {
    it('should set baseUrl successfully', () => {
      eTransferCore.setBaseUrl(_etransferUrl);

      expect(eTransferCore.baseUrl).toBe(_etransferUrl);
    });

    it('url is empty and should not reset baseUrl', () => {
      eTransferCore.setBaseUrl();

      expect(eTransferCore.baseUrl).toBe(_mockETransferUrl);
    });
  });

  describe('setAuthUrl', () => {
    it('should set authUrl successfully', () => {
      eTransferCore.setAuthUrl(_etransferUrl);

      expect(eTransferCore.authUrl).toBe(_etransferUrl);
    });

    it('url is empty and should not reset authUrl', () => {
      eTransferCore.setAuthUrl();

      expect(eTransferCore.authUrl).toBeUndefined();
    });
  });

  describe('setSocketUrl', () => {
    it('should set socketUrl successfully', () => {
      eTransferCore.setSocketUrl(_etransferUrl);

      expect(eTransferCore.socketUrl).toBe(_etransferUrl);
    });

    it('url is empty and should not reset socketUrl', () => {
      eTransferCore.setSocketUrl();

      expect(eTransferCore.socketUrl).toBeUndefined();
    });

    it('eTransferCore.noticeSocket is undefined and the url of the notifySocket will not be set', () => {
      eTransferCore.noticeSocket = undefined;

      eTransferCore.setSocketUrl(_etransferUrl);

      expect(eTransferCore.socketUrl).toBe(_etransferUrl);
      expect(eTransferCore.noticeSocket).toBeUndefined();
    });
  });

  describe('setVersion', () => {
    const _version = 'v3.0.0';

    it('should set version successfully', () => {
      eTransferCore.setVersion(_version);

      expect(eTransferCore.version).toBe(_version);
    });

    it('url is empty and should not reset version', () => {
      eTransferCore.setVersion();

      expect(eTransferCore.version).toBe('v2.14.2');
    });
  });

  describe('getAuthToken', () => {
    it('should return token from storage if available', async () => {
      const mockToken = { token_type: 'Bearer', access_token: 'mockAccessToken' };
      (getETransferJWT as jest.Mock).mockResolvedValueOnce(mockToken as never); // Mock the behavior

      const result = await eTransferCore.getAuthToken({
        pubkey: 'mockPubkey',
        signature: 'mockSignature',
        plainText: '',
        managerAddress: 'mockManagerAddress',
        version: PortkeyVersion.v2,
      });

      expect(result).toBe(`${mockToken.token_type} ${mockToken.access_token}`);
      expect(getETransferJWT).toHaveBeenCalledWith(eTransferCore.storage, expect.any(String));
    });

    it('should fetch token from API if not in storage', async () => {
      const mockToken = { token_type: 'Bearer', access_token: 'mockAccessToken' };
      (eTransferCore.services.getAuthToken as jest.Mock).mockResolvedValue(mockToken as never);

      (getETransferJWT as jest.Mock).mockResolvedValueOnce(undefined as never); // Simulate no JWT token in storage

      const result = await eTransferCore.getAuthToken({
        pubkey: 'mockPubkey',
        signature: 'mockSignature',
        plainText: '',
        managerAddress: 'mockManagerAddress',
        version: PortkeyVersion.v2,
      });

      expect(result).toBe(`${mockToken.token_type} ${mockToken.access_token}`); // Verify token fetched from API
    });

    it('should fetch token from API if not in storage and source is AuthTokenSource.NightElf', async () => {
      const mockToken = { token_type: 'Bearer', access_token: 'mockAccessToken' };
      (eTransferCore.services.getAuthToken as jest.Mock).mockResolvedValue(mockToken as never);

      // first mock getETransferJWT
      (getETransferJWT as jest.Mock).mockResolvedValueOnce(undefined as never);

      // second mock getETransferJWT
      (getETransferJWT as jest.Mock).mockResolvedValueOnce(mockToken as never);

      const result = await eTransferCore.getAuthToken(
        Object.freeze({
          pubkey: 'mockPubkey',
          signature: 'mockSignature',
          plainText: '',
          managerAddress: 'mockManagerAddress',
          version: PortkeyVersion.v2,
          source: AuthTokenSource.NightElf,
        }),
      );

      expect(result).toBe(`${mockToken.token_type} ${mockToken.access_token}`); // Verify token fetched from API
    });

    it('eTransferCore.authUrl is empty and should fetch token from API successfully', async () => {
      eTransferCore.setAuthUrl('http://localhost/auth');
      const mockToken = { token_type: 'Bearer', access_token: 'mockAccessToken' };
      (eTransferCore.services.getAuthToken as jest.Mock).mockResolvedValue(mockToken as never);

      // first mock getETransferJWT
      (getETransferJWT as jest.Mock).mockResolvedValueOnce(undefined as never);

      // second mock getETransferJWT
      (getETransferJWT as jest.Mock).mockResolvedValueOnce(mockToken as never);

      const result = await eTransferCore.getAuthToken(
        Object.freeze({
          pubkey: 'mockPubkey',
          signature: 'mockSignature',
          plainText: '',
          managerAddress: 'mockManagerAddress',
          version: PortkeyVersion.v2,
          source: AuthTokenSource.NightElf,
        }),
      );

      expect(result).toBe(`${mockToken.token_type} ${mockToken.access_token}`); // Verify token fetched from API
    });

    it('should throw an error if there is no storage set up', async () => {
      eTransferCore.storage = undefined; // Simulate no storage

      await expect(
        eTransferCore.getAuthToken({
          pubkey: 'mockPubkey',
          signature: 'mockSignature',
          plainText: '',
          managerAddress: 'mockManagerAddress',
          version: PortkeyVersion.v2,
        }),
      ).rejects.toThrow('Please set up the storage suite first'); // Check error message
    });
  });

  describe('getReCaptcha', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error if baseUrl is empty', async () => {
      eTransferCore.baseUrl = '';
      (eTransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({
        result: false,
      } as never);

      await expect(eTransferCore.getReCaptcha(correctAelfAddress, '')).rejects.toThrow('Please set reCaptchaUrl');
    });

    it('should return undefined if checkEOARegistration is false', async () => {
      (eTransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: true } as never);

      const result = await eTransferCore.getReCaptcha(correctAelfAddress, '');
      expect(result).toBeUndefined();
    });

    it('should open reCaptcha URL and return result from message', async () => {
      const mockReCaptchaUrl = 'http://localhost/recaptcha';
      const mockMessageEvent = {
        origin: mockReCaptchaUrl,
        data: { type: 'GOOGLE_RECAPTCHA_RESULT', data: 'mockResultData' },
      };

      // Mock the checkEOARegistration method
      (eTransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: false } as never);

      // Mock window.open
      (window as any).open = jest.fn().mockImplementation;

      window.removeEventListener = jest.fn();
      window.addEventListener = jest.fn().mockImplementation((_, handleFunction: any) => {
        handleFunction(mockMessageEvent);
      });

      const result = await eTransferCore.getReCaptcha(correctAelfAddress, mockReCaptchaUrl);
      expect(result).toBe(mockMessageEvent.data.data);
    });

    it('listen error type and reject error', async () => {
      const mockReCaptchaUrl = 'http://localhost/recaptcha';
      const mockMessageEvent = {
        origin: mockReCaptchaUrl,
        data: { type: 'MOCK_RESULT', data: 'mockResultData' },
      };

      // Mock the checkEOARegistration method
      (eTransferCore.services.checkEOARegistration as jest.Mock).mockResolvedValue({ result: false } as never);

      // Mock window.open
      (window as any).open = jest.fn().mockImplementation;

      window.removeEventListener = jest.fn();
      window.addEventListener = jest.fn().mockImplementation((_, handleFunction: any) => {
        handleFunction(mockMessageEvent);
      });

      try {
        await eTransferCore.getReCaptcha(correctAelfAddress, mockReCaptchaUrl);
      } catch (error) {
        expect(error).toBe(mockMessageEvent.data.data);
      }
    });
  });

  describe('sendWithdrawOrder', () => {
    const sendWithdrawOrderParams = {
      tokenContractCallSendMethod: jest.fn().mockResolvedValue(true as never) as any,
      tokenContractAddress: 'mockAddress',
      endPoint: 'http://localhost',
      caContractAddress: 'caContractAddress',
      eTransferContractAddress: 'eTransferAddress',
      toAddress: correctAelfAddress,
      memo: 'memo',
      walletType: TWalletType.Portkey,
      caHash: 'caHash',
      symbol: 'ELF',
      decimals: 2,
      network: 'ETH',
      amount: '100',
      chainId: 'AELF' as ChainId,
      accountAddress: 'accountAddress',
      managerAddress: 'managerAddress',
      getSignature: jest.fn().mockResolvedValue({ signature: 'mockSignature' } as never) as any,
    };
    const createWithdrawOrderId = '0000-1111-2222-3333';
    const createWithdrawOrderTransactionId = 'mockTransactionId';
    const createWithdrawOrderRes = {
      orderId: createWithdrawOrderId,
      transactionId: createWithdrawOrderTransactionId,
    };

    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should successfully send a withdraw order', async () => {
      // Mock the required functions behavior
      (getBalance as jest.Mock).mockResolvedValue('1000000000' as never);
      (getAllowance as jest.Mock).mockResolvedValue('150' as never);
      (getTokenInfo as jest.Mock).mockResolvedValue({ decimals: 2 } as never);
      (checkTokenAllowanceAndApprove as jest.Mock).mockResolvedValue(true as never);
      (createTransferTokenTransaction as jest.Mock).mockResolvedValue('mockTransaction' as never);
      (eTransferCore.services.createWithdrawOrder as jest.Mock).mockResolvedValue(createWithdrawOrderRes as never);

      const result = await eTransferCore.sendWithdrawOrder({
        ...sendWithdrawOrderParams,
        toAddress: correctAelfAddress,
      });

      expect(result.orderId).toBe(createWithdrawOrderRes.orderId);
      expect(result.transactionId).toBe(createWithdrawOrderRes.transactionId);
    });

    it('should throw an error if approval fails', async () => {
      // Mock the required functions behavior
      (getBalance as jest.Mock).mockResolvedValue(new BigNumber('1') as never);

      await expect(
        eTransferCore.sendWithdrawOrder({
          ...sendWithdrawOrderParams,
          tokenContractCallSendMethod: jest.fn() as any,
        }),
      ).rejects.toThrow(
        'Insufficient ELF balance in your account. Please consider transferring a smaller amount or topping up before you try again.',
      );
    });

    it('should throw an error if approval false', async () => {
      // Mock the required functions behavior
      (getBalance as jest.Mock).mockResolvedValue('1000000000' as never);
      (getAllowance as jest.Mock).mockResolvedValue('150' as never);
      (getTokenInfo as jest.Mock).mockResolvedValue({ decimals: 2 } as never);
      (checkTokenAllowanceAndApprove as jest.Mock).mockResolvedValue(false as never);

      await expect(
        eTransferCore.sendWithdrawOrder({
          ...sendWithdrawOrderParams,
        }),
      ).rejects.toThrow(INSUFFICIENT_ALLOWANCE_MESSAGE);
    });
  });

  describe('withdrawOrder', () => {
    const withdrawOrderParams = {
      endPoint: 'http://localhost',
      caContractAddress: 'caContractAddress',
      eTransferContractAddress: 'eTransferAddress',
      toAddress: correctAelfAddress,
      memo: 'memo',
      walletType: TWalletType.Portkey,
      caHash: 'caHash',
      symbol: 'ELF',
      decimals: 2,
      network: 'ETH',
      amount: '100',
      chainId: 'AELF' as ChainId,
      managerAddress: 'managerAddress',
      getSignature: jest.fn().mockResolvedValue({ signature: 'mockSignature' } as never) as any,
    };
    const createWithdrawOrderId = '0000-1111-2222-3333';
    const createWithdrawOrderTransactionId = 'mockTransactionId';
    const createWithdrawOrderRes = {
      orderId: createWithdrawOrderId,
      transactionId: createWithdrawOrderTransactionId,
    };

    it('should successfully create a withdraw order', async () => {
      (createTransferTokenTransaction as jest.Mock).mockResolvedValue('mockTransaction' as never);
      (eTransferCore.services.createWithdrawOrder as jest.Mock).mockResolvedValue(createWithdrawOrderRes as never);

      const result = await eTransferCore.withdrawOrder(withdrawOrderParams);

      expect(result.orderId).toBe(createWithdrawOrderRes.orderId);
      expect(result.transactionId).toBe(createWithdrawOrderRes.transactionId);
    });

    it('should throw an error if create failed', async () => {
      (createTransferTokenTransaction as jest.Mock).mockResolvedValue(undefined as never);

      await expect(eTransferCore.withdrawOrder(withdrawOrderParams)).rejects.toThrow(
        'Generate transaction raw failed.',
      );
    });
  });

  describe('handleApproveToken', () => {
    const handleApproveTokenParams = {
      tokenContractCallSendMethod: jest.fn().mockResolvedValue(true as never) as any,
      tokenContractAddress: 'mockAddress',
      endPoint: 'http://localhost',
      eTransferContractAddress: 'eTransferAddress',
      memo: 'memo',
      symbol: 'ELF',
      decimals: 2,
      amount: '100',
      accountAddress: 'accountAddress',
    };
    it('should successfully approve token', async () => {
      (getBalance as jest.Mock).mockResolvedValue('1000000000' as never);
      (getAllowance as jest.Mock).mockResolvedValue('150' as never);
      (getTokenInfo as jest.Mock).mockResolvedValue({ decimals: 2 } as never);
      (checkTokenAllowanceAndApprove as jest.Mock).mockResolvedValue(true as never);
      (createTransferTokenTransaction as jest.Mock).mockResolvedValue('mockTransaction' as never);

      const res = await eTransferCore.handleApproveToken(handleApproveTokenParams);

      expect(res).toBeTruthy();
    });

    it('should throw an error if approve token failed', async () => {
      (getBalance as jest.Mock).mockResolvedValue(new BigNumber('1') as never);

      await expect(
        eTransferCore.handleApproveToken({
          ...handleApproveTokenParams,
          tokenContractCallSendMethod: jest.fn() as any,
        }),
      ).rejects.toThrow(
        'Insufficient ELF balance in your account. Please consider transferring a smaller amount or topping up before you try again.',
      );
    });
  });

  describe('createWithdrawOrder', () => {
    const correctEVMAddress = '0xB464a49eF0b1096f6ed3BA88E5890E5E0aF7E6fc';
    const createWithdrawOrderParams = {
      chainId: 'AELF' as ChainId,
      symbol: 'ELF',
      network: 'ETH',
      toAddress: correctAelfAddress,
      memo: 'mockMock',
      amount: '100',
      rawTransaction: 'mockRawTransaction',
    };
    const createWithdrawOrderId = '0000-1111-2222-3333';
    const createWithdrawOrderTransactionId = 'mockTransactionId';
    const createWithdrawOrderRes = {
      orderId: createWithdrawOrderId,
      transactionId: createWithdrawOrderTransactionId,
    };

    it('should successfully create withdraw order', async () => {
      (createTransferTokenTransaction as jest.Mock).mockResolvedValue('mockTransaction' as never);
      (eTransferCore.services.createWithdrawOrder as jest.Mock).mockResolvedValue(createWithdrawOrderRes as never);

      const result = await eTransferCore.createWithdrawOrder(createWithdrawOrderParams);

      expect(result.orderId).toBe(createWithdrawOrderRes.orderId);
      expect(result.transactionId).toBe(createWithdrawOrderRes.transactionId);
    });

    it('should successfully create withdraw order with evm address', async () => {
      (createTransferTokenTransaction as jest.Mock).mockResolvedValue('mockTransaction' as never);
      (eTransferCore.services.createWithdrawOrder as jest.Mock).mockResolvedValue(createWithdrawOrderRes as never);

      const result = await eTransferCore.createWithdrawOrder({
        ...createWithdrawOrderParams,
        toAddress: correctEVMAddress,
      });

      expect(result.orderId).toBe(createWithdrawOrderRes.orderId);
      expect(result.transactionId).toBe(createWithdrawOrderRes.transactionId);
    });

    it('should throw an error if response don not have orderId', async () => {
      (createTransferTokenTransaction as jest.Mock).mockResolvedValue('mockTransaction' as never);
      (eTransferCore.services.createWithdrawOrder as jest.Mock).mockResolvedValue({
        transactionId: createWithdrawOrderTransactionId,
      } as never);

      try {
        await eTransferCore.createWithdrawOrder(createWithdrawOrderParams);
      } catch (error) {
        expect(error.message).toBe(WITHDRAW_ERROR_MESSAGE);
      }
    });

    it('should throw an CUSTOMIZED_ERROR_MESSAGE if response error code is in WITHDRAW_TRANSACTION_ERROR_CODE_LIST', async () => {
      (createTransferTokenTransaction as jest.Mock).mockResolvedValue('mockTransaction' as never);
      (eTransferCore.services.createWithdrawOrder as jest.Mock).mockRejectedValue({
        code: WITHDRAW_TRANSACTION_ERROR_CODE_LIST[0],
      } as never);

      try {
        await eTransferCore.createWithdrawOrder(createWithdrawOrderParams);
      } catch (error) {
        expect(error.code).toBe(WITHDRAW_TRANSACTION_ERROR_CODE_LIST[0]);
        expect(error.name).toBe(WithdrawErrorNameType.CUSTOMIZED_ERROR_MESSAGE);
      }
    });

    it('should throw an WITHDRAW_ERROR_MESSAGE if response is undefined', async () => {
      (createTransferTokenTransaction as jest.Mock).mockResolvedValue('mockTransaction' as never);
      (eTransferCore.services.createWithdrawOrder as jest.Mock).mockRejectedValue(undefined as never);

      try {
        await eTransferCore.createWithdrawOrder(createWithdrawOrderParams);
      } catch (error) {
        expect(error.message).toBe(WITHDRAW_ERROR_MESSAGE);
      }
    });
  });
});

describe('ETransferCore Second Branch', () => {
  let eTransferCore: ETransferCore;
  const _mockETransferUrl = 'http://etransfer/etransfer';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set authUrl and not set socketUrl form constructor', () => {
    eTransferCore = new ETransferCore({
      etransferUrl: _mockETransferUrl,
      etransferAuthUrl: _mockETransferUrl,
    });

    expect(eTransferCore.baseUrl).toBe(_mockETransferUrl);
    expect(eTransferCore.authUrl).toBe(_mockETransferUrl);
    expect(eTransferCore.socketUrl).toBeFalsy();
  });
});
