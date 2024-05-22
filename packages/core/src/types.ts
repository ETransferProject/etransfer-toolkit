import { Services, TGetAuthRequest } from '@etransfer/services';
import { PortkeyVersion } from '@etransfer/types';

export type TETransferCore = {
  services: Services;
  baseHost?: string;
  authHost?: string;
  init(options: TETransferCoreInitParams): void;
  setBaseHost(host?: string): void;
  setAuthHost(host?: string): void;
  getAuth(params: TGetAuthParams): Promise<string>;
  getAuthApi(params: TGetAuthRequest): Promise<string>;
  sendWithdrawOrder(params: any): Promise<{ orderId: string }>;
};

export type TETransferCoreInitParams = { etransferHost: string; etransferAuthHost: string };

export type TETransferCoreOptions = Partial<TETransferCoreInitParams>;

export type TGetAuthParams = {
  pubkey: string;
  signature: string;
  plainText: string;
  caHash: string;
  chainId: string;
  managerAddress: string;
  version: PortkeyVersion;
};
