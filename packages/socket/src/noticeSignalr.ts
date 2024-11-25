import { BaseSignalr } from './signalr';
import {
  INoticeSignalr,
  TOrderRecordsNoticeRequest,
  TOrderRecordsNoticeRequestAddressItem,
  TOrderRecordsNoticeResponse,
} from './types';

export class NoticeSignalr extends BaseSignalr implements INoticeSignalr {
  public RequestUserOrderRecord({ address, addressList, minTimestamp }: TOrderRecordsNoticeRequest) {
    console.log('invoke RequestUserOrderRecord', address, addressList, minTimestamp);
    return this.invoke('RequestUserOrderRecord', {
      Address: address,
      AddressList: addressList,
      MinTimestamp: minTimestamp,
    });
  }

  public ReceiveUserOrderRecords(
    { address, addressList }: { address?: string; addressList?: TOrderRecordsNoticeRequestAddressItem[] },
    callback: (data: TOrderRecordsNoticeResponse | null) => void,
  ) {
    return this.listen('ReceiveUserOrderRecords', (data: TOrderRecordsNoticeResponse) => {
      const hasAddressCount = data?.addressList?.filter(item => addressList?.includes(item));

      if (data?.address === address || hasAddressCount === addressList?.length) {
        callback(data);
      } else {
        callback(null);
      }
    });
  }

  public UnsubscribeUserOrderRecord(address?: string, addressList?: TOrderRecordsNoticeRequestAddressItem[]) {
    console.log('invoke UnsubscribeUserOrderRecord', address, addressList);
    return this.invoke('UnsubscribeUserOrderRecord', {
      Address: address,
      AddressList: addressList,
    });
  }
}

export enum NOTICE_SIGNALR_METHODS {
  RequestUserOrderRecord = 'RequestUserOrderRecord',
  ReceiveUserOrderRecords = 'ReceiveUserOrderRecords',
  UnsubscribeUserOrderRecord = 'UnsubscribeUserOrderRecord',
}

export const NOTICE_LISTEN_LIST = [
  NOTICE_SIGNALR_METHODS.RequestUserOrderRecord,
  NOTICE_SIGNALR_METHODS.ReceiveUserOrderRecords,
  NOTICE_SIGNALR_METHODS.UnsubscribeUserOrderRecord,
] as const;

export const noticeSignalr = new NoticeSignalr({
  listenList: NOTICE_LISTEN_LIST,
}) as BaseSignalr<typeof NOTICE_LISTEN_LIST> & NoticeSignalr;
