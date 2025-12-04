import { etransferEvents } from '@etransfer/utils';
import { ReCaptchaType } from '../components/GoogleReCaptcha/types';

export const setReCaptchaModal: (
  open?: boolean,
  modalWidth?: number,
) => Promise<{ type: ReCaptchaType; message?: any }> = (open?: boolean, modalWidth?: number) => {
  return new Promise((resolve, reject) => {
    etransferEvents.SetRecaptchaConfig.emit(open, {
      modalWidth,
      onSuccess: (result: string) => {
        resolve({ type: ReCaptchaType.success, message: result });
      },
      onExpire: (e: any) => {
        reject({ type: ReCaptchaType.expire, message: e });
      },
      onError: (e: any) => {
        reject({ type: ReCaptchaType.error, message: e });
      },
      onCancel: () => {
        reject({ type: ReCaptchaType.cancel });
      },
    });
  });
};
