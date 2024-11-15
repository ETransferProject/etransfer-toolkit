import { IListen } from './signalr';

export type TOrderRecordsNoticeRequest = {
  address: string;
  minTimestamp?: number;
};
export type TOrderRecordsNoticeResponse = {
  address: string;
  processing: TRecordsNoticeDetail;
  succeed: TRecordsNoticeDetail;
  failed: TRecordsNoticeDetail;
};

export type TRecordsNoticeDetail = {
  depositCount: number;
  withdrawCount: number;
  transferCount: number;
  deposit: TDepositRecordsNoticeDetailItem[];
  withdraw: TWithdrawRecordsNoticeDetailItem[];
  transfer: TTransferRecordsNoticeDetailItem[];
};

export type TDepositRecordsNoticeDetailItem = {
  id: string;
  amount: string;
  symbol: string;
  isSwap: boolean;
  isSwapFail: boolean;
};

export type TWithdrawRecordsNoticeDetailItem = {
  id: string;
  amount: string;
  symbol: string;
};

export type TTransferRecordsNoticeDetailItem = {
  id: string;
  amount: string;
  symbol: string;
};

export interface INoticeSignalr {
  RequestUserOrderRecord({ address, minTimestamp }: TOrderRecordsNoticeRequest): Promise<any>;
  ReceiveUserOrderRecords(
    { address }: { address: string },
    callback: (data: TOrderRecordsNoticeResponse | null) => void,
  ): IListen;
  UnsubscribeUserOrderRecord(address: string): Promise<any>;
}
