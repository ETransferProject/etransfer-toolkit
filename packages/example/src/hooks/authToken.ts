import AElf from 'aelf-sdk';
import { GetCAHolderByManagerParams } from '@portkey/services';
import { Accounts, ChainId } from '@portkey/provider-types';
import { useWebLogin, WebLoginState, WalletType, PortkeyDid } from 'aelf-web-login';
import { SupportedChainId, AppName } from '@/constants/index';
import { useCallback } from 'react';
import { recoverManagerAddressByPubkey, recoverPubKeyBySignature } from '@etransfer/utils';
import { PortkeyVersion } from '@etransfer/types';
import { eTransferCore } from '@/utils/core';
import {
  ETRANSFER_USER_ACCOUNT,
  ETRANSFER_USER_CA_HASH,
  ETRANSFER_USER_ORIGIN_CHAIN_ID,
  ETRANSFER_USER_MANAGER_ADDRESS,
} from '@/constants/storage';

export function useQueryAuthToken() {
  const { loginState, wallet, getSignature, walletType } = useWebLogin();

  const loginSuccessActive = useCallback(() => {
    const { portkeyInfo, discoverInfo } = wallet;
    // portkey is string or discover is string[] -> string[]
    let accounts: Accounts = {};
    if (walletType === WalletType.discover) {
      accounts = discoverInfo?.accounts || {};
    }
    if (walletType === WalletType.portkey) {
      // portkey address need manual setup: 'ELF_' + address + '_' + chainId
      const isMainChainAddress = portkeyInfo?.accounts?.[SupportedChainId.mainChain];
      const istSideChainAddress = portkeyInfo?.accounts?.[SupportedChainId.sideChain];

      if (accounts && isMainChainAddress && !istSideChainAddress) {
        const baseAddress = 'ELF_' + portkeyInfo?.accounts?.[SupportedChainId.mainChain] + '_';
        accounts[SupportedChainId.mainChain] = [baseAddress + SupportedChainId.mainChain];
        accounts[SupportedChainId.sideChain] = [baseAddress + SupportedChainId.sideChain];
      } else if (accounts && !isMainChainAddress && istSideChainAddress) {
        const baseAddress = 'ELF_' + portkeyInfo?.accounts?.[SupportedChainId.sideChain] + '_';
        accounts[SupportedChainId.mainChain] = [baseAddress + SupportedChainId.mainChain];
        accounts[SupportedChainId.sideChain] = [baseAddress + SupportedChainId.sideChain];
      }
      if (isMainChainAddress && istSideChainAddress) {
        accounts[SupportedChainId.mainChain] = ['ELF_' + isMainChainAddress + '_' + SupportedChainId.mainChain];
        accounts[SupportedChainId.sideChain] = ['ELF_' + istSideChainAddress + '_' + SupportedChainId.sideChain];
      }
    }
    localStorage.setItem(ETRANSFER_USER_ACCOUNT, JSON.stringify(accounts));
  }, [wallet, walletType]);

  const getUserInfo = useCallback(async () => {
    if (!wallet) throw new Error('Failed to obtain wallet information.');
    if (loginState !== WebLoginState.logined) throw new Error('You are not logged in.');
    let caHash = '';
    const address = wallet.address;
    let originChainId: ChainId = SupportedChainId.sideChain;
    if (walletType === WalletType.discover) {
      try {
        const res = await PortkeyDid.did.services.getHolderInfoByManager({
          caAddresses: [address],
        } as unknown as GetCAHolderByManagerParams);
        const caInfo = res[0];
        caHash = caInfo?.caHash || '';
        originChainId = (caInfo?.chainId as ChainId) || SupportedChainId.sideChain;
      } catch (error) {
        throw new Error('Failed to obtain holder information');
      }
    }
    if (walletType === WalletType.portkey) {
      caHash = wallet.portkeyInfo?.caInfo?.caHash || '';
      originChainId = wallet.portkeyInfo?.chainId || SupportedChainId.sideChain;
    }
    localStorage.setItem(ETRANSFER_USER_CA_HASH, caHash);
    localStorage.setItem(ETRANSFER_USER_ORIGIN_CHAIN_ID, originChainId);
    try {
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
      const result = await getSignature({
        appName: AppName,
        address: wallet.address,
        signInfo,
      });
      console.log('>>>>>> signature', result);
      if (result.error) throw result.errorMessage;
      const signature = result?.signature || '';
      const pubkey = recoverPubKeyBySignature(plainText, signature) + '';
      const managerAddress = recoverManagerAddressByPubkey(pubkey);
      localStorage.setItem(ETRANSFER_USER_MANAGER_ADDRESS, managerAddress);
      return {
        pubkey,
        signature,
        plainText,
        caHash,
        originChainId,
        managerAddress: managerAddress,
      };
    } catch (error) {
      throw new Error('Failed to obtain user information');
    }
  }, [getSignature, loginState, wallet, walletType]);

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
      });

      loginSuccessActive();
    } catch (error) {
      throw error || new Error('Failed to obtain etransfer authorization.');
    }
  }, [getUserInfo, loginState, loginSuccessActive, wallet]);

  return { getAuthToken, getUserInfo, loginSuccessActive };
}
