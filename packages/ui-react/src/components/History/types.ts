import {
  BusinessType,
  OrderStatusEnum,
  RecordsRequestStatus,
  RecordsRequestType,
  TRecordsListItem,
} from '@etransfer/types';
import { ChainId } from '@portkey/types';
import { Moment } from 'moment';

export type THistoryItem = {
  key: string;
  orderType: BusinessType;
  status: OrderStatusEnum;
  arrivalTime: number;
  symbol: string;
  sendingAmount: string;
  receivingAmount: string;
  fromNetwork: string;
  fromAddress: string;
  fromToAddress: string;
  fromChainId: ChainId;
  fromTxId: string;
  toSymbol: string;
  toNetwork: string;
  toFromAddress: string;
  toAddress: string;
  toChainId: ChainId;
  toTxId: string;
  feeInfo: THistoryFeeInfo[];
};

export type THistoryFeeInfo = {
  symbol: string;
  amount: string;
};

export interface HistoryContentProps {
  recordsList: TRecordsListItem[];
  hasMore: boolean;
  maxResultCount: number;
  totalCount: number;
  skipCount: number;
}

export interface HistoryFilterProps {
  type: RecordsRequestType;
  status: RecordsRequestStatus;
  timestamp: number[] | null;
  onReset: () => void;
}

export type TRangeValue = [Moment | null, Moment | null] | null;
