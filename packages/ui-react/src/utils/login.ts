import googleReCaptchaModal from '../components/GoogleReCaptcha/googleReCaptchaModal';
import { ReCaptchaType } from '../components/GoogleReCaptcha/types';
import { etransferCore } from './core';

export async function getETransferReCaptcha(walletAddress: string): Promise<string | undefined> {
  const isRegistered = await etransferCore.services.checkEOARegistration({ address: walletAddress });
  if (!isRegistered.result) {
    const result = await googleReCaptchaModal();
    if (result.type === ReCaptchaType.success) {
      return result.data;
    }
  }

  return undefined;
}
