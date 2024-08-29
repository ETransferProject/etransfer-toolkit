import { useState, useRef, useCallback, useEffect } from 'react';
import { SingleMessage } from '../components';
import { CHECK_TXN_DURATION, NO_TXN_FOUND } from '../constants';

export function useCheckTxn() {
  const [isCheckTxnLoading, setIsCheckTxnLoading] = useState(false);
  // TODO
  const { depositProcessingCount, withdrawProcessingCount } = { depositProcessingCount: 0, withdrawProcessingCount: 0 };

  const timerRef = useRef<NodeJS.Timeout>();

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = undefined;
    setIsCheckTxnLoading(false);
  }, []);

  const resetTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      stopTimer();
      if (!depositProcessingCount && !withdrawProcessingCount) {
        SingleMessage.info(NO_TXN_FOUND);
      }
    }, CHECK_TXN_DURATION);
  }, [depositProcessingCount, stopTimer, withdrawProcessingCount]);

  const handleCheckTxnClick = useCallback(() => {
    setIsCheckTxnLoading(true);
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    return () => {
      stopTimer;
    };
  });

  return { isCheckTxnLoading, resetTimer, stopTimer, handleCheckTxnClick };
}
