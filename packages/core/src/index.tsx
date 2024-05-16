import { Services } from '@etransfer/services';
import { TETransferCore } from './types';

export class ETransferCore implements TETransferCore {
  public services: Services;

  constructor() {
    this.services = new Services();
  }

  async login(params: any) {
    console.log('query auth token and finish login', params);
  }

  async sendWithdrawOrder(params: any) {
    console.log('check allowance, approve, transfer, createOrder ... ', params);
    return { orderId: '' };
  }
}
