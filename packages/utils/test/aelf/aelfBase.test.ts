import { describe, expect, test } from '@jest/globals';
import {
  formatDIDAddress,
  getAElf,
  getRawTx,
  isDIDAddress,
  isDIDAddressSuffix,
  isELFAddress,
  recoverManagerAddressByPubkey,
  recoverPubKeyBySignature,
  removeAddressSuffix,
  removeDIDAddressSuffix,
  removeELFAddressSuffix,
} from '../../src/aelf/aelfBase';

const plainText = '4e6f6e63653a31373136333538353032393233';
const signature =
  '05d641d117822f42f25278d8893f3a1ba9a36c32590080f84fe1d1095712819d223c3b3fa0c1de8f62b9b6ac89992c7e2f09678ad01eef1e97b0f21d6c6bd49c01';
const pubkey =
  '04671bfc20edb4cdc171bd7d20877aa64862e88dc9f52173673db9789e0dea71aca45472fd4841cad362cae8b5b6f05c55a350014f7917fe90870fd680c845edae';
const managerAddress = '7iC6EQtt4rKsqv9vFiwpUDvZVipSoKwvPLy7pRG189qJjyVT7';
const correctAelfAddress = 'ELF_Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft_AELF';
const evmAddress = '0x60eeCc4d19f65B9EaDe628F2711C543eD1cE6679';

describe('getAElf', () => {
  test('get aelf testnet instance', () => {
    const aelf = getAElf('https://testnet.aelfscan.io/AELF');
    expect(aelf).toHaveProperty('chain');
  });
});

describe('recoverPubKeyBySignature', () => {
  test('recover pubkey by signature', () => {
    const result = recoverPubKeyBySignature(plainText, signature) + '';
    expect(result).toBe(pubkey);
  });
});

describe('recoverManagerAddressByPubkey', () => {
  test('recover manager address by pubkey', () => {
    const result = recoverManagerAddressByPubkey(pubkey);
    expect(result).toBe(managerAddress);
  });
});

describe('getRawTx', () => {
  test('Input blockHashInput is not start with 0x.', () => {
    const result = getRawTx({
      blockHeightInput: '120594862',
      blockHashInput: 'b093de3b6a52fefb691228922b18f9c300fd2ed7f3838d10f6c5024c289bc7a5',
      packedInput:
        '0a220a20ba5f748422c4d882b664077f7bbdacbf5b2ce18da880cd4e6946a2eb2267dffd12220a2099ad42e68447aa3cab9b31e85531d09d5cdf5d5b8bb60e6b30941d78d32d09b91a0d5472616e73666572546f6b656e220a0a03454c4610c0e2b069',
      address: 'V922RLhmJsmGHCW6zPDR7czgNYfihnAe175somxFdqXKKjweP',
      contractAddress: '238X6iw1j8YKcHvkDYVtYVbuYk2gJnK8UoNpVCtssynSpVC8hb',
      functionName: 'ManagerForwardCall',
    });
    expect(result).toBeTruthy();
  });

  test('Input blockHashInput is start with 0x.', () => {
    const result = getRawTx({
      blockHeightInput: '120594862',
      blockHashInput: '0xb093de3b6a52fefb691228922b18f9c300fd2ed7f3838d10f6c5024c289bc7a5',
      packedInput:
        '0a220a20ba5f748422c4d882b664077f7bbdacbf5b2ce18da880cd4e6946a2eb2267dffd12220a2099ad42e68447aa3cab9b31e85531d09d5cdf5d5b8bb60e6b30941d78d32d09b91a0d5472616e73666572546f6b656e220a0a03454c4610c0e2b069',
      address: 'V922RLhmJsmGHCW6zPDR7czgNYfihnAe175somxFdqXKKjweP',
      contractAddress: '238X6iw1j8YKcHvkDYVtYVbuYk2gJnK8UoNpVCtssynSpVC8hb',
      functionName: 'ManagerForwardCall',
    });
    expect(result).toBeTruthy();
  });
});

describe('isDIDAddress', () => {
  test('Input DID address, and return true.', () => {
    const result = isDIDAddress(correctAelfAddress);
    expect(result).toBeTruthy();
  });
  test('Input not DID address, and return false.', () => {
    const result = isDIDAddress('Py2TJpjTtt29z');
    expect(result).toBeFalsy();
  });
  test('Input undefined, and return false.', () => {
    const result = isDIDAddress();
    expect(result).toBeFalsy();
  });
});

describe('isDIDAddressSuffix', () => {
  test('Input DID address, and return true.', () => {
    const result = isDIDAddressSuffix(correctAelfAddress);
    expect(result).toBeTruthy();
  });

  test('Input undefined, and return false.', () => {
    const result = isDIDAddressSuffix();
    expect(result).toBeFalsy();
  });

  test('Input evm address, and return false.', () => {
    const result = isDIDAddressSuffix(evmAddress);
    expect(result).toBeFalsy();
  });
});

describe('removeAddressSuffix', () => {
  test('Input DID address, and return address without prefix and suffix.', () => {
    const result = removeAddressSuffix(correctAelfAddress);
    expect(result).toBe('Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft');
  });
  test('Input not DID address, and return address without prefix and suffix.', () => {
    const result = removeAddressSuffix('ab_Py2TJpjTtt29zA_cd');
    expect(result).toBe('Py2TJpjTtt29zA');
  });
  test('Input not DID address, and return entered address.', () => {
    const result = removeAddressSuffix('ab_Py2TJpjTtt29zA');
    expect(result).toBe('ab_Py2TJpjTtt29zA');
  });
});

describe('removeDIDAddressSuffix', () => {
  test('Input DID address, and return address without prefix and suffix.', () => {
    const result = removeDIDAddressSuffix(correctAelfAddress);
    expect(result).toBe('Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft');
  });

  test('Input not DID address, and return entered address.', () => {
    const result = removeDIDAddressSuffix('4hy6evPF8Cvft_AELF');
    expect(result).toBe('4hy6evPF8Cvft_AELF');
  });
});

describe('isELFAddress', () => {
  test('should return false for addresses containing Chinese characters', () => {
    expect(isELFAddress('invalid漢')).toBe(false);
  });

  test('should return true for valid ELF addresses', () => {
    expect(isELFAddress(correctAelfAddress)).toBe(true);
  });

  test('should return false for invalid ELF addresses', () => {
    expect(isELFAddress('invalidELFAddress')).toBe(false);
  });
});

describe('removeELFAddressSuffix', () => {
  test('should remove suffix from valid ELF address', () => {
    const address = correctAelfAddress;

    expect(removeELFAddressSuffix(address)).toBe('Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft');
  });

  test('should return the same address if it is not an ELF address', () => {
    const address = 'invalidAddress';
    const result = removeELFAddressSuffix(address);
    expect(result).toBe(address);
  });
});

describe('formatDIDAddress', () => {
  const chainId = 'AELF';
  test('should format DID address for aelf chain type', () => {
    const address = 'addressPart';
    const formattedAddress = formatDIDAddress(address, chainId, 'aelf');
    expect(formattedAddress).toBe(`ELF_${address}_${chainId}`);
  });

  test('should return original address if chain type is not aelf', () => {
    const address = 'exampleAddress';
    const result = formatDIDAddress(address, chainId, 'ethereum');
    expect(result).toBe(address);
  });

  test('should return original address if it contains "_" and is less than 3 parts', () => {
    const result = formatDIDAddress('ELF_part1_part2', chainId, 'aelf');
    expect(result).toBe('ELF_part1_AELF');
  });

  test('should return original address if address does not contain "_"', () => {
    const address = 'ELF_address';
    const formattedAddress = formatDIDAddress(address, chainId, 'aelf');
    expect(formattedAddress).toBe(address);
  });

  test('should return original address if no chainId and chainType', () => {
    const address = 'ELF_address';
    const formattedAddress = formatDIDAddress(address);
    expect(formattedAddress).toBe(address);
  });
});
