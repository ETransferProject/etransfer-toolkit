import { GetCAHolderByManagerParams } from '@portkey/services';
import { SupportedChainId } from '@/constants';
import { WalletInfo } from '@/types/wallet';
import { TChainId, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { did } from '@portkey/did';
import { getPortkeyWebWalletInfo } from './portkey';

export const getCaHashAndOriginChainIdByWallet = async (
  walletInfo: WalletInfo,
  walletType: WalletTypeEnum,
): Promise<{ caHash: string; originChainId: TChainId }> => {
  if (walletType === WalletTypeEnum.unknown)
    return {
      caHash: '',
      originChainId: SupportedChainId.sideChain,
    };

  let caHash, originChainId;
  if (walletType === WalletTypeEnum.discover) {
    const res = await did.services.getHolderInfoByManager({
      caAddresses: [walletInfo?.address],
    } as unknown as GetCAHolderByManagerParams);
    const caInfo = res[0];
    caHash = caInfo?.caHash;
    originChainId = caInfo?.chainId as TChainId;
  } else if (walletType === WalletTypeEnum.web) {
    const _sdkWalletInfo = getPortkeyWebWalletInfo();
    caHash = _sdkWalletInfo?.caHash;
    originChainId = _sdkWalletInfo?.originChainId;
  }

  return {
    caHash: caHash || '',
    originChainId: originChainId || SupportedChainId.sideChain,
  };
};
