import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EtransferRequest } from '@etransfer/request';
import {
  TGetAuthRequest,
  TGetAuthResult,
  TGetTokenListRequest,
  TGetTokenListResult,
  TGetTokenOptionRequest,
  TGetTokenOptionResult,
  TGetNetworkListRequest,
  TGetNetworkListResult,
  TCheckEOARegistrationRequest,
  TCheckEOARegistrationResult,
  TCreateWithdrawOrderRequest,
  TCreateWithdrawOrderResult,
  TGetDepositInfoRequest,
  TGetDepositInfoResult,
  PortkeyVersion,
  AuthTokenSource,
  BusinessType,
  TGetTokenPricesRequest,
  TGetTokenPricesResult,
  TGetDepositCalculateRequest,
  TGetDepositCalculateResult,
  TGetRecordsListRequest,
  TGetRecordsListResult,
  RecordsRequestType,
  RecordsRequestStatus,
  TGetRecordStatusResult,
  TGetWithdrawInfoRequest,
  TGetWithdrawInfoResult,
  TGetOtherChainAuthRequest,
  TCheckRegistrationRequest,
  TCheckRegistrationResult,
  WalletSourceType,
  TGetTransferInfoResult,
  TGetTransferInfoRequest,
  TCreateTransferOrderRequest,
  TCreateTransferOrderResult,
  TUpdateTransferOrderResult,
  TUpdateTransferOrderRequest,
  TGetTokenNetworkRelationRequest,
  TGetTokenNetworkRelationResult,
  TGetRecordStatusRequest,
} from '@etransfer/types';
import { BaseService, Services } from '../src/services';
import { API_LIST, CANCEL_TOKEN_SOURCE_KEY } from '../src/constants';
import { formatApiError } from '../src/utils';

jest.mock('@etransfer/request');
jest.mock('../src/utils');

export class TestBaseService extends BaseService {}

describe('BaseService', () => {
  let testService: TestBaseService;
  let mockRequest: jest.Mocked<EtransferRequest>;

  beforeEach(() => {
    mockRequest = new EtransferRequest() as jest.Mocked<EtransferRequest>;
    (EtransferRequest as jest.Mock).mockImplementation(() => mockRequest);
    testService = new TestBaseService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set request config properly', () => {
    const key = 'timeout';
    const value = 5000;

    testService.setRequestConfig(key, value);
    expect(mockRequest.setConfig).toHaveBeenCalledWith(key, value);
  });

  it('should set request headers properly', () => {
    const key = 'Authorization';
    const value = 'Bearer some-token';

    testService.setRequestHeaders(key, value);
    expect(mockRequest.setHeaders).toHaveBeenCalledWith(key, value);
  });

  it('should return request instance', () => {
    const requestInstance = testService.getRequest();
    expect(requestInstance).toBe(mockRequest);
  });
});

describe('Services', () => {
  let services: Services;
  let mockRequest: jest.Mocked<EtransferRequest>;

  const defaultResponse = {
    status: 0,
    statusText: '',
    headers: {},
    config: {},
  };
  const authToken = 'Bearer token';

  beforeEach(() => {
    mockRequest = new EtransferRequest() as jest.Mocked<EtransferRequest>;
    (EtransferRequest as jest.Mock).mockImplementation(() => mockRequest);
    services = new Services();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthToken', () => {
    it('should get auth token successfully', async () => {
      const params: TGetAuthRequest = {
        pubkey: '',
        signature: '',
        plain_text: '',
        ca_hash: '',
        chain_id: '',
        managerAddress: '',
        version: PortkeyVersion.v2,
        source: AuthTokenSource.Portkey,
        recaptchaToken: '',
      };
      const result: TGetAuthResult = {
        token_type: 'Bearer',
        access_token: '',
        expires_in: 172798,
      };

      mockRequest.post.mockResolvedValue({
        data: result,
        ...defaultResponse,
      });

      const response = await services.getAuthToken(params);

      expect(response).toEqual(result);
      expect(mockRequest.post).toHaveBeenCalledWith(
        `/connect/token`,
        expect.stringContaining('grant_type=signature'),
        expect.objectContaining({ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }),
      );
    });

    it('should handle error in getAuthToken', async () => {
      const params: TGetAuthRequest = {
        pubkey: '',
        signature: '',
        plain_text: '',
        ca_hash: '',
        chain_id: '',
        managerAddress: '',
        version: PortkeyVersion.v2,
        source: AuthTokenSource.Portkey,
        recaptchaToken: '',
      };
      const error = { message: 'Network Error' };
      mockRequest.post.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getAuthToken error'));

      await expect(services.getAuthToken(params)).rejects.toThrow('getAuthToken error');
    });
  });
  describe('getOtherChainAuthToken', () => {
    it('should get other chain auth token successfully', async () => {
      const params: TGetOtherChainAuthRequest = {
        pubkey: '',
        signature: '',
        plain_text: '',
        recaptchaToken: '',
        sourceType: AuthTokenSource.EVM,
      };
      const result: TGetAuthResult = {
        token_type: 'Bearer',
        access_token: '',
        expires_in: 172798,
      };

      mockRequest.post.mockResolvedValue({
        data: result,
        ...defaultResponse,
      });

      const response = await services.getOtherChainAuthToken(params);

      expect(response).toEqual(result);
      expect(mockRequest.post).toHaveBeenCalledWith(
        `/connect/token`,
        expect.stringContaining('grant_type=signature'),
        expect.objectContaining({ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }),
      );
    });

    it('should handle error in getOtherChainAuthToken', async () => {
      const params: TGetOtherChainAuthRequest = {
        pubkey: '',
        signature: '',
        plain_text: '',
        recaptchaToken: '',
        sourceType: AuthTokenSource.EVM,
      };
      const error = { message: 'Network Error' };
      mockRequest.post.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getOtherChainAuthToken error'));

      await expect(services.getOtherChainAuthToken(params)).rejects.toThrow('getOtherChainAuthToken error');
    });
  });

  describe('getTokenList', () => {
    it('should get token list successfully', async () => {
      const params: TGetTokenListRequest = {
        type: BusinessType.Deposit,
        chainId: 'AELF',
      };
      const result: TGetTokenListResult = {
        tokenList: [],
      };

      mockRequest.send.mockResolvedValue({
        data: result,
        ...defaultResponse,
      });

      const response = await services.getTokenList(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.common.getTokenList, { params });
    });

    it('should handle error in getTokenList', async () => {
      const params: TGetTokenListRequest = {
        type: BusinessType.Deposit,
        chainId: 'AELF',
      };
      const error = { message: 'Token List Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getTokenList error'));

      await expect(services.getTokenList(params)).rejects.toThrow('getTokenList error');
    });
  });

  describe('getTokenOption', () => {
    it('should get token options successfully', async () => {
      const params: TGetTokenOptionRequest = {
        type: BusinessType.Deposit,
      };
      const result: TGetTokenOptionResult = {
        tokenList: [],
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getTokenOption(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.common.getTokenOption, { params });
    });

    it('should handle error in getTokenOption', async () => {
      const params: TGetTokenOptionRequest = {
        type: BusinessType.Deposit,
      };
      const error = { message: 'Token Option Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getTokenOption error'));

      await expect(services.getTokenOption(params)).rejects.toThrow('getTokenOption error');
    });
  });

  describe('getNetworkList', () => {
    const params: TGetNetworkListRequest = {
      type: BusinessType.Deposit,
      chainId: 'AELF',
    };

    const result: TGetNetworkListResult = {
      networkList: [],
    };

    it('should get network list successfully', async () => {
      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getNetworkList(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.common.getNetworkList, {
        params,
        cancelTokenSourceKey: CANCEL_TOKEN_SOURCE_KEY.GET_NETWORK_LIST,
      });
    });

    it('should get network list successfully with auth token', async () => {
      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getNetworkList(params, authToken);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.common.getNetworkList, {
        params,
        cancelTokenSourceKey: CANCEL_TOKEN_SOURCE_KEY.GET_NETWORK_LIST,
        headers: { Authorization: authToken },
      });
    });

    it('should handle error in getNetworkList', async () => {
      const error = { message: 'Network List Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getNetworkList error'));

      await expect(services.getNetworkList(params)).rejects.toThrow('getNetworkList error');
    });
  });

  describe('getTokenPrices', () => {
    it('should get token prices successfully', async () => {
      const params: TGetTokenPricesRequest = {
        symbols: 'ELF',
      };
      const result: TGetTokenPricesResult = {
        items: [],
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getTokenPrices(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.common.getTokenPrices, {
        params,
      });
    });

    it('should handle error in getTokenPrices', async () => {
      const params: TGetTokenPricesRequest = {
        symbols: 'ELF',
      };
      const error = { message: 'Token Prices Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getTokenPrices error'));

      await expect(services.getTokenPrices(params)).rejects.toThrow('getTokenPrices error');
    });
  });

  describe('getDepositCalculate', () => {
    it('should get deposit info successfully', async () => {
      const params: TGetDepositInfoRequest = {
        chainId: 'AELF',
        network: '',
      };
      const result: TGetDepositInfoResult = {
        depositInfo: {
          depositAddress: '',
          minAmount: '',
          extraNotes: undefined,
          minAmountUsd: '',
          serviceFee: undefined,
          serviceFeeUsd: undefined,
          currentThreshold: undefined,
          extraInfo: undefined,
        },
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getDepositInfo(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.deposit.getDepositInfo, {
        params,
        cancelTokenSourceKey: CANCEL_TOKEN_SOURCE_KEY.GET_DEPOSIT_INFO,
      });
    });

    it('should handle error in getDepositInfo', async () => {
      const params: TGetDepositInfoRequest = {
        chainId: 'AELF',
        network: '',
      };
      const error = { message: 'Deposit Info Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getDepositInfo error'));

      await expect(services.getDepositInfo(params)).rejects.toThrow('getDepositInfo error');
    });
  });

  describe('getDepositCalculate', () => {
    it('should calculate deposit receive successfully', async () => {
      const params: TGetDepositCalculateRequest = {
        toChainId: 'AELF',
        fromSymbol: 'USDT',
        toSymbol: 'SGR-1',
        fromAmount: '100',
      };
      const result: TGetDepositCalculateResult = {
        conversionRate: {
          fromSymbol: 'USDT',
          toSymbol: 'SGR-1',
          fromAmount: '100',
          toAmount: '1000',
          minimumReceiveAmount: '900',
        },
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getDepositCalculate(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.deposit.depositCalculator, {
        params,
      });
    });

    it('should handle error in getDepositCalculate', async () => {
      const params: TGetDepositCalculateRequest = {
        toChainId: 'AELF',
        fromSymbol: 'USDT',
        toSymbol: 'SGR-1',
        fromAmount: '100',
      };
      const error = { message: 'Deposit Calculate Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getDepositCalculate error'));

      await expect(services.getDepositCalculate(params)).rejects.toThrow('getDepositCalculate error');
    });
  });

  describe('getWithdrawInfo', () => {
    it('should get withdraw info successfully', async () => {
      const params: TGetWithdrawInfoRequest = {
        chainId: 'AELF',
      };
      const result: TGetWithdrawInfoResult = {
        withdrawInfo: {
          maxAmount: '',
          minAmount: '',
          limitCurrency: '',
          totalLimit: '',
          remainingLimit: '',
          transactionFee: '',
          transactionUnit: '',
          expiredTimestamp: 0,
          aelfTransactionFee: '',
          aelfTransactionUnit: '',
          receiveAmount: '',
          feeList: [],
          receiveAmountUsd: '',
          amountUsd: '',
          feeUsd: '',
        },
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getWithdrawInfo(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.withdraw.getWithdrawInfo, {
        params,
        cancelTokenSourceKey: CANCEL_TOKEN_SOURCE_KEY.GET_WITHDRAW_INFO,
      });
    });

    it('should handle error in getWithdrawInfo', async () => {
      const params: TGetWithdrawInfoRequest = {
        chainId: 'AELF',
      };
      const error = { message: 'Get Withdrawal Info Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getWithdrawInfo error'));

      await expect(services.getWithdrawInfo(params)).rejects.toThrow('getWithdrawInfo error');
    });
  });

  describe('createWithdrawOrder', () => {
    it('should create withdraw order successfully', async () => {
      const params: TCreateWithdrawOrderRequest = {
        network: '',
        symbol: '',
        amount: '',
        fromChainId: 'AELF',
        toAddress: '',
        rawTransaction: '',
      };
      const result: TCreateWithdrawOrderResult = {
        orderId: '',
        transactionId: '',
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.createWithdrawOrder(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.withdraw.createWithdrawOrder, {
        data: params,
      });
    });

    it('should handle error in createWithdrawOrder', async () => {
      const params: TCreateWithdrawOrderRequest = {
        network: '',
        symbol: '',
        amount: '',
        fromChainId: 'AELF',
        toAddress: '',
        rawTransaction: '',
      };
      const error = { message: 'Create Withdraw Order Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('createWithdrawOrder error'));

      await expect(services.createWithdrawOrder(params)).rejects.toThrow('createWithdrawOrder error');
    });
  });

  describe('getRecordsList', () => {
    it('should get record list successfully', async () => {
      const params: TGetRecordsListRequest = {
        type: RecordsRequestType.All,
        status: RecordsRequestStatus.All,
        skipCount: 0,
        maxResultCount: 0,
      };
      const result: TGetRecordsListResult = {
        totalCount: 0,
        items: [],
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getRecordsList(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.records.getRecordsList, { params });
    });

    it('should handle error in getRecordsList', async () => {
      const params: TGetRecordsListRequest = {
        type: RecordsRequestType.All,
        status: RecordsRequestStatus.All,
        skipCount: 0,
        maxResultCount: 0,
      };
      const error = { message: 'Get Record List Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getRecordsList error'));

      await expect(services.getRecordsList(params)).rejects.toThrow('getRecordsList error');
    });
  });

  describe('getRecordStatus', () => {
    it('should get record status successfully', async () => {
      const result: TGetRecordStatusResult = {
        status: false,
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getRecordStatus();

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.records.getRecordStatus, {});
    });

    it('should get record status successfully with params', async () => {
      const params: TGetRecordStatusRequest = {
        addressList: ['address1', 'address2'],
      };
      const result: TGetRecordStatusResult = {
        status: false,
      };

      mockRequest.send.mockImplementation((_url: any, config: any) => {
        config?.paramsSerializer();
        return Promise.resolve({ data: result, ...defaultResponse });
      });

      const response = await services.getRecordStatus(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalled();
    });

    it('should handle error in getRecordStatus', async () => {
      const error = { message: 'Get Record Status Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getRecordStatus error'));

      await expect(services.getRecordStatus()).rejects.toThrow('getRecordStatus error');
    });
  });

  describe('getRecordDetail', () => {
    it('should get record detail successfully', async () => {
      const result: any = {};
      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getRecordDetail('0000-1111-2222');

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.records.getRecordDetail, { query: '0000-1111-2222' });
    });

    it('should handle error in getRecordDetail', async () => {
      const error = { message: 'Get Record Detail Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getRecordDetail error'));

      await expect(services.getRecordDetail('0000-1111-2222')).rejects.toThrow('getRecordDetail error');
    });
  });

  describe('checkEOARegistration', () => {
    it('should check EOA registration successfully', async () => {
      const params: TCheckEOARegistrationRequest = {
        address: '',
      };
      const result: TCheckEOARegistrationResult = {
        result: false,
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.checkEOARegistration(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.user.checkEOARegistration, { params });
    });

    it('should handle error in checkEOARegistration', async () => {
      const params: TCheckEOARegistrationRequest = { address: '' };
      const error = { message: 'Check EOA Registration Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('checkEOARegistration error'));

      await expect(services.checkEOARegistration(params)).rejects.toThrow('checkEOARegistration error');
    });
  });

  describe('checkRegistration', () => {
    it('should check registration successfully', async () => {
      const params: TCheckRegistrationRequest = {
        address: '',
        sourceType: WalletSourceType.EVM,
      };
      const result: TCheckRegistrationResult = {
        result: false,
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.checkRegistration(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.user.checkRegistration, { params });
    });

    it('should handle error in checkRegistration', async () => {
      const params: TCheckRegistrationRequest = { address: '', sourceType: WalletSourceType.EVM };
      const error = { message: 'Check Registration Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('checkRegistration error'));

      await expect(services.checkRegistration(params)).rejects.toThrow('checkRegistration error');
    });
  });

  describe('getTokenNetworkRelation', () => {
    it('should get transfer info successfully', async () => {
      const params: TGetTokenNetworkRelationRequest = {};
      const result: TGetTokenNetworkRelationResult = {};

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getTokenNetworkRelation({});

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.transfer.getTokenNetworkRelation, {
        params,
        headers: {
          Authorization: '',
        },
      });
    });

    it('should handle error in getTokenNetworkRelation', async () => {
      const params: TGetTokenNetworkRelationRequest = {};
      const error = { message: 'Get Transfer Info Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getTokenNetworkRelation error'));

      await expect(services.getTokenNetworkRelation(params)).rejects.toThrow('getTokenNetworkRelation error');
    });
  });

  describe('getTransferInfo', () => {
    it('should get transfer info successfully', async () => {
      const params: TGetTransferInfoRequest = {
        fromNetwork: 'EVM',
        symbol: 'USDT',
      };
      const result: TGetTransferInfoResult = {
        transferInfo: {
          maxAmount: '',
          minAmount: '',
          limitCurrency: '',
          totalLimit: '',
          remainingLimit: '',
          expiredTimestamp: 0,
          receiveAmount: '',
          receiveAmountUsd: '',
          amountUsd: '',
          feeUsd: '',
        },
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.getTransferInfo(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.transfer.getTransferInfo, {
        params,
        cancelTokenSourceKey: CANCEL_TOKEN_SOURCE_KEY.GET_TRANSFER_INFO,
        headers: {
          Authorization: '',
        },
      });
    });

    it('should handle error in getTransferInfo', async () => {
      const params: TGetTransferInfoRequest = {
        fromNetwork: 'EVM',
        symbol: 'ELF',
      };
      const error = { message: 'Get Transfer Info Error' };
      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('getTransferInfo error'));

      await expect(services.getTransferInfo(params)).rejects.toThrow('getTransferInfo error');
    });
  });

  describe('createTransferOrder', () => {
    const params: TCreateTransferOrderRequest = {
      amount: '10',
      fromNetwork: 'EVM',
      toNetwork: 'AELF',
      fromSymbol: 'USDT',
      toSymbol: 'USDT',
      fromAddress: '0x',
      toAddress: 'address',
    };

    it('should create transfer order successfully', async () => {
      const result: TCreateTransferOrderResult = {
        orderId: '',
        transactionId: '',
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.createTransferOrder(params);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.transfer.createTransferOrder, {
        data: params,
      });
    });

    it('should create transfer order successfully with auth token', async () => {
      const result: TCreateTransferOrderResult = {
        orderId: '',
        transactionId: '',
      };

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.createTransferOrder(params, authToken);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.transfer.createTransferOrder, {
        data: params,
        headers: { Authorization: authToken },
      });
    });

    it('should handle error in createTransferOrder', async () => {
      const error = { message: 'Create Transfer Order Error' };

      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('createTransferOrder error'));

      await expect(services.createTransferOrder(params)).rejects.toThrow('createTransferOrder error');
    });
  });

  describe('UpdateTransferOrder', () => {
    const params: TUpdateTransferOrderRequest = {
      amount: '10',
      fromNetwork: 'EVM',
      toNetwork: 'AELF',
      fromSymbol: 'USDT',
      toSymbol: 'USDT',
      fromAddress: '0x',
      toAddress: 'toAddress',
      address: 'address',
      txId: 'transactionId',
    };
    const orderId = 'orderid';

    it('should create transfer order successfully', async () => {
      const result: TUpdateTransferOrderResult = true;

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.updateTransferOrder(params, orderId);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.transfer.updateTransferOrder, {
        data: params,
        query: orderId,
      });
    });

    it('should create transfer order successfully with auth token', async () => {
      const result: TUpdateTransferOrderResult = true;

      mockRequest.send.mockResolvedValue({ data: result, ...defaultResponse });

      const response = await services.updateTransferOrder(params, orderId, authToken);

      expect(response).toEqual(result);
      expect(mockRequest.send).toHaveBeenCalledWith(API_LIST.transfer.updateTransferOrder, {
        data: params,
        query: orderId,
        headers: { Authorization: authToken },
      });
    });

    it('should handle error in updateTransferOrder', async () => {
      const error = { message: 'Create Transfer Order Error' };

      mockRequest.send.mockRejectedValue(error);
      (formatApiError as jest.Mock).mockReturnValue(new Error('updateTransferOrder error'));

      await expect(services.updateTransferOrder(params, orderId)).rejects.toThrow('updateTransferOrder error');
    });
  });
});
