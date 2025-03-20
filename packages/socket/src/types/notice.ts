import { IListen } from './signalr';

export type TOrderRecordsNoticeRequest = {
  address?: string;
  addressList?: TOrderRecordsNoticeRequestAddressItem[];
  minTimestamp?: number;
};
export type TOrderRecordsNoticeRequestAddressItem = {
  SourceType: string;
  Address: string;
};
export type TOrderRecordsNoticeResponse = {
  address?: string;
  addressList?: TOrderRecordsNoticeRequestAddressItem[];
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
  RequestUserOrderRecord({ address, addressList, minTimestamp }: TOrderRecordsNoticeRequest): Promise<any>;
  ReceiveUserOrderRecords(
    { address, addressList }: { address: string; addressList?: TOrderRecordsNoticeRequestAddressItem[] },
    callback: (data: TOrderRecordsNoticeResponse | null) => void,
  ): IListen;
  UnsubscribeUserOrderRecord(address: string, addressList?: TOrderRecordsNoticeRequestAddressItem[]): Promise<any>;
}
