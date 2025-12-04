import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TWalletType } from '@etransfer/types';
import { createManagerForwardCall, getAElf, createTransferToken, handleTransaction } from '../../src/aelf';
import { createTransferTokenTransaction } from '../../src/contract/etransferContract';

jest.mock('aelf-sdk'); // Mock AElf SDK
jest.mock('../../src/aelf', () => ({
  createTransferToken: jest.fn(),
  createManagerForwardCall: jest.fn(),
  handleTransaction: jest.fn(),
  getAElf: jest.fn(),
}));

describe('createTransferTokenTransaction', () => {
  const mockEndPoint = 'http://localhost:1234';
  const mockChainId = 'AELF';
  const mockFromManagerAddress = 'mockFromManagerAddress';
  const mockSymbol = 'TOKEN';
  const mockAmount = '1000';
  const mockMemo = 'Test transaction';
  const mockCaContractAddress = 'mockCaContractAddress';
  const mockETransferContractAddress = 'mockETransferContractAddress';
  const mockCaHash = 'mockCaHash';
  const mockGetSignature: any = jest.fn().mockResolvedValue('mockSignature' as never);
  const mockPackedInput = 'packedInputExample';
  const mockTransactionResponse = { txId: '12345' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a transfer token transaction with NightElf wallet type', async () => {
    (getAElf as jest.Mock).mockReturnValue({
      chain: {
        getChainStatus: jest.fn().mockResolvedValue({ BestChainHeight: 1, BestChainHash: 'mockChainHash' } as never),
      },
    });
    (createTransferToken as jest.Mock).mockResolvedValue({ args: { packedInput: mockPackedInput } } as never);
    (handleTransaction as jest.Mock).mockResolvedValue(mockTransactionResponse as never);

    const result = await createTransferTokenTransaction({
      walletType: TWalletType.NightElf,
      caContractAddress: mockCaContractAddress,
      eTransferContractAddress: mockETransferContractAddress,
      symbol: mockSymbol,
      amount: mockAmount,
      chainId: 'AELF',
      endPoint: mockEndPoint,
      fromManagerAddress: mockFromManagerAddress,
      getSignature: mockGetSignature,
      memo: mockMemo,
    });

    expect(createTransferToken).toHaveBeenCalledWith({
      contractAddress: mockETransferContractAddress,
      endPoint: mockEndPoint,
      chainId: mockChainId,
      args: { symbol: mockSymbol, amount: mockAmount, memo: mockMemo },
    });

    expect(result).toEqual(mockTransactionResponse);
  });

  it('should create a manager forward call transaction for other wallet types', async () => {
    (getAElf as jest.Mock).mockReturnValue({
      chain: {
        getChainStatus: jest.fn().mockResolvedValue({ BestChainHeight: 1, BestChainHash: 'mockChainHash' } as never),
      },
    });
    (createManagerForwardCall as jest.Mock).mockResolvedValue({ args: { packedInput: mockPackedInput } } as never);
    (handleTransaction as jest.Mock).mockResolvedValue(mockTransactionResponse as never);

    const result = await createTransferTokenTransaction({
      walletType: TWalletType.Portkey,
      caContractAddress: mockCaContractAddress,
      eTransferContractAddress: mockETransferContractAddress,
      symbol: mockSymbol,
      amount: mockAmount,
      chainId: mockChainId,
      endPoint: mockEndPoint,
      fromManagerAddress: mockFromManagerAddress,
      getSignature: mockGetSignature,
      memo: mockMemo,
      caHash: mockCaHash,
    });

    expect(createManagerForwardCall).toHaveBeenCalledWith({
      caContractAddress: mockCaContractAddress,
      contractAddress: mockETransferContractAddress,
      caHash: mockCaHash,
      methodName: expect.any(String), // Contract method name
      args: { symbol: mockSymbol, amount: mockAmount, memo: mockMemo },
      chainId: mockChainId,
      endPoint: mockEndPoint,
    });

    expect(result).toEqual(mockTransactionResponse);
  });

  it('should throw an error if caHash is missing when required', async () => {
    await expect(
      createTransferTokenTransaction({
        walletType: TWalletType.Portkey,
        caContractAddress: mockCaContractAddress,
        eTransferContractAddress: mockETransferContractAddress,
        symbol: mockSymbol,
        amount: mockAmount,
        chainId: mockChainId,
        endPoint: mockEndPoint,
        fromManagerAddress: mockFromManagerAddress,
        getSignature: mockGetSignature,
        memo: mockMemo,
        caHash: undefined, // Missing caHash
      }),
    ).rejects.toThrow('User caHash is missing');
  });
});
