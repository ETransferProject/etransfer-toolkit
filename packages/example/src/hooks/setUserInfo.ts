import { ETRANSFER_USER_MANAGER_ADDRESS } from '@/constants/storage';
import { useGetAccount, useIsLogin } from '@/hooks/wallet';
import { WalletInfo } from '@/types/wallet';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/wallet';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { ETransferConfig, WalletTypeEnum } from '@etransfer/ui-react';
import { etransferEvents, removeELFAddressSuffix } from '@etransfer/utils';
import { useCallback, useEffect, useRef } from 'react';
import { useGetTransactionSignature } from './useGetTransactionSignature';
import { APP_NAME } from '@/constants';

export function useSetUserInfo() {
  const { walletInfo, walletType, callSendMethod, getSignature } = useConnectWallet();
  const getTransactionSignature = useGetTransactionSignature();
  const isLogin = useIsLogin();
  const isLoginRef = useRef(isLogin);
  isLoginRef.current = isLogin;
  const accounts = useGetAccount();
  const accountsRef = useRef(accounts);
  accountsRef.current = accounts;

  const setUserInfo = useCallback(async () => {
    if (!accounts) return;
    const managerAddress = localStorage.getItem(ETRANSFER_USER_MANAGER_ADDRESS) || '';
    const ownerAddress = walletInfo?.address || '';
    const { caHash } = await getCaHashAndOriginChainIdByWallet(walletInfo as WalletInfo, walletType);

    ETransferConfig.setConfig({
      accountInfo: {
        tokenContractCallSendMethod: params => {
          const paramsFormat: any = params;
          paramsFormat.args['networkType'] = ETransferConfig.getConfig('networkType');
          return callSendMethod(params);
        },
        getSignature: signInfo =>
          getSignature({
            signInfo,
            appName: APP_NAME,
            address: removeELFAddressSuffix(ownerAddress),
          }),
        getTransactionSignature: signInfo => getTransactionSignature(signInfo),
        walletType: walletType,
        accounts: accounts,
        managerAddress: walletType === WalletTypeEnum.elf ? ownerAddress : managerAddress,
        caHash: caHash,
      },
    });
    console.log('>>>>>> ETransferConfig.getAllConfig', ETransferConfig.getAllConfig());
    // etransferEvents.ETransferConfigUpdated.emit();
  }, [accounts, callSendMethod, getSignature, getTransactionSignature, walletInfo, walletType]);
  const setUserInfoRef = useRef(setUserInfo);
  setUserInfoRef.current = setUserInfo;

  useEffect(() => {
    const { remove } = etransferEvents.LoginSuccess.addListener(() => setUserInfoRef.current());
    return () => {
      remove();
    };
  }, [accounts, isLogin, setUserInfo]);
}
