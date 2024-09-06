import { BaseSignalr } from './signalr';
import { INoticeSignalr, TOrderRecordsNoticeRequest, TOrderRecordsNoticeResponse } from './types';

export class NoticeSignalr extends BaseSignalr implements INoticeSignalr {
  public RequestUserOrderRecord({ address, minTimestamp }: TOrderRecordsNoticeRequest) {
    console.log('invoke RequestUserOrderRecord', address, minTimestamp);
    return this.invoke('RequestUserOrderRecord', {
      Address: address,
      MinTimestamp: minTimestamp,
    });
  }

  public ReceiveUserOrderRecords(
    { address }: { address: string },
    callback: (data: TOrderRecordsNoticeResponse | null) => void,
  ) {
    return this.listen('ReceiveUserOrderRecords', (data: TOrderRecordsNoticeResponse) => {
      if (data?.address === address) {
        callback(data);
      } else {
        callback(null);
      }
    });
  }

  public UnsubscribeUserOrderRecord(address: string) {
    console.log('invoke UnsubscribeUserOrderRecord', address);
    return this.invoke('UnsubscribeUserOrderRecord', {
      Address: address,
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
