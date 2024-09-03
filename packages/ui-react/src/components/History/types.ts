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
  className?: string;
  recordsList: TRecordsListItem[];
  hasMore: boolean;
  maxResultCount: number;
  totalCount: number;
  skipCount: number;
  onClickItem?: (id: string) => void;
}

export interface HistoryMobileContentProps extends HistoryContentProps {
  onNextPage: () => void;
}

export interface HistoryWebContentProps extends HistoryContentProps {
  onTableChange: (page: number, pageSize: number) => void;
}

export interface HistoryFilterProps {
  className?: string;
  type: RecordsRequestType;
  status: RecordsRequestStatus;
  timestamp: number[] | null;

  onReset: () => void;
}

export interface HistoryMobileFilterProps extends HistoryFilterProps {
  onCloseItem: (type: HistoryCloseItemParams) => void;
  onApply: (params: HistoryFilterOnApplyParams) => void;
}

export interface HistoryWebFilterProps extends HistoryFilterProps {
  onTypeChange: (type: RecordsRequestType) => void;
  onStatusChange: (status: RecordsRequestStatus) => void;
  onTimeStampChange: (timeArray: number[] | null) => void;
}

export type HistoryCloseItemParams = 'type' | 'status' | 'timestamp';

export type HistoryFilterOnApplyParams = {
  type: RecordsRequestType;
  status: RecordsRequestStatus;
  timeArray: number[] | null;
};

export type TRangeValue = [Moment | null, Moment | null] | null;
