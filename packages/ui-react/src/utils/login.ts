import { ChainId } from '@portkey/types';
import googleReCaptchaModal from '../components/GoogleReCaptcha/googleReCaptchaModal';
import { ReCaptchaType } from '../components/GoogleReCaptcha/types';
import { ETransferConfig } from '../provider/ETransferConfigProvider';
import { ETransferAccountConfig, ETransferAuthorizationConfig, WalletTypeEnum } from '../provider/types';
import { etransferCore } from './core';
import { NetworkType } from '../types';

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

export function getAccountInfo() {
  return ETransferConfig.getConfig('accountInfo') as ETransferAccountConfig;
}

export function getAccountAddress(chainId: ChainId) {
  const accountInfo = ETransferConfig.getConfig('accountInfo') as ETransferAccountConfig;
  return accountInfo.accounts?.[chainId];
}

export function isHaveTotalAccountInfo() {
  const accountInfo = getAccountInfo();
  const hasAccountAddress = Object.keys(accountInfo.accounts).length > 0;
  const hasConnectWallet = accountInfo.walletType !== WalletTypeEnum.unknown;

  const authorization = ETransferConfig.getConfig('authorization') as ETransferAuthorizationConfig;

  return hasAccountAddress && hasConnectWallet && !!authorization?.jwt;
}
