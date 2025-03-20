import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { IStorageSuite, TETransferJWTData } from '@etransfer/types';
import { getETransferJWT, resetETransferJWT, setETransferJWT } from '../../src/storage';
import { Day, LocalStorageKey } from '../../src/constants';

describe('ETransfer JWT Storage Functions', () => {
  let storage: IStorageSuite;

  beforeEach(() => {
    storage = {
      getItem: jest.fn() as any, // jest.fn() as jest.MockedFunction<IStorageSuite['getItem']>,
      setItem: jest.fn() as jest.MockedFunction<IStorageSuite['setItem']>,
      removeItem: jest.fn() as jest.MockedFunction<IStorageSuite['removeItem']>,
    };
  });

  const key = 'test_key';
  const expires_in = 60;
  const currentTime = Date.now();
  const jwtData: TETransferJWTData = {
    token_type: 'Bearer',
    access_token: 'access_token',
    expires_in: expires_in,
  };

  describe('getETransferJWT', () => {
    it('should return JWT data if token is valid and not expired', async () => {
      const itemValue = JSON.stringify({
        [key]: { ...jwtData, expiresTime: currentTime + expires_in * Day },
      });

      await (storage.getItem as any).mockReturnValue(itemValue);
      const result = await getETransferJWT(storage, key);

      expect(result).toEqual(JSON.parse(itemValue)[key]);
    });

    it('should return undefined if token is expired', async () => {
      const itemValue = JSON.stringify({ [key]: { ...jwtData, expiresTime: currentTime - 1000 } });

      await (storage.getItem as any).mockResolvedValueOnce(itemValue);
      const result = await getETransferJWT(storage, key);

      expect(result).toBeUndefined();
    });

    it('should return undefined if item does not exist', async () => {
      await (storage.getItem as any).mockResolvedValueOnce(null);
      const result = await getETransferJWT(storage, key);

      expect(result).toBeUndefined();
    });

    it('should return undefined if there is an error while parsing', async () => {
      await (storage.getItem as any).mockResolvedValueOnce('invalid_json');
      const result = await getETransferJWT(storage, key);

      expect(result).toBeUndefined();
    });

    it('should return undefined if there is no expiresTime', async () => {
      const itemValue = JSON.stringify({ [key]: { ...jwtData } });
      await (storage.getItem as any).mockResolvedValueOnce(itemValue);
      const result = await getETransferJWT(storage, key);

      expect(result).toBeUndefined();
    });
  });

  describe('resetETransferJWT', () => {
    it('should call removeItem on storage', () => {
      resetETransferJWT(storage);
      expect(storage.removeItem).toHaveBeenCalledWith(LocalStorageKey.ETRANSFER_ACCESS_TOKEN);
    });
  });

  describe('setETransferJWT', () => {
    it('should set item to storage with correct data', async () => {
      setETransferJWT(storage, key, jwtData);

      expect(storage.setItem).toHaveBeenCalled();
    });
  });
});
