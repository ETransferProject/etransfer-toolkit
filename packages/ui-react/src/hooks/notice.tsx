import { etransferCore, getAccountAddress } from '../utils';
import { useCallback, useEffect, useRef } from 'react';
import { etransferEvents, removeAddressSuffix } from '@etransfer/utils';
import { TOrderRecordsNoticeResponse } from '@etransfer/socket';
import { CHAIN_ID } from '../constants';
import { handleNoticeDataAndShow } from '../utils/notice';
import { useETransferWithdraw } from '../context/ETransferWithdrawProvider';
import { useETransferDeposit } from '../context/ETransferDepositProvider';
import { etransferWithdrawAction } from '../context/ETransferWithdrawProvider/actions';
import { etransferDepositAction } from '../context/ETransferDepositProvider/actions';

export function useNoticeSocket() {
  const address = useCallback(() => {
    const _address =
      getAccountAddress(CHAIN_ID.AELF) || getAccountAddress(CHAIN_ID.tDVV) || getAccountAddress(CHAIN_ID.tDVW) || '';
    return removeAddressSuffix(_address);
  }, []);

  const [_deposit, { dispatch: depositDispatch }] = useETransferDeposit();
  const [_withdraw, { dispatch: withdrawDispatch }] = useETransferWithdraw();

  const handleNotice = useCallback(
    (res: TOrderRecordsNoticeResponse | null) => {
      if (res) {
        if (res.processing.depositCount) {
          depositDispatch(etransferDepositAction.setDepositProcessingCount.actions(res.processing.depositCount));
        } else {
          depositDispatch(etransferDepositAction.setDepositProcessingCount.actions(0));
        }

        if (res.processing.withdrawCount) {
          withdrawDispatch(etransferWithdrawAction.setWithdrawProcessingCount.actions(res.processing.withdrawCount));
        } else {
          withdrawDispatch(etransferWithdrawAction.setWithdrawProcessingCount.actions(0));
        }

        etransferEvents.GlobalTxnNotice.emit();
        // handle order data and show notice
        handleNoticeDataAndShow(res);
      }
    },
    [depositDispatch, withdrawDispatch],
  );

  const handleNoticeRef = useRef(handleNotice);
  handleNoticeRef.current = handleNotice;

  const openNoticeSocket = useCallback(() => {
    if (address() && !etransferCore.noticeSocket?.signalr?.connectionId) {
      etransferCore.noticeSocket
        ?.doOpen()
        .then((res) => {
          console.log('NoticeSocket doOpen result:', res);
          etransferCore.noticeSocket?.RequestUserOrderRecord({
            address: address(),
          });
          etransferCore.noticeSocket?.ReceiveUserOrderRecords(
            {
              address: address(),
            },
            (res) => {
              console.log('NoticeSocket ReceiveUserOrderRecords res:', res);
              handleNoticeRef.current(res);
            },
          );
        })
        .catch((error) => {
          console.log('NoticeSocket error:', error);
        });
    }
  }, [address]);
  const openNoticeSocketRef = useRef(openNoticeSocket);
  openNoticeSocketRef.current = openNoticeSocket;

  useEffect(() => {
    const { remove } = etransferEvents.ETransferConfigUpdated.addListener(() => {
      openNoticeSocketRef.current();
    });
    return () => {
      remove();
    };
  }, []);
}
