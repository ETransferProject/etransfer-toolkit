import { APP_NAME } from '@/constants';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { SignatureData, removeELFAddressSuffix } from '@etransfer/utils';
import { zeroFill } from '@portkey/utils';
import { useCallback } from 'react';
import detectProvider from '@portkey/detect-provider';

export function useGetTransactionSignature() {
  const { walletInfo, walletType, getSignature } = useConnectWallet();

  return useCallback(
    async (signInfo: any): Promise<SignatureData | null> => {
      const ownerAddress = walletInfo?.address;
      let signatureResult: SignatureData | null = {
        error: 0,
        errorMessage: '',
        signature: '',
        from: '',
      };
      if (!ownerAddress) return signatureResult;
      const isFairyVault = walletType === WalletTypeEnum.fairyVault;
      const isWebPortkey = walletType === WalletTypeEnum.web;
      const isDiscover = walletType === WalletTypeEnum.discover;
      if (isDiscover || isFairyVault || isWebPortkey) {
        // discover
        signatureResult.from = WalletTypeEnum.discover;

        // discover and FairyVault
        let provider: any = (walletInfo?.extraInfo as any)?.provider;
        if (isFairyVault) {
          provider = await detectProvider({ providerName: 'FairyVault' as any });
        } else if (isWebPortkey) {
          provider = await detectProvider({ providerName: 'PortkeyWebWallet' as any });
        }

        if (provider?.methodCheck?.('wallet_getTransactionSignature') || isFairyVault || isWebPortkey) {
          const sin = await provider?.request({
            method: 'wallet_getTransactionSignature',
            payload: { hexData: signInfo },
          });
          signatureResult.signature = [zeroFill(sin.r), zeroFill(sin.s), `0${sin.recoveryParam.toString()}`].join('');
        } else {
          const signatureRes = await getSignature({
            appName: APP_NAME,
            address: removeELFAddressSuffix(ownerAddress),
            signInfo,
          });
          signatureResult.signature = signatureRes?.signature || '';
        }
      } else {
        const signatureRes = await getSignature({
          appName: APP_NAME,
          address: removeELFAddressSuffix(ownerAddress),
          signInfo,
        });
        signatureResult = signatureRes;
      }
      return signatureResult;
    },
    [getSignature, walletInfo, walletType],
  );
}
