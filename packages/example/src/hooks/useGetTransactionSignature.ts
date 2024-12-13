import { APP_NAME } from '@/constants';
import { ExtraInfoForDiscover } from '@/types/wallet';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { SignatureData, removeELFAddressSuffix } from '@etransfer/utils';
import { zeroFill } from '@portkey/utils';
import { useCallback } from 'react';

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

      if (walletType === WalletTypeEnum.discover) {
        // discover
        signatureResult.from = WalletTypeEnum.discover;
        const discoverInfo = walletInfo?.extraInfo as ExtraInfoForDiscover;
        if ((discoverInfo?.provider as any).methodCheck('wallet_getTransactionSignature')) {
          const sin = await discoverInfo?.provider?.request({
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
