'use client';

import { APP_NAME } from '@/constants';
import { ETRANSFER_USER_MANAGER_ADDRESS } from '@/constants/storage';
import { useGetAccount, useIsLogin } from '@/hooks/wallet';
import { WalletInfo } from '@/types/wallet';
import { getCaHashAndOriginChainIdByWallet } from '@/utils/wallet';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import {
  CommonSpace,
  ComponentStyle,
  Withdraw,
  ETransferWithdrawProvider,
  useScreenSize,
  ETransferConfig,
  WalletTypeEnum,
} from '@etransfer/ui-react';
import { removeELFAddressSuffix } from '@etransfer/utils';
import { useCallback, useEffect, useRef } from 'react';

export default function DepositPage() {
  const { walletInfo, walletType, callSendMethod, getSignature } = useConnectWallet();
  const { isPadPX } = useScreenSize();
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
        tokenContractCallSendMethod: params => callSendMethod(params),
        getSignature: signInfo =>
          getSignature({
            signInfo,
            appName: APP_NAME,
            address: removeELFAddressSuffix(ownerAddress),
          }),
        walletType: walletType,
        accounts: accounts,
        managerAddress: walletType === WalletTypeEnum.elf ? ownerAddress : managerAddress,
        caHash: caHash,
      },
    });
  }, [accounts, callSendMethod, getSignature, walletInfo, walletType]);

  useEffect(() => {
    if (isLogin) {
      setUserInfo();
    }
  }, [accounts, isLogin, setUserInfo]);

  return (
    <ETransferWithdrawProvider>
      <CommonSpace direction={'vertical'} size={24} />
      <Withdraw componentStyle={isPadPX ? ComponentStyle.Mobile : ComponentStyle.Web} />
    </ETransferWithdrawProvider>
  );
}
