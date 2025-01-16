import AElf from 'aelf-sdk';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as AelfBaseUtils from '../../src/aelf/aelfBase';
import {
  approveAllowance,
  CacheViewContracts,
  getAllowance,
  getBalance,
  getContract,
  getTokenContract,
  getTokenInfo,
} from '../../src/aelf/aelfContract';
import { CONTRACT_GET_DATA_ERROR, CONTRACT_METHOD_NAME } from '../../src/constants';
import BigNumber from 'bignumber.js';

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

describe('getContract', () => {
  const mockWallet = { address: 'mockWalletAddress' };
  const mockContract = { methods: {} } as never;

  beforeEach(() => {
    jest.clearAllMocks();
    (AElf.wallet.createNewWallet as jest.Mock).mockReturnValue(mockWallet);
  });

  it('should create a new contract and cache it', async () => {
    const endPoint = 'http://localhost:1234';
    const contractAddress = 'mockContractAddress';

    // Mock the AElf instance and contractAt
    const mockAElfInstance = {
      chain: {
        contractAt: jest.fn().mockResolvedValue(mockContract),
      },
    };
    (AElf as jest.Mock).mockImplementation(() => mockAElfInstance);
    AelfBaseUtils.getAElf(endPoint); // Ensure instance is created

    await getContract(endPoint, contractAddress);

    expect(mockAElfInstance.chain.contractAt).toHaveBeenCalledWith(contractAddress, mockWallet);
    expect(CacheViewContracts[`${endPoint}${contractAddress}`]).toBe(mockContract); // Ensure it has been cached
  });

  it('should return cached contract if already exists', async () => {
    const endPoint = 'http://localhost:1234';
    const contractAddress = 'mockContractAddress';

    CacheViewContracts[`${endPoint}${contractAddress}`] = mockContract; // Pre-populate cache

    const contract = await getContract(endPoint, contractAddress);

    expect(contract).toBe(mockContract); // Should return the cached contract
  });
});

describe('getTokenContract', () => {
  const mockEndPoint = 'http://localhost:1234';
  const mockTokenContractAddress = 'mockTokenContractAddress';
  const mockWallet = { address: 'mockWalletAddress' };
  const mockContract = { methods: {} } as never;

  beforeEach(() => {
    jest.clearAllMocks();
    (AElf.wallet.createNewWallet as jest.Mock).mockReturnValue(mockWallet);
  });

  it('should call getContract with correct parameters', async () => {
    // Mock the AElf instance and contractAt
    const mockAElfInstance = {
      chain: {
        contractAt: jest.fn().mockResolvedValue(mockContract),
      },
    };
    (AElf as jest.Mock).mockImplementation(() => mockAElfInstance);
    AelfBaseUtils.getAElf(mockEndPoint); // Ensure instance is created

    const result = await getTokenContract(mockEndPoint, mockTokenContractAddress);

    expect(result).toEqual(mockContract);
  });
});

describe('GetBalance, GetAllowance and GetTokenInfo Utility Functions', () => {
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

  describe('getBalance', () => {
    it('should return the balance for a valid token contract call', async () => {
      const symbol = 'ELF';
      const owner = 'someOwnerAddress';
      const mockResult = { balance: 100 };

      mockTokenContract.GetBalance.call.mockResolvedValue(mockResult);

      const balance = await getBalance(mockTokenContract, symbol, owner);

      expect(mockTokenContract.GetBalance.call).toHaveBeenCalledWith({ symbol, owner }); // Ensure it's called with correct params
      expect(balance).toBe(mockResult.balance); // Ensure the return value is correct
    });

    it('should return undefined if no balance is returned', async () => {
      const symbol = 'ELF';
      const owner = 'someOwnerAddress';

      mockTokenContract.GetBalance.call.mockResolvedValue(null);

      const balance = await getBalance(mockTokenContract, symbol, owner);

      expect(balance).toBeUndefined(); // Ensure the return value is undefined
    });
  });

  describe('getAllowance', () => {
    it('should return the allowance for a valid token contract call', async () => {
      const symbol = 'ELF';
      const owner = 'someOwnerAddress';
      const spender = 'someSpenderAddress';
      const mockResult = { allowance: 50 };

      mockTokenContract.GetAllowance.call.mockResolvedValue(mockResult);

      const allowance = await getAllowance(mockTokenContract, symbol, owner, spender);

      expect(mockTokenContract.GetAllowance.call).toHaveBeenCalledWith({ symbol, owner, spender }); // Ensure it's called with correct params
      expect(allowance).toBe(mockResult.allowance); // Ensure the return value is correct
    });

    it('should return undefined if no allowance is returned', async () => {
      const symbol = 'ELF';
      const owner = 'someOwnerAddress';
      const spender = 'someSpenderAddress';

      mockTokenContract.GetAllowance.call.mockResolvedValue(null);

      const allowance = await getAllowance(mockTokenContract, symbol, owner, spender);

      expect(allowance).toBeUndefined(); // Ensure the return value is undefined
    });
  });

  describe('getTokenInfo', () => {
    it('should return token info for a valid token contract call', async () => {
      const symbol = 'ELF';
      const mockResult = { symbol: 'ELF', decimals: 2 };

      mockTokenContract.GetTokenInfo.call.mockResolvedValue(mockResult);

      const result = await getTokenInfo(mockTokenContract, symbol);

      expect(mockTokenContract.GetTokenInfo.call).toHaveBeenCalledWith({ symbol }); // Ensure it's called with correct params
      expect(result).toEqual(mockResult); // Ensure the returned value is correct
    });

    it('should throw an error if token info is missing symbol', async () => {
      const symbol = 'ELF';
      const mockResult = { decimals: 2 };

      mockTokenContract.GetTokenInfo.call.mockResolvedValue(mockResult);

      await expect(getTokenInfo(mockTokenContract, symbol)).rejects.toThrow(CONTRACT_GET_DATA_ERROR); // Expect an error to be thrown
    });
  });
});

describe('approveAllowance', () => {
  const mockTokenContractCallSendMethod = jest.fn() as any;
  const mockTransactionId = 'mockTransactionId';
  const mockTxResult = { transactionId: mockTransactionId } as never;
  const params = {
    tokenContractCallSendMethod: mockTokenContractCallSendMethod,
    tokenContractAddress: 'mockTokenContractAddress',
    endPoint: 'http://localhost:1234',
    symbol: 'ELF',
    amount: new BigNumber(100),
    spender: 'mockSpender',
    memo: 'Test memo',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should approve allowance and return true', async () => {
    // Mock the implementation of the method
    mockTokenContractCallSendMethod.mockResolvedValueOnce({
      transactionId: mockTransactionId,
    } as never);

    (AelfBaseUtils.getTxResult as jest.Mock).mockResolvedValueOnce(mockTxResult as never); // Simulate getTxResult

    const result = await approveAllowance(params);

    expect(mockTokenContractCallSendMethod).toHaveBeenCalledWith({
      contractAddress: params.tokenContractAddress,
      methodName: CONTRACT_METHOD_NAME.Approve,
      args: {
        spender: params.spender,
        symbol: params.symbol,
        amount: '100', // amount as a string
        memo: params.memo,
      },
    });

    expect(result).toBe(true); // Ensure the result is true
  });

  it('should throw an error if transactionId is missing', async () => {
    mockTokenContractCallSendMethod.mockResolvedValueOnce({} as never); // Mock with no transactionId

    await expect(approveAllowance(params)).rejects.toThrow('Missing transactionId');
  });

  it('should throw an error if tokenContractCallSendMethod return undefined', async () => {
    params.tokenContractCallSendMethod = mockTokenContractCallSendMethod.mockResolvedValue(undefined);

    await expect(approveAllowance(params)).rejects.toThrow('Missing transactionId');
  });

  it('should return result from getTxResult', async () => {
    mockTokenContractCallSendMethod.mockResolvedValueOnce({
      transactionId: mockTransactionId,
    });
    (AelfBaseUtils.getTxResult as jest.Mock).mockResolvedValueOnce(mockTxResult); // Simulate getTxResult

    const result = await approveAllowance(params);

    expect(mockTokenContractCallSendMethod).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
