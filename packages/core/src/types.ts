import { Services, TGetAuthRequest } from '@etransfer/services';
import { PortkeyVersion } from '@etransfer/types';
import { TGetSignatureFunc, TTokenContract } from '@etransfer/utils';
import { ChainId } from '@portkey/types';

export type TETransferCore = {
  services: Services;
  baseHost?: string;
  authHost?: string;
  init(options: TETransferCoreInitParams): void;
  setBaseHost(host?: string): void;
  setAuthHost(host?: string): void;
  getAuth(params: TGetAuthParams): Promise<string>;
  getAuthApi(params: TGetAuthRequest): Promise<string>;
  sendWithdrawOrder(params: TSendWithdrawOrderParams): Promise<{ orderId: string }>;
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

export type TSendWithdrawOrderParams = THandleApproveTokenParams & {
  address: string;
  caContractAddress: string;
  caHash: string;
  network: string;
  chainId: ChainId;
  decimals: string | number;
  userManagerAddress: string;
  getSignature: TGetSignatureFunc;
};

export type THandleApproveTokenParams = {
  tokenContract: TTokenContract;
  tokenContractAddress: string;
  endPoint: string;
  symbol: string;
  amount: string;
  userAccountAddress: string;
  eTransferContractAddress: string;
};
