import { TNetworkItem } from '@etransfer/types';
import { ChainId } from '@portkey/types';
import { IChainMenuItem } from './chain';

export type TWithdrawInfoSuccess = {
  receiveAmount: string;
  network: TNetworkItem;
  amount: string;
  symbol: string;
  chainItem: IChainMenuItem;
  arriveTime: string;
  receiveAmountUsd: string;
  transactionId: string;
};

export type TArrivalTimeConfig = {
  chainList: ChainId[];
  dividingQuota: string;
};
