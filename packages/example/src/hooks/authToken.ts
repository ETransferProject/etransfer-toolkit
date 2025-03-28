import { useCallback, useRef } from 'react';
import { etransferEvents, recoverManagerAddressByPubkey, recoverPubKeyBySignature } from '@etransfer/utils';
import { AuthTokenSource, PortkeyVersion, TWalletType } from '@etransfer/types';
import { eTransferCore } from '@/utils/core';
import {
  ETRANSFER_USER_ACCOUNT,
  ETRANSFER_USER_CA_HASH,
  ETRANSFER_USER_ORIGIN_CHAIN_ID,
  ETRANSFER_USER_MANAGER_ADDRESS,
} from '@/constants/storage';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/wallet';
import { ETransferConfig, WalletTypeEnum, useReCaptchaModal } from '@etransfer/ui-react';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { useGetAccount, useIsLogin } from './wallet';
import { WalletInfo } from '@/types/wallet';
import { useGetManagerSignature } from './useGetManagerSignature';

export function useQueryAuthToken() {
  const { walletType, walletInfo } = useConnectWallet();
  const getManagerSignature = useGetManagerSignature();
  const isLogin = useIsLogin();
  const isLoginRef = useRef(isLogin);
  isLoginRef.current = isLogin;
  const accounts = useGetAccount();
  const accountsRef = useRef(accounts);
  accountsRef.current = accounts;
  const getReCaptcha = useReCaptchaModal();

  const loginSuccessActive = useCallback(() => {
    console.log('%c login success and emit event', 'color: green');
    etransferEvents.LoginSuccess.emit();
    localStorage.setItem(ETRANSFER_USER_ACCOUNT, JSON.stringify(accounts));
  }, [accounts]);

  const handleGetSignature = useCallback(async () => {
    if (!walletInfo || !walletInfo.address) return;
    const plainTextOrigin = `Welcome to ETransfer!

Click to sign in and accept the ETransfer Terms of Service (https://etransfer.gitbook.io/docs/more-information/terms-of-service) and Privacy Policy (https://etransfer.gitbook.io/docs/more-information/privacy-policy).

This request will not trigger a blockchain transaction or cost any gas fees.

Nonce:
${Date.now()}`;
    const plainText: any = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
    const signResult = await getManagerSignature(plainText);

    if (signResult?.error) throw signResult.errorMessage;

    console.log('getSignature');

    if (signResult?.error) throw signResult.errorMessage;

    return { signature: signResult?.signature || '', plainText };
  }, [getManagerSignature, walletInfo]);

  const getUserInfo = useCallback(
    async (isCheckReCaptcha: boolean = true) => {
      if (!walletInfo || !walletInfo.address) throw new Error('Failed to obtain wallet information.');
      if (!isLoginRef.current) throw new Error('You are not logged in.');

      let reCaptchaToken = undefined;
      if (isCheckReCaptcha && walletType === WalletTypeEnum.elf) {
        // 1. need to add your dapp's domain
        // reCaptchaToken = await getETransferReCaptcha(walletInfo.address);
        // 2. don't need to add your dapp's domain
        reCaptchaToken = await getReCaptcha({ open: true, walletAddress: walletInfo.address });
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
    [getReCaptcha, handleGetSignature, walletInfo, walletType],
  );

  const getAuthToken = useCallback(async () => {
    if (!walletInfo) throw new Error('Failed to obtain wallet information.');
    if (!isLoginRef.current) throw new Error('You are not logged in.');
    try {
      const source = walletType === WalletTypeEnum.elf ? AuthTokenSource.NightElf : AuthTokenSource.Portkey;
      const _caHash = localStorage.getItem(ETRANSFER_USER_CA_HASH);
      const _managerAddress = localStorage.getItem(ETRANSFER_USER_MANAGER_ADDRESS);
      // 1: local storage has JWT token
      let jwt = await eTransferCore.getAuthTokenFromStorage({
        walletType: (source as unknown as TWalletType) || TWalletType.Portkey,
        caHash: _caHash || undefined,
        managerAddress: _managerAddress || '',
      });
      if (!jwt) {
        const { pubkey, signature, plainText, caHash, managerAddress, originChainId, recaptchaToken } =
          await getUserInfo();
        // 2: local storage don not has JWT token
        jwt = await eTransferCore.getAuthTokenFromApi({
          pubkey,
          signature,
          plain_text: plainText,
          ca_hash: caHash || undefined,
          chain_id: originChainId || undefined,
          managerAddress,
          version: PortkeyVersion.v2,
          source: source,
          recaptchaToken: walletType === WalletTypeEnum.elf ? recaptchaToken : undefined,
        });
      }

      // const jwt = await eTransferCore.getAuthToken({
      //   pubkey,
      //   signature,
      //   plainText,
      //   caHash,
      //   chainId: originChainId,
      //   managerAddress,
      //   version: PortkeyVersion.v2,
      //   source: walletType === WalletTypeEnum.elf ? AuthTokenSource.NightElf : AuthTokenSource.Portkey,
      //   recaptchaToken: walletType === WalletTypeEnum.elf ? recaptchaToken : undefined,
      // });

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
