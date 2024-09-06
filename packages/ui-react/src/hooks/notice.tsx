import { etransferCore, getAccountAddress } from '../utils';
import { useCallback, useEffect, useRef } from 'react';
import { etransferEvents, removeAddressSuffix } from '@etransfer/utils';
import { TOrderRecordsNoticeResponse } from '@etransfer/socket';
import { CHAIN_ID } from '../constants';
import {
  connectUserOrderRecord,
  handleDepositNoticeDataAndShow,
  handleNoticeDataAndShow,
  handleWithdrawNoticeDataAndShow,
} from '../utils/notice';
import { useETransferWithdraw } from '../context/ETransferWithdrawProvider';
import { useETransferDeposit } from '../context/ETransferDepositProvider';
import { etransferWithdrawAction } from '../context/ETransferWithdrawProvider/actions';
import { etransferDepositAction } from '../context/ETransferDepositProvider/actions';

export function useDepositNoticeSocket(isListenNoticeAuto: boolean) {
  const address = useCallback(() => {
    const _address =
      getAccountAddress(CHAIN_ID.AELF) || getAccountAddress(CHAIN_ID.tDVV) || getAccountAddress(CHAIN_ID.tDVW) || '';
    return removeAddressSuffix(_address);
  }, []);

  const [_deposit, { dispatch }] = useETransferDeposit();

  const handleNotice = useCallback(
    (res: TOrderRecordsNoticeResponse | null) => {
      if (res) {
        if (res.processing.depositCount) {
          dispatch(etransferDepositAction.setDepositProcessingCount.actions(res.processing.depositCount));
        } else {
          dispatch(etransferDepositAction.setDepositProcessingCount.actions(0));
        }

        etransferEvents.GlobalTxnNotice.emit();
        // handle order data and show notice
        handleDepositNoticeDataAndShow(res);
      }
    },
    [dispatch],
  );
  const handleNoticeRef = useRef(handleNotice);
  handleNoticeRef.current = handleNotice;

  const openNoticeSocket = useCallback(() => {
    if (address() && !etransferCore.noticeSocket?.signalr?.connectionId && isListenNoticeAuto) {
      connectUserOrderRecord(address(), handleNoticeRef.current);
    }
  }, [address, isListenNoticeAuto]);
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

export function useWithdrawNoticeSocket(isListenNoticeAuto: boolean) {
  const address = useCallback(() => {
    const _address =
      getAccountAddress(CHAIN_ID.AELF) || getAccountAddress(CHAIN_ID.tDVV) || getAccountAddress(CHAIN_ID.tDVW) || '';
    return removeAddressSuffix(_address);
  }, []);

  const [_withdraw, { dispatch }] = useETransferWithdraw();

  const handleNotice = useCallback(
    (res: TOrderRecordsNoticeResponse | null) => {
      if (res) {
        if (res.processing.withdrawCount) {
          dispatch(etransferWithdrawAction.setWithdrawProcessingCount.actions(res.processing.withdrawCount));
        } else {
          dispatch(etransferWithdrawAction.setWithdrawProcessingCount.actions(0));
        }

        etransferEvents.GlobalTxnNotice.emit();
        // handle order data and show notice
        handleWithdrawNoticeDataAndShow(res);
      }
    },
    [dispatch],
  );
  const handleNoticeRef = useRef(handleNotice);
  handleNoticeRef.current = handleNotice;

  const openNoticeSocket = useCallback(() => {
    if (address() && !etransferCore.noticeSocket?.signalr?.connectionId && isListenNoticeAuto) {
      connectUserOrderRecord(address(), handleNoticeRef.current);
    }
  }, [address, isListenNoticeAuto]);
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
      connectUserOrderRecord(address(), handleNoticeRef.current);
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
