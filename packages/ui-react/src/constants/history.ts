import { RecordsRequestStatus, RecordsRequestType } from '@etransfer/types';

export enum HistoryStatusEnum {
  Processing = 'Pending',
  Succeed = 'Completed',
  Failed = 'Failed',
}

export enum BusinessTypeLabel {
  ALL = 'All',
  Deposit = 'Deposit',
  Withdraw = 'Withdrawal',
  Transfer = 'Transfer',
}

export const BusinessTypeOptions = [
  { value: RecordsRequestType.All, label: BusinessTypeLabel.ALL },
  { value: RecordsRequestType.Deposit, label: BusinessTypeLabel.Deposit },
  { value: RecordsRequestType.Withdraw, label: BusinessTypeLabel.Withdraw },
];

export const HistoryStatusOptions = [
  { value: RecordsRequestStatus.All, label: 'All' },
  { value: RecordsRequestStatus.Processing, label: HistoryStatusEnum.Processing },
  { value: RecordsRequestStatus.Succeed, label: HistoryStatusEnum.Succeed },
  { value: RecordsRequestStatus.Failed, label: HistoryStatusEnum.Failed },
];

export const ORDER_PROCESSING_TIP = 'Pending confirmation on ';

export const ORDER_FAILED_TIP = 'Assets returned to the from address';

export const START_TIME_FORMAT = 'YYYY-MM-DD 00:00:00';

export const END_TIME_FORMAT = 'YYYY-MM-DD 23:59:59';

export const NO_HISTORY_FOUND = 'No history found';

export const LOGIN_TO_VIEW_HISTORY = 'Log in to view transaction history';

export const NO_DATA_TEXT = '-- No Data --';

export const LOADING_TEXT = ' Loading... ';

export const UPDATE_UN_READE_RECORD_TIME = 6;
