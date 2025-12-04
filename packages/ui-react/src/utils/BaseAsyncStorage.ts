import { IStorageSuite } from '@etransfer/types';

export class BaseAsyncStorage implements IStorageSuite {
  public async getItem(key: string) {
    if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
    return null;
  }
  public async setItem(key: string, value: string) {
    if (typeof localStorage !== 'undefined') return localStorage.setItem(key, value);
    return null;
  }
  public async removeItem(key: string) {
    if (typeof localStorage !== 'undefined') return localStorage.removeItem(key);
    return null;
  }
}
