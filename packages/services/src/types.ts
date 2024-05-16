import { AxiosResponse } from 'axios';
import { API_LIST } from './constants';
import { TRequestConfig } from '@etransfer/request';
import { ChainId } from '@portkey/types';

export type TRequestFunction = (config?: TRequestConfig) => Promise<any | AxiosResponse<any>>;

export type TApiUrlList = {
  [X in keyof typeof API_LIST]: {
    [K in keyof (typeof API_LIST)[X]]: TRequestFunction;
  };
};

export type TServices = {
  getTokenList(params: TGetTokenListRequest): Promise<TGetTokenListResult>;
  getNetworkList(params: TGetNetworkListRequest): Promise<TGetNetworkListResult>;
};

export enum BusinessType {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}

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
