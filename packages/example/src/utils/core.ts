import { ETRANSFER_AUTH_URL, ETRANSFER_URL } from '@/constants';
import { eTransferCore as _eTransferCore } from '@etransfer/core';
import { IStorageSuite } from '@etransfer/types';

class Store implements IStorageSuite {
  async getItem(key: string) {
    return localStorage.getItem(key);
  }
  async setItem(key: string, value: string) {
    return localStorage.setItem(key, value);
  }
  async removeItem(key: string) {
    return localStorage.removeItem(key);
  }
}

export const eTransferCore = _eTransferCore;

// used for Core-SDK
eTransferCore.init({
  etransferUrl: ETRANSFER_URL,
  etransferAuthUrl: ETRANSFER_AUTH_URL,
  etransferSocketUrl: ETRANSFER_URL,
  storage: new Store(),
});
