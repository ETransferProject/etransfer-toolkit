import AElf from 'aelf-sdk';
import { APP_NAME } from '@/constants/index';
import { useCallback, useRef } from 'react';
import { etransferEvents, recoverManagerAddressByPubkey, recoverPubKeyBySignature } from '@etransfer/utils';
import { AuthTokenSource, PortkeyVersion } from '@etransfer/types';
import { eTransferCore } from '@/utils/core';
import {
  ETRANSFER_USER_ACCOUNT,
  ETRANSFER_USER_CA_HASH,
  ETRANSFER_USER_ORIGIN_CHAIN_ID,
  ETRANSFER_USER_MANAGER_ADDRESS,
} from '@/constants/storage';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/wallet';
import { ETransferConfig, getETransferReCaptcha, WalletTypeEnum } from '@etransfer/ui-react';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useGetAccount, useIsLogin } from './wallet';
import { ExtraInfoForDiscover, WalletInfo } from '@/types/wallet';

export function useQueryAuthToken() {
  const { getSignature, walletType, walletInfo } = useConnectWallet();
  const isLogin = useIsLogin();
  const isLoginRef = useRef(isLogin);
  isLoginRef.current = isLogin;
  const accounts = useGetAccount();
  const accountsRef = useRef(accounts);
  accountsRef.current = accounts;

  const loginSuccessActive = useCallback(() => {
    console.log('%c login success and emit event', 'color: green');
    etransferEvents.LoginSuccess.emit();
    localStorage.setItem(ETRANSFER_USER_ACCOUNT, JSON.stringify(accounts));
  }, [accounts]);

  const handleGetSignature = useCallback(async () => {
    if (!walletInfo) return;
    const plainTextOrigin = `Welcome to ETransfer!

Click to sign in and accept the ETransfer Terms of Service (https://etransfer.gitbook.io/docs/more-information/terms-of-service) and Privacy Policy (https://etransfer.gitbook.io/docs/more-information/privacy-policy).

This request will not trigger a blockchain transaction or cost any gas fees.

Nonce:
${Date.now()}`;
    const plainText: any = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
    let signResult: {
      error: number;
      errorMessage: string;
      signature: string;
      from: string;
    } | null;
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

    if (signResult?.error) throw signResult.errorMessage;

    console.log('getSignature');

    if (signResult?.error) throw signResult.errorMessage;

    return { signature: signResult?.signature || '', plainText };
  }, [getSignature, walletInfo, walletType]);

  const getUserInfo = useCallback(
    async (isCheckReCaptcha: boolean = true) => {
      if (!walletInfo) throw new Error('Failed to obtain wallet information.');
      if (!isLoginRef.current) throw new Error('You are not logged in.');

      let reCaptchaToken = undefined;
      if (isCheckReCaptcha && walletType === WalletTypeEnum.elf) {
        reCaptchaToken = await getETransferReCaptcha(walletInfo.address);
      }

      try {
        const { caHash, originChainId } = await getCaHashAndOriginChainIdByWallet(walletInfo as WalletInfo, walletType);
        localStorage.setItem(ETRANSFER_USER_CA_HASH, caHash);
        localStorage.setItem(ETRANSFER_USER_ORIGIN_CHAIN_ID, originChainId);

        const signatureResult = await handleGetSignature();
        if (!signatureResult) throw Error('Signature error');
        const pubkey = recoverPubKeyBySignature(signatureResult.plainText, signatureResult.signature) + '';
        const managerAddress = recoverManagerAddressByPubkey(pubkey);
        localStorage.setItem(ETRANSFER_USER_MANAGER_ADDRESS, managerAddress);
        console.log('>>>>>> user information:', {
          pubkey,
          signature: signatureResult.signature,
          plainText: signatureResult.plainText,
          caHash,
          originChainId,
          managerAddress: managerAddress,
        });

        return {
          pubkey,
          signature: signatureResult.signature,
          plainText: signatureResult.plainText,
          caHash,
          originChainId,
          managerAddress: managerAddress,
          recaptchaToken: reCaptchaToken || undefined,
        };
      } catch (error) {
        throw new Error('Failed to obtain user information');
      }
    },
    [handleGetSignature, walletInfo, walletType],
  );

  const getAuthToken = useCallback(async () => {
    if (!walletInfo) throw new Error('Failed to obtain wallet information.');
    if (!isLoginRef.current) throw new Error('You are not logged in.');
    try {
      const { pubkey, signature, plainText, caHash, managerAddress, originChainId, recaptchaToken } =
        await getUserInfo();
      const jwt = await eTransferCore.getAuthToken({
        pubkey,
        signature,
        plainText,
        caHash,
        chainId: originChainId,
        managerAddress,
        version: PortkeyVersion.v2,
        source: walletType === WalletTypeEnum.elf ? AuthTokenSource.NightElf : AuthTokenSource.Portkey,
        recaptchaToken: walletType === WalletTypeEnum.elf ? recaptchaToken : undefined,
      });

      ETransferConfig.setConfig({
        authorization: {
          jwt,
        },
      });

      loginSuccessActive();
    } catch (error) {
      throw error || new Error('Failed to obtain etransfer authorization.');
    }
  }, [getUserInfo, loginSuccessActive, walletInfo, walletType]);

  return { getAuthToken, getUserInfo, loginSuccessActive };
}
