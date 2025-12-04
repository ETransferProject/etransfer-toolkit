import { useCallback, useEffect, useRef, useState } from 'react';
import { etransferEvents } from '@etransfer/utils';
import { UPDATE_UN_READE_RECORD_TIME } from '../constants';
import { etransferCore, getAuth } from '../utils';

export function useUpdateRecord() {
  const [isUnreadHistory, setIsUnreadHistory] = useState<boolean>(false);

  const updateRecordStatus = useCallback(async () => {
    try {
      const isHaveJWT = !!getAuth();
      if (!isHaveJWT) return;

      const res = await etransferCore.services.getRecordStatus();
      setIsUnreadHistory(res.status);
    } catch (error) {
      console.log('update new records error', error);
    }
  }, []);
  const updateRecordStatusRef = useRef(updateRecordStatus);
  updateRecordStatusRef.current = updateRecordStatus;

  const updateTimeRef = useRef(UPDATE_UN_READE_RECORD_TIME);
  const updateTimerRef = useRef<NodeJS.Timeout>();
  const handleSetTimer = useCallback(async () => {
    updateTimerRef.current = setInterval(() => {
      --updateTimeRef.current;

      if (updateTimeRef.current === 0) {
        updateRecordStatus();
        updateTimeRef.current = UPDATE_UN_READE_RECORD_TIME;
      }
    }, 1000);
  }, [updateRecordStatus]);

  const resetTimer = useCallback(() => {
    clearInterval(updateTimerRef.current);
    updateTimerRef.current = undefined;
    updateTimeRef.current = UPDATE_UN_READE_RECORD_TIME;
    handleSetTimer();
  }, [handleSetTimer]);

  useEffect(() => {
    // start 6s countdown
    resetTimer();
    // then, get one-time new record
    updateRecordStatusRef.current();

    const { remove } = etransferEvents.UpdateNewRecordStatus.addListener(() => {
      updateRecordStatusRef.current();
    });
    return () => {
      remove();
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;
    };
  }, [resetTimer]);

  // useEffect(() => {
  //   const { remove } = etransferEvents.ETransferConfigUpdated.addListener(() => {
  //     updateRecordStatusRef.current();
  //   });
  //   return () => {
  //     remove();
  //   };
  // }, []);

  return isUnreadHistory;
}
