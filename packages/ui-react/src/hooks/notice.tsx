import { etransferCore, getAccountAddress } from '@etransfer/ui-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { etransferEvents, removeAddressSuffix } from '@etransfer/utils';
import { TOrderRecordsNoticeResponse } from '@etransfer/socket';
import { CHAIN_ID } from '../constants';
import { handleNoticeDataAndShow } from '../utils/notice';

export function useNoticeSocket() {
  const address = useMemo(() => {
    return removeAddressSuffix(getAccountAddress(CHAIN_ID.AELF) || '');
  }, []);

  const handleNotice = useCallback((res: TOrderRecordsNoticeResponse | null) => {
    if (res) {
      if (res.processing.depositCount) {
        // TODO
        // dispatch(setDepositProcessingCount(res.processing.depositCount));
      } else {
        // TODO
        // dispatch(setDepositProcessingCount(0));
      }

      if (res.processing.withdrawCount) {
        // TODO
        // dispatch(setWithdrawProcessingCount(res.processing.withdrawCount));
      } else {
        // TODO
        // dispatch(setWithdrawProcessingCount(0));
      }

      etransferEvents.GlobalTxnNotice.emit();
      // handle order data and show notice
      handleNoticeDataAndShow(res);
    }
  }, []);

  const handleNoticeRef = useRef(handleNotice);
  handleNoticeRef.current = handleNotice;

  useEffect(() => {
    if (address && !etransferCore.noticeSocket?.signalr?.connectionId) {
      etransferCore.noticeSocket
        ?.doOpen()
        .then((res) => {
          console.log('NoticeSocket doOpen res', res);
          etransferCore.noticeSocket?.RequestUserOrderRecord({
            address: address,
          });
          etransferCore.noticeSocket?.ReceiveUserOrderRecords(
            {
              address: address,
            },
            (res) => {
              handleNoticeRef.current(res);
            },
          );
        })
        .catch((error) => {
          console.log('NoticeSocket doOpen error', error);
        });
    }
  }, [address]);
}
