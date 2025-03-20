import AElf from 'aelf-sdk';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as AelfBaseUtils from '../../src/aelf/aelfBase';
import {
  checkIsEnoughAllowance,
  checkTokenAllowanceAndApprove,
  createManagerForwardCall,
  createTransferToken,
  handleTransaction,
} from '../../src/aelf/aelfContract';
import { getContractMethods, handleManagerForwardCall } from '@portkey/contracts';
import { CONTRACT_METHOD_NAME, MANAGER_FORWARD_CALL } from '../../src/constants';

jest.mock('aelf-sdk');
jest.mock('../../src/aelf/aelfBase', () => {
  const originalModule: any = jest.requireActual('../../src/aelf/aelfBase');
  const mockTransactionId = 'mockTransactionId';
  const mockTxResult = { transactionId: mockTransactionId } as never;

  return {
    __esModule: true,
    ...originalModule,
    getTxResult: jest.fn().mockResolvedValueOnce(mockTxResult as never),
    getRawTx: jest.fn(),
  };
});
jest.mock('@portkey/contracts');

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

  describe('createManagerForwardCall', () => {
    const caContractAddress = 'caContractAddress';
    const contractAddress = 'contractAddress';
    const endPoint = 'http://localhost';
    const args = { key: 'value' };
    const methodName = 'mockMethod';
    const caHash = 'caHash';
    const chainId = 'AELF';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create a manager forward call and return encoded message', async () => {
      const mockResponse = {
        args: new Uint8Array([1, 2, 3]),
      } as never;

      (handleManagerForwardCall as jest.Mock).mockResolvedValue(mockResponse);
      (AElf.utils.uint8ArrayToHex as jest.Mock).mockReturnValue('01 02 03');
      (getContractMethods as jest.Mock).mockResolvedValue({
        [MANAGER_FORWARD_CALL]: {
          fromObject: jest.fn().mockReturnValue({}),
          encode: jest.fn().mockReturnValue({
            finish: jest.fn().mockReturnValue('encoded_result'),
          }),
        },
      } as never);

      const result = await createManagerForwardCall({
        caContractAddress,
        contractAddress,
        endPoint,
        args,
        methodName,
        caHash,
        chainId,
      });

      expect(result).toBe('encoded_result'); // Ensure the return value is correct
    });
  });

  describe('createTransferToken', () => {
    const contractAddress = 'contractAddress';
    const endPoint = 'http://localhost';
    const args = { key: 'value' };
    const chainId = 'AELF';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create transfer token and return encoded message', async () => {
      (AElf.utils.uint8ArrayToHex as jest.Mock).mockReturnValue('01 02 03');
      (AElf.utils.transform.transformMapToArray as jest.Mock).mockReturnValue(['01', '02', '03']);
      (AElf.utils.transform.transform as jest.Mock).mockReturnValue({});

      (getContractMethods as jest.Mock).mockResolvedValue({
        [CONTRACT_METHOD_NAME.TransferToken]: {
          fromObject: jest.fn().mockReturnValue({}),
          encode: jest.fn().mockReturnValue({
            finish: jest.fn().mockReturnValue('encoded_result'),
          }),
        },
      } as never);

      const result = await createTransferToken({
        contractAddress,
        endPoint,
        args,
        chainId,
      });

      expect(result).toBe('encoded_result');
    });
  });

  describe('handleTransaction', () => {
    const mockGetSignature: any = jest.fn();
    const rawTxInput = {
      blockHeightInput: '1',
      blockHashInput: 'mockBlockHash',
      packedInput: 'packedInputValue',
      address: 'mockAddress',
      contractAddress: 'mockContractAddress',
      functionName: 'mockFunction',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create and return encoded hex transaction', async () => {
      const mockRawTx = {
        params: '0x123456',
      };
      (AelfBaseUtils.getRawTx as jest.Mock).mockReturnValue(mockRawTx);
      (AElf.pbUtils.Transaction.encode as jest.Mock).mockReturnValue({
        finish: jest.fn().mockReturnValue('encoded_tx'),
      });

      mockGetSignature.mockResolvedValue({ signature: 'mockSignature' } as never);

      const result = await handleTransaction({ ...rawTxInput, getSignature: mockGetSignature });

      expect(result).toBe('01 02 03');
    });

    it('signature is undefined and return undefined', async () => {
      const mockRawTx = {
        params: '0x123456',
      };
      (AelfBaseUtils.getRawTx as jest.Mock).mockReturnValue(mockRawTx);
      (AElf.pbUtils.Transaction.encode as jest.Mock).mockReturnValue({
        finish: jest.fn().mockReturnValue('encoded_tx'),
      });

      mockGetSignature.mockResolvedValue(undefined as never);

      const result = await handleTransaction({ ...rawTxInput, getSignature: mockGetSignature });

      expect(result).toBe(undefined);
    });

    it('tx is buffer and return correct', async () => {
      const mockRawTx = {
        params: '0x123456',
      };
      (AelfBaseUtils.getRawTx as jest.Mock).mockReturnValue(mockRawTx);
      (AElf.pbUtils.Transaction.encode as jest.Mock).mockReturnValue({
        finish: jest.fn().mockReturnValue(Buffer.from(mockRawTx.params, 'utf-8')),
      });

      mockGetSignature.mockResolvedValue({ signature: 'mockSignature' } as never);

      const result = await handleTransaction({ ...rawTxInput, getSignature: mockGetSignature });

      expect(result).toBe('3078313233343536');
    });
  });
});
