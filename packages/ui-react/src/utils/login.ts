import { ChainId } from '@portkey/types';
import googleReCaptchaModal from '../components/GoogleReCaptcha/googleReCaptchaModal';
import { ReCaptchaType } from '../components/GoogleReCaptcha/types';
import { ETransferConfig } from '../provider/ETransferConfigProvider';
import { ETransferAccountConfig } from '../provider/types';
import { etransferCore } from './core';
import { NetworkType } from '../types';

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

export function getNetworkType() {
  return ETransferConfig.getConfig('networkType') as NetworkType;
}

export function getAccountInfo() {
  return ETransferConfig.getConfig('accountInfo') as ETransferAccountConfig;
}

export function getAccountAddress(chainId: ChainId) {
  const accountInfo = ETransferConfig.getConfig('accountInfo') as ETransferAccountConfig;
  return accountInfo.accounts?.[chainId];
}
