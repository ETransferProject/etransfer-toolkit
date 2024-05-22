import { Services } from '@etransfer/services';
import { TETransferCore, TETransferCoreInitParams, TETransferCoreOptions } from './types';

export class ETransferCore implements TETransferCore {
  public services: Services;

  constructor({ etransferUrl }: TETransferCoreOptions) {
    this.services = new Services();

    this.init({ etransferUrl });
  }

  init({ etransferUrl }: TETransferCoreInitParams) {
    this.services.setRequestConfig('baseURL', etransferUrl);
  }

  async login(params: any) {
    console.log('query auth token and finish login', params);
  }

  async sendWithdrawOrder(params: any) {
    console.log('check allowance, approve, transfer, createOrder ... ', params);
    return { orderId: '' };
  }
}
