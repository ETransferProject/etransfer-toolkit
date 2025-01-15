import AElf from 'aelf-sdk';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getAElf } from '../../src/aelf/aelfBase';
import { CacheViewContracts, getContract } from '../../src/aelf/aelfContract';

jest.mock('aelf-sdk');

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
    getAElf(endPoint); // Ensure instance is created

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
