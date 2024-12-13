import { APP_NAME } from '@/constants';
import { ExtraInfoForDiscover } from '@/types/wallet';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { SignatureData } from '@etransfer/utils';
import AElf from 'aelf-sdk';
import { useCallback } from 'react';

export function useGetManagerSignature() {
  const { getSignature, walletType, walletInfo } = useConnectWallet();

  return useCallback(
    async (plainText: string): Promise<SignatureData | null> => {
      let signResult: SignatureData | null = null;
      if (!walletInfo?.address) return signResult;

      if (walletType === WalletTypeEnum.discover) {
        // discover
        const discoverInfo = walletInfo?.extraInfo as ExtraInfoForDiscover;
        if ((discoverInfo?.provider as any).methodCheck('wallet_getManagerSignature')) {
          const sin = await discoverInfo?.provider?.request({
            method: 'wallet_getManagerSignature',
            payload: { hexData: plainText },
          });
          const signInfo = [
            sin.r.toString('hex', 32),
            sin.s.toString('hex', 32),
            `0${sin.recoveryParam.toString()}`,
          ].join('');
          signResult = {
            error: 0,
            errorMessage: '',
            signature: signInfo,
            from: WalletTypeEnum.discover,
          };
        } else {
          const signInfo = AElf.utils.sha256(plainText);
          signResult = await getSignature({
            appName: APP_NAME,
            address: walletInfo.address,
            signInfo,
          });
        }
      } else if (walletType === WalletTypeEnum.elf) {
        // nightElf
        const signInfo = AElf.utils.sha256(plainText);
        signResult = await getSignature({
          appName: APP_NAME,
          address: walletInfo.address,
          signInfo,
        });
      } else {
        // portkey sdk
        const signInfo = Buffer.from(plainText).toString('hex');
        signResult = await getSignature({
          appName: APP_NAME,
          address: walletInfo.address,
          signInfo,
        });
      }

      return signResult;
    },
    [getSignature, walletInfo?.address, walletInfo?.extraInfo, walletType],
  );
}
