import { etransferEvents } from '@etransfer/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getAuth } from '../utils';

export function useIsHaveJWT() {
  const [isHaveJWT, setIsHaveJWT] = useState(false);

  const updateJWTJudge = useCallback(() => {
    const isHaveJWT = !!getAuth();
    setIsHaveJWT(isHaveJWT);
  }, []);
  const updateJWTJudgeRef = useRef(updateJWTJudge);
  updateJWTJudgeRef.current = updateJWTJudge;

  useEffect(() => {
    updateJWTJudgeRef.current();

    const { remove } = etransferEvents.ETransferConfigUpdated.addListener(() => {
      updateJWTJudgeRef.current();
    });
    return () => {
      remove();
    };
  }, []);

  return isHaveJWT;
}
