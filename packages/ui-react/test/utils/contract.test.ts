import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import BigNumber from 'bignumber.js';
import { divDecimals, getBalance, getTokenContract } from '@etransfer/utils';
import { getNetworkType } from '../../src/utils/login';
import { getAelfReact, getBalanceDivDecimals, getBalanceDivDecimalsAdapt } from '../../src/utils/contract';
import * as AELF_Mainnet from '../../src/constants/platform/AELF';
import * as tDVV_Mainnet from '../../src/constants/platform/tDVV';
import * as AELF_Testnet from '../../src/constants/platform/AELF_Testnet';
import * as tDVW_Mainnet from '../../src/constants/platform/tDVW_Testnet';

jest.mock('aelf-sdk');

jest.mock('@etransfer/utils', () => ({
  getTokenContract: jest.fn(),
  getBalance: jest.fn(),
  divDecimals: jest.fn(),
  handleWebLoginErrorMessage: jest.fn(),
}));

jest.mock('../../src/utils/login', () => ({
  getNetworkType: jest.fn().mockReturnValue('TESTNET'),
}));

jest.mock('../../src/components/SingleMessage', () => ({
  error: jest.fn(),
}));

describe('getAelfReact', () => {
  it('should return correct values for AELF mainnet', () => {
    const mockChainId = 'AELF';
    const mockNetworkType = 'MAINNET';

    (getNetworkType as jest.Mock).mockReturnValue(mockNetworkType);

    const result = getAelfReact(mockNetworkType, mockChainId);

    expect(result.endPoint).toEqual(AELF_Mainnet.CHAIN_INFO.rpcUrl);
    expect(result.exploreUrl).toEqual(AELF_Mainnet.CHAIN_INFO.exploreUrl);
    expect(result.contractAddress.CA_CONTRACT).toEqual(AELF_Mainnet.CA_CONTRACT_V2);
    expect(result.contractAddress.TOKEN_CONTRACT).toEqual(AELF_Mainnet.TOKEN_CONTRACT);
    expect(result.contractAddress.ETRANSFER).toEqual(AELF_Mainnet.ETRANSFER_CONTRACT);
  });

  it('should return correct values for tDVV mainnet', () => {
    const mockChainId = 'tDVV';
    const mockNetworkType = 'MAINNET';

    (getNetworkType as jest.Mock).mockReturnValue(mockNetworkType);

    const result = getAelfReact(mockNetworkType, mockChainId);

    expect(result.endPoint).toEqual(tDVV_Mainnet.CHAIN_INFO.rpcUrl);
    expect(result.exploreUrl).toEqual(tDVV_Mainnet.CHAIN_INFO.exploreUrl);
    expect(result.contractAddress.CA_CONTRACT).toEqual(tDVV_Mainnet.CA_CONTRACT_V2);
    expect(result.contractAddress.TOKEN_CONTRACT).toEqual(tDVV_Mainnet.TOKEN_CONTRACT);
    expect(result.contractAddress.ETRANSFER).toEqual(tDVV_Mainnet.ETRANSFER_CONTRACT);
  });

  it('should return correct values for AELF testnet', () => {
    const mockChainId = 'AELF';
    const mockNetworkType = 'TESTNET';

    (getNetworkType as jest.Mock).mockReturnValue(mockNetworkType);
    // Mocking functions similar to the mainnet as needed

    const result = getAelfReact(mockNetworkType, mockChainId);

    expect(result.endPoint).toEqual(AELF_Testnet.CHAIN_INFO.rpcUrl);
    expect(result.exploreUrl).toEqual(AELF_Testnet.CHAIN_INFO.exploreUrl);
    expect(result.contractAddress.CA_CONTRACT).toEqual(AELF_Testnet.CA_CONTRACT_V2);
    expect(result.contractAddress.TOKEN_CONTRACT).toEqual(AELF_Testnet.TOKEN_CONTRACT);
    expect(result.contractAddress.ETRANSFER).toEqual(AELF_Testnet.ETRANSFER_CONTRACT);
  });

  it('should return correct values for tDVW testnet', () => {
    const mockChainId = 'tDVW';
    const mockNetworkType = 'TESTNET';

    (getNetworkType as jest.Mock).mockReturnValue(mockNetworkType);
    // Mocking functions similar to the mainnet as needed

    const result = getAelfReact(mockNetworkType, mockChainId);

    expect(result.endPoint).toEqual(tDVW_Mainnet.CHAIN_INFO.rpcUrl);
    expect(result.exploreUrl).toEqual(tDVW_Mainnet.CHAIN_INFO.exploreUrl);
    expect(result.contractAddress.CA_CONTRACT).toEqual(tDVW_Mainnet.CA_CONTRACT_V2);
    expect(result.contractAddress.TOKEN_CONTRACT).toEqual(tDVW_Mainnet.TOKEN_CONTRACT);
    expect(result.contractAddress.ETRANSFER).toEqual(tDVW_Mainnet.ETRANSFER_CONTRACT);
  });
});

describe('getBalanceDivDecimals', () => {
  const endPoint = 'http://localhost';
  const tokenContractAddress = 'mockTokenContractAddress';
  const symbol = 'ELF';
  const decimals = 2;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty string if accountAddress is empty string', async () => {
    const accountAddress = '';

    const result = await getBalanceDivDecimals(endPoint, tokenContractAddress, accountAddress, symbol, decimals);

    expect(result).toBe('');
  });

  it('should return formatted balance after dividing decimals', async () => {
    const mockTokenContract = {};
    const accountAddress = 'mockAccountAddress';

    (getTokenContract as jest.Mock).mockResolvedValue(mockTokenContract as never);
    (getBalance as jest.Mock).mockResolvedValue(new BigNumber(105) as never);
    (divDecimals as jest.Mock).mockImplementation(() => new BigNumber(100));

    const result = await getBalanceDivDecimals(endPoint, tokenContractAddress, accountAddress, symbol, decimals);

    // Assuming BigNumber is converted to a string format
    expect(result).toBe('100');
    // Verify the contract call
    expect(getTokenContract).toHaveBeenCalledWith(endPoint, tokenContractAddress);
    // Verify the balance call
    expect(getBalance).toHaveBeenCalledWith(mockTokenContract, symbol, accountAddress);
  });

  it('should handle error gracefully', async () => {
    const accountAddress = 'mockAccountAddress';

    // Simulate token contract error
    (getTokenContract as jest.Mock).mockRejectedValue(undefined as never);

    // Assuming your function logic throws this error
    await expect(
      getBalanceDivDecimals(endPoint, tokenContractAddress, accountAddress, symbol, decimals),
    ).rejects.toThrow('Failed to get balance.');
  });
});

describe('getBalanceDivDecimalsAdapt', () => {
  it('should adapt to correct balance representation', async () => {
    // Setup and Mock expected
    const mockTokenContract = {};
    const chainId = 'AELF';
    const mockAddress = 'mockAccountAddress';
    const mockSymbol = 'ELF';
    const mockDecimals = 2;

    (getTokenContract as jest.Mock).mockResolvedValue(mockTokenContract as never);
    (getBalance as jest.Mock).mockResolvedValue(new BigNumber(105) as never);
    (divDecimals as jest.Mock).mockImplementation(() => new BigNumber(100));

    const result = await getBalanceDivDecimalsAdapt(chainId, mockAddress, mockSymbol, mockDecimals);

    // Ensure it returns the correct adapted value
    expect(result).toBe('100');
  });
});
