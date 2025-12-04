import { Services } from '@etransfer/services';
import {
  AuthTokenSource,
  TGetAuthRequest,
  TCreateWithdrawOrderResult,
  PortkeyVersion,
  TWalletType,
} from '@etransfer/types';
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
  getReCaptcha(walletAddress: string, reCaptchaUrl?: string): Promise<string | undefined>;
  getAuthTokenFromApi(params: TGetAuthRequest): Promise<string>;
  getAuthTokenFromStorage(params: TGetAuthFromStorageParams): Promise<string | undefined>;
  handleApproveToken(params: THandleApproveTokenParams): Promise<boolean>;
  sendWithdrawOrder(params: TSendWithdrawOrderParams): Promise<TCreateWithdrawOrderResult>;
  createWithdrawOrder(params: TCreateWithdrawOrderParams): Promise<TCreateWithdrawOrderResult>;
};

export type TETransferCoreInitParams = {
  etransferUrl: string;
  etransferAuthUrl: string;
  etransferSocketUrl?: string;
  storage?: IStorageSuite;
  version: string;
};

export type TETransferCoreOptions = Partial<TETransferCoreInitParams>;

export type TGetAuthParams = {
  pubkey: string;
  signature: string;
  plainText: string;
  managerAddress: string;
  version: PortkeyVersion;
  source?: AuthTokenSource;
  caHash?: string; // for Portkey
  chainId?: string; // for Portkey
  recaptchaToken?: string; // for NightElf
};

export type TGetAuthFromStorageParams = {
  walletType: TWalletType;
  managerAddress: string;
  caHash?: string;
};

export type TSendWithdrawOrderParams = THandleApproveTokenParams & {
  toAddress: string;
  caContractAddress: string;
  network: string;
  chainId: ChainId;
  managerAddress: string;
  walletType?: TWalletType;
  caHash?: string;
  getSignature: TGetSignatureFunc;
};

export type THandleApproveTokenParams = TTokenContractCallSendMethod & {
  tokenContractAddress: string;
  endPoint: string;
  symbol: string;
  decimals: string | number;
  amount: string;
  accountAddress: string;
  memo?: string;
  eTransferContractAddress: string;
};

export type TCreateWithdrawOrderParams = {
  chainId: ChainId;
  symbol: string;
  network: string;
  toAddress: string;
  memo?: string;
  amount: string;
  rawTransaction: string;
};
