import { useState, useRef, useCallback, useEffect } from 'react';
import { SingleMessage } from '../components';
import { CHECK_TXN_DURATION, NO_TXN_FOUND, START_CHECKING_TXN } from '../constants';
import { useETransferDeposit } from '../context/ETransferDepositProvider';

export function useCheckTxn() {
  const [isCheckTxnLoading, setIsCheckTxnLoading] = useState(false);
  const [{ depositProcessingCount }] = useETransferDeposit();
  const withdrawProcessingCountRef = useRef(0);

  const timerRef = useRef<NodeJS.Timeout>();

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = undefined;
    setIsCheckTxnLoading(false);
  }, []);

  const resetTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      stopTimer();
      if (!depositProcessingCount && !withdrawProcessingCountRef.current) {
        SingleMessage.info(NO_TXN_FOUND);
      }
    }, CHECK_TXN_DURATION);
  }, [depositProcessingCount, stopTimer]);

  const handleCheckTxnClick = useCallback(() => {
    setIsCheckTxnLoading(true);
    SingleMessage.info(START_CHECKING_TXN);
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    return () => {
      stopTimer;
    };
  });

  return { isCheckTxnLoading, resetTimer, stopTimer, handleCheckTxnClick, withdrawProcessingCountRef };
}
