import { GetCAHolderByManagerParams } from '@portkey/services';
import { SupportedChainId } from '@/constants';
import { WalletInfo } from '@/types/wallet';
import { did } from '@portkey/did-ui-react';
import { TChainId } from '@aelf-web-login/wallet-adapter-base';
import { WalletTypeEnum } from '@etransfer/ui-react';
import { recoverManagerAddressByPubkey, recoverPubKeyBySignature } from '@etransfer/utils';

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
    const _sdkWalletInfoString = localStorage.getItem('PortkeyWebWalletWalletInfo');
    if (_sdkWalletInfoString) {
      const _sdkWalletInfo = JSON.parse(_sdkWalletInfoString);
      caHash = _sdkWalletInfo.caHash;
      originChainId = _sdkWalletInfo.originChainId;
    }
  }
  // TODO new eoa

  return {
    caHash: caHash || '',
    originChainId: originChainId || SupportedChainId.sideChain,
  };
};

export const getManagerAddressAndPubkeyByWallet = (
  walletType: WalletTypeEnum,
  plainText: string,
  signature: string,
): { managerAddress: string; pubkey: string } => {
  let managerAddress, pubkey;

  if (walletType === WalletTypeEnum.web) {
    // TODO info error
    const _sdkWalletInfoString = localStorage.getItem('PortkeyWebWalletWalletInfo');
    if (_sdkWalletInfoString) {
      const _sdkWalletInfo = JSON.parse(_sdkWalletInfoString);
      managerAddress = _sdkWalletInfo.managerAddress;
      pubkey = _sdkWalletInfo.managerPubkey;
    }
  } else {
    pubkey = recoverPubKeyBySignature(plainText, signature) + '';
    managerAddress = recoverManagerAddressByPubkey(pubkey);
  }

  return {
    managerAddress,
    pubkey,
  };
};
