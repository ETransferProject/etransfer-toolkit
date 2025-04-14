import { useState, useCallback, useEffect } from 'react';
import { ETransferConfig } from '../provider/ETransferConfigProvider';
import { etransferEvents, handleErrorMessage } from '@etransfer/utils';
import { ETransferReCaptchaConfig } from '../provider/types';
import { ReCaptchaType } from '../components/GoogleReCaptcha/types';
import { etransferCore } from '../utils/core';
import { setReCaptchaModal } from '../utils/recaptcha';

export function useReCaptcha() {
  const [reCaptchaInfo, setReCaptchaInfo] = useState<Partial<ETransferReCaptchaConfig> | undefined>(
    ETransferConfig.config?.reCaptchaConfig,
  );
  const setHandler = useCallback((_reCaptchaInfo: Partial<ETransferReCaptchaConfig>) => {
    setReCaptchaInfo((v) => ({ ...v, ..._reCaptchaInfo }));
  }, []);

  useEffect(() => {
    const { remove } = etransferEvents.SetRecaptchaConfig.addListener(setHandler);
    return () => {
      remove();
    };
  }, [setHandler]);

  return reCaptchaInfo;
}

export function useReCaptchaModal() {
  const reCaptchaInfo = useReCaptcha();

  return useCallback(
    async ({
      walletAddress,
      open,
      modalWidth,
    }: {
      walletAddress: string;
      open?: boolean;
      modalWidth?: number;
    }): Promise<string | undefined> => {
      try {
        if (open) {
          const isRegistered = await etransferCore.services.checkEOARegistration({ address: walletAddress });
          if (!isRegistered.result) {
            if (reCaptchaInfo?.customReCaptchaHandler) {
              const info = await reCaptchaInfo.customReCaptchaHandler();
              if (info.type === ReCaptchaType.success) return info.message;
              throw info;
            } else {
              const info = await setReCaptchaModal(open, modalWidth);
              if (info.type === ReCaptchaType.success) return info.message;
              throw info;
            }
          }
          return;
        }
        return;
      } catch (e: any) {
        if (e.type === ReCaptchaType.cancel) throw handleErrorMessage(e, 'User Cancel');
        if (e.type === ReCaptchaType.error) throw handleErrorMessage(e, 'ReCaptcha error');
        if (e.type === ReCaptchaType.expire) throw handleErrorMessage(e, 'ReCaptcha expired');
        throw e;
      }
    },
    [reCaptchaInfo],
  );
}
