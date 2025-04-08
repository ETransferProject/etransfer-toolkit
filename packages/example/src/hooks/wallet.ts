import { SupportedChainId } from '@/constants';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { TAelfAccounts, SingleMessage } from '@etransfer/ui-react';
import { handleWebLoginErrorMessage } from '@etransfer/utils';
import { useMemo, useCallback } from 'react';

export function useIsLogin() {
  const { isConnected, walletInfo, isLocking } = useConnectWallet();
  return useMemo(() => {
    console.warn('>>>>>>', 'isConnected:', isConnected, 'isLocking:', isLocking, 'walletInfo:', walletInfo);
    return isConnected && !!walletInfo;
  }, [isConnected, isLocking, walletInfo]);
}

export function useLogin() {
  const { connectWallet } = useConnectWallet();
  const isLogin = useIsLogin();

  return useCallback(async () => {
    if (isLogin) return;

    try {
      await connectWallet();
    } catch (error) {
      SingleMessage.error(handleWebLoginErrorMessage(error));
    }
  }, [connectWallet, isLogin]);
}

export function useGetAccount() {
  const { walletInfo } = useConnectWallet();
  const isLogin = useIsLogin();

  // WalletInfo TAelfAccounts ExtraInfoForDiscoverAndWeb | ExtraInfoForNightElf;
  return useMemo(() => {
    if (!isLogin) return undefined;

    const accounts: TAelfAccounts = {
      [SupportedChainId.mainChain]: 'ELF_' + walletInfo?.address + '_' + SupportedChainId.mainChain,
      [SupportedChainId.sideChain]: 'ELF_' + walletInfo?.address + '_' + SupportedChainId.sideChain,
    };

    return accounts;
  }, [isLogin, walletInfo]);
}
