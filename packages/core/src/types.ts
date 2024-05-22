import { Services } from '@etransfer/services';

export type TETransferCore = {
  services: Services;
  login(params: any): Promise<any>;
  sendWithdrawOrder(params: any): Promise<{ orderId: string }>;
};

export type TETransferCoreInitParams = { etransferUrl: string };

export type TETransferCoreOptions = TETransferCoreInitParams;
