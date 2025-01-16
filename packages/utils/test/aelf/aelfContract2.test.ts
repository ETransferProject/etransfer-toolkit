import AElf from 'aelf-sdk';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as AelfBaseUtils from '../../src/aelf/aelfBase';
import { checkIsEnoughAllowance, checkTokenAllowanceAndApprove } from '../../src/aelf/aelfContract';

jest.mock('aelf-sdk');
jest.mock('../../src/aelf/aelfBase', () => {
  const originalModule: any = jest.requireActual('../../src/aelf/aelfBase');
  const mockTransactionId = 'mockTransactionId';
  const mockTxResult = { transactionId: mockTransactionId } as never;

  return {
    __esModule: true,
    ...originalModule,
    getTxResult: jest.fn().mockResolvedValueOnce(mockTxResult as never),
  };
});

describe('Token Utility Functions', () => {
  const mockEndPoint = 'http://localhost:1234';
  const mockTokenContractAddress = 'mockTokenContractAddress';
  const mockSymbol = 'ELF';
  const mockOwner = 'mockOwnerAddress';
  const mockSpender = 'mockSpenderAddress';
  const mockMemo = 'Test memo';
  const mockTransactionResult = { transactionId: 'mockTransactionId', Status: 'mined' };
  const mockWallet = { address: 'mockWalletAddress' };
  const mockTokenContractCallSendMethod = jest.fn() as any;
  const mockTransactionId = 'mockTransactionId';
  const mockTxResult = { transactionId: mockTransactionId } as never;

  let mockTokenContract;
  beforeEach(() => {
    mockTokenContract = {
      GetBalance: {
        call: jest.fn(),
      },
      GetAllowance: {
        call: jest.fn(),
      },
      GetTokenInfo: {
        call: jest.fn(),
      },
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (AElf.wallet.createNewWallet as jest.Mock).mockReturnValue(mockWallet);

    const mockAElfInstance = {
      chain: {
        contractAt: jest.fn().mockResolvedValue(mockTokenContract as never),
      },
    };
    (AElf as jest.Mock).mockImplementation(() => mockAElfInstance);
    AelfBaseUtils.getAElf(mockEndPoint); // Ensure instance is created

    mockTokenContractCallSendMethod.mockResolvedValueOnce({
      transactionId: mockTransactionId,
    } as never);
    (AelfBaseUtils.getTxResult as jest.Mock).mockResolvedValueOnce(mockTxResult as never); // Simulate getTxResult

    const mockGetBalanceResult = { balance: 10 };
    mockTokenContract.GetBalance.call.mockResolvedValue(mockGetBalanceResult);

    const mockGetAllowanceResult = { allowance: 50000 };
    mockTokenContract.GetAllowance.call.mockResolvedValue(mockGetAllowanceResult);

    const mockGetTokenInfoResult = { symbol: 'ELF' };
    mockTokenContract.GetTokenInfo.call.mockResolvedValue(mockGetTokenInfoResult);
  });

  describe('checkTokenAllowanceAndApprove', () => {
    it('decimal is undefined, and return correct', async () => {
      const result = await checkTokenAllowanceAndApprove({
        tokenContractCallSendMethod: jest.fn().mockResolvedValue(mockTransactionResult as never) as any,
        tokenContractAddress: mockTokenContractAddress,
        endPoint: mockEndPoint,
        symbol: mockSymbol,
        amount: '10',
        owner: mockOwner,
        spender: mockSpender,
        memo: mockMemo,
      });
      expect(result).toBe(false);
    });

    it('should approve allowance if not enough', async () => {
      const result = await checkTokenAllowanceAndApprove({
        tokenContractCallSendMethod: jest.fn().mockResolvedValue(mockTransactionResult as never) as any,
        tokenContractAddress: mockTokenContractAddress,
        endPoint: mockEndPoint,
        symbol: mockSymbol,
        amount: '100000',
        owner: mockOwner,
        spender: mockSpender,
        memo: mockMemo,
      });
      expect(result).toBe(false);
    });

    it('should not approve allowance if already enough', async () => {
      const result = await checkTokenAllowanceAndApprove({
        tokenContractCallSendMethod: jest.fn().mockResolvedValue(mockTransactionResult as never) as any,
        tokenContractAddress: mockTokenContractAddress,
        endPoint: mockEndPoint,
        symbol: mockSymbol,
        amount: '0.0000001',
        owner: mockOwner,
        spender: mockSpender,
        memo: mockMemo,
      });
      expect(result).toBe(true);
    });
  });

  describe('checkIsEnoughAllowance', () => {
    it('should return true if allowance is sufficient', async () => {
      const result = await checkIsEnoughAllowance({
        endPoint: mockEndPoint,
        tokenContractAddress: mockTokenContractAddress,
        symbol: mockSymbol,
        owner: mockOwner,
        spender: mockSpender,
        amount: '0.000000001',
      });

      expect(result).toBe(true);
    });

    it('should return false if allowance is insufficient', async () => {
      const result = await checkIsEnoughAllowance({
        endPoint: mockEndPoint,
        tokenContractAddress: mockTokenContractAddress,
        symbol: mockSymbol,
        owner: mockOwner,
        spender: mockSpender,
        amount: '100000',
      });

      expect(result).toBe(false);
    });
  });

  //   describe('createManagerForwardCall', () => {});

  //   describe('createTransferToken', () => {});

  //   describe('handleTransaction', () => {});
});
