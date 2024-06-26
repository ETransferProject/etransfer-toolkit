import { Services } from '@etransfer/services';
import { TGetAuthRequest, TCreateWithdrawOrderResult, PortkeyVersion } from '@etransfer/types';
import { TTokenContractCallSendMethod } from '@etransfer/utils';
import { TGetSignatureFunc } from '@etransfer/utils';
import { ChainId, IStorageSuite } from '@portkey/types';

export type TETransferCore = {
  services: Services;
  baseUrl?: string;
  authUrl?: string;
  init(options: TETransferCoreInitParams): void;
  setBaseUrl(url?: string): void;
  setAuthUrl(url?: string): void;
  getAuthToken(params: TGetAuthParams): Promise<string>;
  getAuthTokenFromApi(params: TGetAuthRequest): Promise<string>;
  handleApproveToken(params: THandleApproveTokenParams): Promise<boolean>;
  sendWithdrawOrder(params: TSendWithdrawOrderParams): Promise<TCreateWithdrawOrderResult>;
  createWithdrawOrder(params: TCreateWithdrawOrderParams): Promise<TCreateWithdrawOrderResult>;
};

export type TETransferCoreInitParams = { etransferUrl: string; etransferAuthUrl: string; storage?: IStorageSuite };

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
  toAddress: string;
  caContractAddress: string;
  caHash: string;
  network: string;
  chainId: ChainId;
  managerAddress: string;
  getSignature: TGetSignatureFunc;
};

export type THandleApproveTokenParams = TTokenContractCallSendMethod & {
  tokenContractAddress: string;
  endPoint: string;
  symbol: string;
  decimals: string | number;
  amount: string;
  accountAddress: string;
  eTransferContractAddress: string;
};

export type TCreateWithdrawOrderParams = {
  chainId: ChainId;
  symbol: string;
  network: string;
  toAddress: string;
  amount: string;
  rawTransaction: string;
};
