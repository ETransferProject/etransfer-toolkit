import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getAelfExploreLink, getOtherExploreLink, openWithBlank, viewTxDetailInExplore } from '../../src/utils/common';
import { getNetworkType } from '../../src/utils/login';
import { AelfExploreType, BlockchainNetworkType, OtherExploreType } from '../../src/constants/network';
import { getAelfReact } from '../../src/utils/contract';

jest.mock('../../src/utils/login', () => ({
  getNetworkType: jest.fn(),
}));

jest.mock('../../src/utils/contract', () => ({
  getAelfReact: jest.fn(),
}));

describe('getAelfExploreLink', () => {
  const mockChainId = 'AELF';
  const mockData = 'mockData';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if exploreUrl is not configured', () => {
    (getNetworkType as jest.Mock).mockReturnValue('mainnet'); // Mock network type
    (getAelfReact as jest.Mock).mockReturnValue({ exploreUrl: undefined }); // Mock an undefined exploreUrl

    expect(() => getAelfExploreLink(mockData, AelfExploreType.transaction, mockChainId)).toThrow(
      `Please config ${mockChainId}'s exploreUrl`,
    );
  });

  it('should return the correct transaction link', () => {
    (getNetworkType as jest.Mock).mockReturnValue('mainnet');
    (getAelfReact as jest.Mock).mockReturnValue({ exploreUrl: 'https://testnet.aelfscan.io/' }); // Mock exploreUrl

    const result = getAelfExploreLink(mockData, AelfExploreType.transaction, mockChainId);

    expect(result).toBe('https://testnet.aelfscan.io/tx/mockData'); // Check the result
  });

  it('should return the correct token link', () => {
    (getNetworkType as jest.Mock).mockReturnValue('mainnet');
    (getAelfReact as jest.Mock).mockReturnValue({ exploreUrl: 'https://testnet.aelfscan.io/' });

    const result = getAelfExploreLink(mockData, AelfExploreType.token, mockChainId);

    expect(result).toBe('https://testnet.aelfscan.io/token/mockData'); // Check the result
  });

  it('should return the correct block link', () => {
    (getNetworkType as jest.Mock).mockReturnValue('mainnet');
    (getAelfReact as jest.Mock).mockReturnValue({ exploreUrl: 'https://testnet.aelfscan.io/' });

    const result = getAelfExploreLink(mockData, AelfExploreType.block, mockChainId);

    expect(result).toBe('https://testnet.aelfscan.io/block/mockData'); // Check the result
  });

  it('should return the correct address link when type is address or default', () => {
    (getNetworkType as jest.Mock).mockReturnValue('mainnet');
    (getAelfReact as jest.Mock).mockReturnValue({ exploreUrl: 'https://testnet.aelfscan.io/' });

    let result = getAelfExploreLink(mockData, AelfExploreType.address, mockChainId);
    expect(result).toBe('https://testnet.aelfscan.io/address/mockData'); // Check the result

    result = getAelfExploreLink(mockData, undefined as any, mockChainId); // Test default case (undefined)
    expect(result).toBe('https://testnet.aelfscan.io/address/mockData'); // Check the result
  });
});

describe('getOtherExploreLink', () => {
  const mockData = 'mockData';
  const mockNetworkUrls = {
    ETH: 'https://etherscan.io',
    TRX: 'https://tronscan.io',
    BSC: 'https://bscscan.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct transaction link for ETH', () => {
    const result = getOtherExploreLink(mockData, OtherExploreType.transaction, 'ETH');
    expect(result).toBe(`${mockNetworkUrls.ETH}/tx/${mockData}`);
  });

  it('should return correct transaction link for TRX', () => {
    const result = getOtherExploreLink(mockData, OtherExploreType.transaction, 'TRX');
    expect(result).toBe(`${mockNetworkUrls.TRX}/#/transaction/${mockData}`);
  });

  it('should return correct address link for ETH', () => {
    const result = getOtherExploreLink(mockData, OtherExploreType.address, 'ETH');
    expect(result).toBe(`${mockNetworkUrls.ETH}/address/${mockData}`);
  });

  it('should return correct address link for TRX', () => {
    const result = getOtherExploreLink(mockData, OtherExploreType.address, 'TRX');
    expect(result).toBe(`${mockNetworkUrls.TRX}/#/address/${mockData}`);
  });

  it('should return correct address link when type is default', () => {
    const result = getOtherExploreLink(mockData, undefined as any, 'BSC'); // Testing default case
    expect(result).toBe(`${mockNetworkUrls.BSC}/address/${mockData}`);
  });
});

describe('openWithBlank', () => {
  it('should open a new window with the given URL', () => {
    const url = 'http://example.com';
    const mockWindow = { opener: {}, close: jest.fn() };
    (window as any).open = jest.fn().mockReturnValue(mockWindow);

    openWithBlank(url);

    expect(window.open).toHaveBeenCalledWith(url, '_blank');
    expect(mockWindow.opener).toBeNull(); // Ensure opener is set to null
  });
});

describe('viewTxDetailInExplore', () => {
  it('should open URL with Cobo hash', () => {
    const mockWindow = { opener: {}, close: jest.fn() };
    (window as any).open = jest.fn().mockReturnValue(mockWindow);

    const txHash = 'mockTxHash';
    const isCoboHash = true;

    viewTxDetailInExplore('ETH', txHash, isCoboHash);
  });

  it('should open AELF explore link when network is AELF and chainId is provided', () => {
    const txHash = 'mockTxHash';
    const isCoboHash = false;
    const chainId = 'AELF';

    viewTxDetailInExplore(BlockchainNetworkType.AELF, txHash, isCoboHash, chainId);
  });

  it('should open Other Explore link for other networks', () => {
    const txHash = 'mockTxHash';
    const isCoboHash = false;

    viewTxDetailInExplore('someOtherNetwork', txHash, isCoboHash);
  });
});
