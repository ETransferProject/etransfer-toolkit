import { AxiosResponse } from 'axios';
import { TRequestConfig } from '@etransfer/request';
import { ChainId } from '@portkey/types';
import { BusinessType, PortkeyVersion } from '@etransfer/types';

export type TRequestFunction = (config?: TRequestConfig) => Promise<any | AxiosResponse<any>>;

export type TServices = {
  getAuthToken(params: TGetAuthRequest): Promise<TGetAuthResult>;
  getTokenList(params: TGetTokenListRequest): Promise<TGetTokenListResult>;
  getTokenOption(params: TGetTokenOptionRequest): Promise<TGetTokenOptionResult>;
  getNetworkList(params: TGetNetworkListRequest): Promise<TGetNetworkListResult>;
  getDepositInfo(params: TGetDepositInfoRequest): Promise<TGetDepositInfoResult>;
  getDepositCalculate(params: TGetDepositCalculateRequest): Promise<TGetDepositCalculateResult>;
  getWithdrawInfo(params: TGetWithdrawInfoRequest): Promise<TGetWithdrawInfoResult>;
  createWithdrawOrder(params: TCreateWithdrawOrderRequest): Promise<TCreateWithdrawOrderResult>;
  createWithdrawOrder(params: TCreateWithdrawOrderRequest): Promise<TCreateWithdrawOrderResult>;
  getRecordStatus(): Promise<TGetRecordStatusResult>;
};

export type TAuthApiBaseParams = {
  grant_type: string;
  scope: string;
  client_id: string;
  source: string;
};

export type TGetAuthRequest = {
  pubkey: string;
  signature: string;
  plain_text: string;
  ca_hash: string;
  chain_id: string;
  managerAddress: string;
  version: PortkeyVersion;
};

export type TGetAuthResult = {
  token_type: string;
  access_token: string;
  expires_in: number;
};

export type TGetTokenListRequest = {
  type: BusinessType;
  chainId: ChainId;
};

export type TGetTokenListResult = {
  tokenList: TTokenItem[];
};

export type TTokenItem = {
  name: string;
  symbol: string;
  icon: string;
  contractAddress: string;
  decimals: number;
};

export type TGetNetworkListRequest = {
  type: BusinessType;
  chainId: ChainId;
  symbol?: string;
  address?: string;
};

export type TGetNetworkListResult = {
  networkList: TNetworkItem[];
};

export type TNetworkItem = {
  network: string;
  name: string;
  multiConfirm: string;
  multiConfirmTime: string;
  contractAddress: string;
  explorerUrl: string;
  status: NetworkStatus;
  withdrawFee?: string;
  withdrawFeeUnit?: string;
};

export enum NetworkStatus {
  Health = 'Health',
  Congesting = 'Congesting',
  Offline = 'Offline',
}

export type TGetTokenOptionRequest = {
  type: BusinessType;
};

export type TGetTokenOptionResult = {
  tokenList: TTokenOptionItem[];
};

export type TTokenOptionItem = TTokenItem & {
  toTokenList?: TToTokenItem[];
};

export type TToTokenItem = TTokenItem & {
  chainIdList?: ChainId[];
};

export type TGetDepositInfoRequest = {
  chainId: ChainId;
  network: string;
  symbol?: string;
  toSymbol?: string;
};

export type TGetDepositInfoResult = {
  depositInfo: TDepositInfo;
};

export type TDepositInfo = {
  depositAddress: string;
  minAmount: string;
  extraNotes?: string[];
  minAmountUsd: string;
  extraInfo?: TDepositExtraInfo;
};

export type TDepositExtraInfo = {
  slippage: string;
};

export type TGetDepositCalculateRequest = {
  toChainId: ChainId;
  fromSymbol: string;
  toSymbol: string;
  fromAmount: string;
};

export type TGetDepositCalculateResult = {
  conversionRate: TConversionRate;
};

export type TConversionRate = {
  fromSymbol: string;
  toSymbol: string;
  fromAmount: string;
  toAmount: string;
  minimumReceiveAmount: string;
};

export type TGetWithdrawInfoRequest = {
  chainId: ChainId;
  network?: string;
  symbol?: string;
  amount?: string;
  address?: string;
  version?: PortkeyVersion;
};

export type TGetWithdrawInfoResult = {
  withdrawInfo: TWithdrawInfo;
};

export type TWithdrawInfo = {
  maxAmount: string;
  minAmount: string;
  limitCurrency: string;
  totalLimit: string;
  remainingLimit: string;
  transactionFee: string;
  transactionUnit: string;
  expiredTimestamp: number;
  aelfTransactionFee: string;
  aelfTransactionUnit: string;
  receiveAmount: string;
  feeList: TFeeItem[];
  receiveAmountUsd: string;
  amountUsd: string;
  feeUsd: string;
};

export type TFeeItem = {
  name: string;
  currency: string;
  amount: string;
};

export type TFeeInfoItem = {
  amount: string;
  unit: string;
};

export type TCreateWithdrawOrderRequest = {
  network: string;
  symbol: string;
  amount: string;
  fromChainId: ChainId;
  toAddress: string;
  rawTransaction: string;
};

export type TCreateWithdrawOrderResult = {
  orderId: string;
  transactionId: string;
};

export interface TGetRecordsListRequest {
  type: number;
  status: number;
  startTimestamp?: number | null;
  endTimestamp?: number | null;
  skipCount: number;
  maxResultCount: number;
  search?: string | undefined;
}

export type TGetRecordsListResult = {
  totalCount: number;
  items: TRecordsListItem[];
};

export type TRecordsListItem = {
  id: string;
  orderType: string;
  status: string;
  arrivalTime: number;
  fromTransfer: TFromTransfer;
  toTransfer: TToTransfer;
};

export type TFromTransfer = {
  network: string;
  chainId: ChainId;
  fromAddress: string;
  toAddress: string;
  amount: string;
  symbol: string;
};

export type TToTransfer = {
  network: string;
  chainId: ChainId;
  fromAddress: string;
  toAddress: string;
  amount: string;
  symbol: string;
  feeInfo: TToTransferFeeInfo[];
};

export type TToTransferFeeInfo = {
  symbol: string;
  amount: string;
};

export type TGetRecordStatusResult = {
  status: boolean;
};
