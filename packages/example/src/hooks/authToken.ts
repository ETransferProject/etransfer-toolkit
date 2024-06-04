import AElf from 'aelf-sdk';
import { Accounts } from '@portkey/provider-types';
import { useWebLogin, WebLoginState, WalletType } from 'aelf-web-login';
import { SupportedChainId, AppName, ETRANSFER_URL } from '@/constants/index';
import { useCallback, useRef } from 'react';
import { recoverManagerAddressByPubkey, recoverPubKeyBySignature } from '@etransfer/utils';
import { AuthTokenSource, PortkeyVersion } from '@etransfer/types';
import { eTransferCore } from '@/utils/core';
import {
  ETRANSFER_USER_ACCOUNT,
  ETRANSFER_USER_CA_HASH,
  ETRANSFER_USER_ORIGIN_CHAIN_ID,
  ETRANSFER_USER_MANAGER_ADDRESS,
} from '@/constants/storage';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/wallet';

export function useQueryAuthToken() {
  const { loginState, wallet, getSignature, walletType } = useWebLogin();

  const handlePortkeyAccount = useCallback(() => {
    const accounts: Accounts = {};
    // portkey address need manual setup: 'ELF_' + address + '_' + chainId
    const isMainChainAddress = wallet.portkeyInfo?.accounts?.[SupportedChainId.mainChain];
    const istSideChainAddress = wallet.portkeyInfo?.accounts?.[SupportedChainId.sideChain];

    if (accounts && isMainChainAddress && !istSideChainAddress) {
      const baseAddress = 'ELF_' + wallet.portkeyInfo?.accounts?.[SupportedChainId.mainChain] + '_';
      accounts[SupportedChainId.mainChain] = [baseAddress + SupportedChainId.mainChain];
      accounts[SupportedChainId.sideChain] = [baseAddress + SupportedChainId.sideChain];
    } else if (accounts && !isMainChainAddress && istSideChainAddress) {
      const baseAddress = 'ELF_' + wallet.portkeyInfo?.accounts?.[SupportedChainId.sideChain] + '_';
      accounts[SupportedChainId.mainChain] = [baseAddress + SupportedChainId.mainChain];
      accounts[SupportedChainId.sideChain] = [baseAddress + SupportedChainId.sideChain];
    }
    if (isMainChainAddress && istSideChainAddress) {
      accounts[SupportedChainId.mainChain] = ['ELF_' + isMainChainAddress + '_' + SupportedChainId.mainChain];
      accounts[SupportedChainId.sideChain] = ['ELF_' + istSideChainAddress + '_' + SupportedChainId.sideChain];
    }
    return accounts;
  }, [wallet.portkeyInfo?.accounts]);

  const handleNightElfAccount = useCallback(() => {
    const accounts: Accounts = {};
    if (wallet.nightElfInfo?.account) {
      accounts[SupportedChainId.mainChain] = ['ELF_' + wallet.nightElfInfo?.account + '_' + SupportedChainId.mainChain];
      accounts[SupportedChainId.sideChain] = ['ELF_' + wallet.nightElfInfo?.account + '_' + SupportedChainId.sideChain];
    }

    return accounts;
  }, [wallet.nightElfInfo?.account]);

  const loginSuccessActive = useCallback(() => {
    const { discoverInfo } = wallet;
    // portkey is string or discover is string[] -> string[]
    let accounts: Accounts = {};
    if (walletType === WalletType.discover) {
      accounts = discoverInfo?.accounts || {};
    }
    if (walletType === WalletType.portkey) {
      accounts = handlePortkeyAccount();
    }
    if (walletType === WalletType.elf) {
      accounts = handleNightElfAccount();
    }
    localStorage.setItem(ETRANSFER_USER_ACCOUNT, JSON.stringify(accounts));
  }, [handleNightElfAccount, handlePortkeyAccount, wallet, walletType]);

  const handleGetSignature = useCallback(async () => {
    const plainTextOrigin = `Nonce:${Date.now()}`;
    const plainText: any = Buffer.from(plainTextOrigin).toString('hex').replace('0x', '');
    let signInfo: string;
    if (walletType !== WalletType.portkey) {
      // nightElf or discover
      signInfo = AElf.utils.sha256(plainText);
    } else {
      // portkey sdk
      signInfo = Buffer.from(plainText).toString('hex');
    }
    console.log('getSignature');
    const result = await getSignature({
      appName: AppName,
      address: wallet.address,
      signInfo,
    });
    if (result.error) throw result.errorMessage;

    return { signature: result?.signature || '', plainText };
  }, [getSignature, wallet.address, walletType]);

  const handleReCaptcha = useCallback(async (): Promise<any> => {
    if (walletType === WalletType.elf) {
      const isRegistered = await eTransferCore.services.checkEOARegistration({ address: wallet.address });
      return new Promise((resolve, reject) => {
        if (!isRegistered.result) {
          window.open(ETRANSFER_URL + '/recaptcha');
          window.onmessage = function (event) {
            if (event.data.type === 'GOOGLE_RECAPTCHA_RESULT') {
              resolve(event.data.data);
            } else {
              reject(event.data.data);
            }
          };
        }
        resolve(undefined);
      });
    }
  }, [wallet.address, walletType]);

  const getUserInfo = useCallback(
    async (isCheckReCaptcha: boolean = true) => {
      if (!wallet) throw new Error('Failed to obtain wallet information.');
      if (loginState !== WebLoginState.logined) throw new Error('You are not logged in.');

      let reCaptchaToken = undefined;
      if (isCheckReCaptcha) {
        reCaptchaToken = await handleReCaptcha();
      }

      const { caHash, originChainId } = await getCaHashAndOriginChainIdByWallet(wallet, walletType);
      localStorage.setItem(ETRANSFER_USER_CA_HASH, caHash);
      localStorage.setItem(ETRANSFER_USER_ORIGIN_CHAIN_ID, originChainId);
      try {
        const signatureResult = await handleGetSignature();
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
    [handleGetSignature, handleReCaptcha, loginState, wallet, walletType],
  );

  const getAuthToken = useCallback(async () => {
    if (!wallet) throw new Error('Failed to obtain wallet information.');
    if (loginState !== WebLoginState.logined) throw new Error('You are not logged in.');
    try {
      const { pubkey, signature, plainText, caHash, managerAddress, originChainId } = await getUserInfo();
      await eTransferCore.getAuthToken({
        pubkey,
        signature,
        plainText,
        caHash,
        chainId: originChainId,
        managerAddress,
        version: PortkeyVersion.v2,
        source: walletType === WalletType.elf ? AuthTokenSource.NightElf : AuthTokenSource.Portkey,
      });

      loginSuccessActive();
    } catch (error) {
      throw error || new Error('Failed to obtain etransfer authorization.');
    }
  }, [getUserInfo, loginState, loginSuccessActive, wallet, walletType]);

  return { getAuthToken, getUserInfo, loginSuccessActive };
}
