import googleReCaptchaModal from '../components/GoogleReCaptcha/googleReCaptchaModal';
import { ReCaptchaType } from '../components/GoogleReCaptcha/types';
import { ETransferConfig } from '../provider/ETransferConfigProvider';
import { NetworkType } from '../types';
import { etransferCore } from './core';

export async function getETransferReCaptcha(
  walletAddress: string,
  networkType?: NetworkType,
  modalWidth?: number,
): Promise<string | undefined> {
  const networkTypeNew = networkType || getNetworkType();
  const isRegistered = await etransferCore.services.checkEOARegistration({ address: walletAddress });
  if (!isRegistered.result) {
    const result = await googleReCaptchaModal(networkTypeNew, modalWidth);
    if (result.type === ReCaptchaType.success) {
      return result.data;
    }
  }

  return undefined;
}

export function getNetworkType() {
  return ETransferConfig.getConfig('networkType') as NetworkType;
}
