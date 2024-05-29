import { eTransferCore as _eTransferCore } from '@etransfer/core';
import { IStorageSuite } from '@portkey/types';

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

eTransferCore.init({
  // etransferUrl: ETRANSFER_URL,
  // etransferAuthUrl: ETRANSFER_AUTH_URL,
  storage: new Store(),
});
