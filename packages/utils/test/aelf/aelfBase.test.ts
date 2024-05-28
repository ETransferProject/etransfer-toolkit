import { describe, expect, test } from '@jest/globals';
import {
  getAElf,
  getRawTx,
  getTxResult,
  isDIDAddress,
  isDIDAddressSuffix,
  recoverManagerAddressByPubkey,
  recoverPubKeyBySignature,
  removeAddressSuffix,
  removeDIDAddressSuffix,
} from '../../src/aelf/aelfBase';

const plainText = '4e6f6e63653a31373136333538353032393233';
const signature =
  '05d641d117822f42f25278d8893f3a1ba9a36c32590080f84fe1d1095712819d223c3b3fa0c1de8f62b9b6ac89992c7e2f09678ad01eef1e97b0f21d6c6bd49c01';
const pubkey =
  '04671bfc20edb4cdc171bd7d20877aa64862e88dc9f52173673db9789e0dea71aca45472fd4841cad362cae8b5b6f05c55a350014f7917fe90870fd680c845edae';
const managerAddress = '7iC6EQtt4rKsqv9vFiwpUDvZVipSoKwvPLy7pRG189qJjyVT7';

describe('getAElf', () => {
  test('get aelf testnet instance', () => {
    const aelf = getAElf('https://explorer-test.aelf.io');
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

describe('getTxResult', () => {
  test('Correct input, correct output.', async () => {
    const result = await getTxResult(
      '8c699aae815722d28fdcd01931276b72a5d87b38f59320a3181fe563853e7d3b',
      'https://tdvw-test-node.aelf.io',
    );
    expect(result).toBeTruthy();
  });
  test('Error TransactionId, error output.', async () => {
    try {
      await getTxResult('8c69', 'https://tdvw-test-node.aelf.io');
    } catch (error) {
      expect(error.TransactionId).toBe('8c69');
    }
  });
});

describe('isDIDAddress', () => {
  test('Input DID address, and return true.', () => {
    const result = isDIDAddress('ELF_Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft_AELF');
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
    const result = isDIDAddressSuffix('ELF_Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft_AELF');
    expect(result).toBeTruthy();
  });
  test('Input undefined, and return true.', () => {
    const result = isDIDAddressSuffix();
    expect(result).toBeFalsy();
  });
});

describe('removeAddressSuffix', () => {
  test('Input DID address, and return address without prefix and suffix.', () => {
    const result = removeAddressSuffix('ELF_Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft_AELF');
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
    const result = removeDIDAddressSuffix('ELF_Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft_AELF');
    expect(result).toBe('Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft');
  });

  test('Input not DID address, and return entered address.', () => {
    const result = removeDIDAddressSuffix('4hy6evPF8Cvft_AELF');
    expect(result).toBe('4hy6evPF8Cvft_AELF');
  });
});
