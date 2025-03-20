import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NoticeSignalr } from '../src/noticeSignalr';
import {
  TOrderRecordsNoticeRequest,
  TOrderRecordsNoticeRequestAddressItem,
  TOrderRecordsNoticeResponse,
} from '../src/types';

describe('NoticeSignalr', () => {
  let noticeSignalr: NoticeSignalr;

  beforeEach(() => {
    noticeSignalr = new NoticeSignalr({
      listenList: [],
    });

    jest.clearAllMocks();
  });

  describe('RequestUserOrderRecord', () => {
    it('should invoke RequestUserOrderRecord with correct parameters', async () => {
      const request: TOrderRecordsNoticeRequest = {
        address: 'mockAddress',
        addressList: [{ someProperty: 'value' }] as unknown as TOrderRecordsNoticeRequestAddressItem[],
        minTimestamp: 123456789,
      };

      // Mock the invoke method from BaseSignalr
      jest.spyOn(noticeSignalr, 'invoke').mockResolvedValue(undefined);

      await noticeSignalr.RequestUserOrderRecord(request);

      expect(noticeSignalr.invoke).toHaveBeenCalledWith('RequestUserOrderRecord', {
        Address: request.address,
        AddressList: request.addressList,
        MinTimestamp: request.minTimestamp,
      });
    });
  });

  describe('ReceiveUserOrderRecords', () => {
    it('should listen to ReceiveUserOrderRecords with address and call callback', () => {
      const request = { address: 'mockAddress', addressList: [] as TOrderRecordsNoticeRequestAddressItem[] };
      const callback = jest.fn();

      // Mock the listen method from BaseSignalr
      jest.spyOn(noticeSignalr, 'listen').mockImplementation((_, handler) => {
        handler({ address: 'mockAddress', addressList: [] } as unknown as TOrderRecordsNoticeResponse); // Mock incoming data
        return {
          remove: jest.fn(),
        };
      });

      noticeSignalr.ReceiveUserOrderRecords(request, callback);

      expect(callback).toHaveBeenCalledWith({ address: 'mockAddress', addressList: [] });
    });

    it('should listen to ReceiveUserOrderRecords with addressList and call callback', () => {
      const request = {
        address: 'mockAddress',
        addressList: [
          {
            SourceType: 'EVM',
            Address: 'mockAddressList1',
          },
        ],
      };
      const callback = jest.fn();

      // Mock the listen method from BaseSignalr
      jest.spyOn(noticeSignalr, 'listen').mockImplementation((_, handler) => {
        handler({
          addressList: [
            {
              SourceType: 'EVM',
              Address: 'mockAddressList1',
            },
          ],
        } as unknown as TOrderRecordsNoticeResponse); // Mock incoming data
        return {
          remove: jest.fn(),
        };
      });

      noticeSignalr.ReceiveUserOrderRecords(request, callback);

      expect(callback).toHaveBeenCalledWith({
        addressList: [
          {
            SourceType: 'EVM',
            Address: 'mockAddressList1',
          },
        ],
      });
    });

    it('should listen to ReceiveUserOrderRecords and call callback undefined', () => {
      const request = { address: '' };
      const callback = jest.fn();

      // Mock the listen method from BaseSignalr
      jest.spyOn(noticeSignalr, 'listen').mockImplementation((_, handler) => {
        handler(undefined); // Mock incoming data
        return {
          remove: jest.fn(),
        };
      });

      noticeSignalr.ReceiveUserOrderRecords(request, callback);

      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it('should call callback with null if address does not match', () => {
      const request = { address: 'mockAddress', addressList: [] as TOrderRecordsNoticeRequestAddressItem[] };
      const callback = jest.fn();

      // Mock listen method
      jest.spyOn(noticeSignalr, 'listen').mockImplementation((_, handler) => {
        handler(undefined); // Mock incoming data
        return {
          remove: jest.fn(),
        };
      });

      noticeSignalr.ReceiveUserOrderRecords(request, callback);

      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('UnsubscribeUserOrderRecord', () => {
    it('should invoke UnsubscribeUserOrderRecord with correct parameters', async () => {
      const request = { address: 'mockAddress', addressList: [] as TOrderRecordsNoticeRequestAddressItem[] };

      // Mock the invoke method from BaseSignalr
      jest.spyOn(noticeSignalr, 'invoke').mockResolvedValue(undefined);

      await noticeSignalr.UnsubscribeUserOrderRecord(request.address, request.addressList);

      expect(noticeSignalr.invoke).toHaveBeenCalledWith('UnsubscribeUserOrderRecord', {
        Address: request.address,
        AddressList: request.addressList,
      });
    });
  });
});
