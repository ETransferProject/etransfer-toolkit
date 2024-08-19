import clsx from 'clsx';
import { ComponentStyle, SideMenuKey } from '../../types';
import './index.less';
import { Layout as AntdLayout } from 'antd';
import Header from '../Header';
import GlobalLoading from '../GlobalLoading';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ETransferDepositProvider } from '../../context/ETransferDepositProvider';
import Deposit from '../Deposit';
import { ETransferWithdrawProvider } from '../../context/ETransferWithdrawProvider';
import { getAccountInfo, TelegramPlatform } from '../../utils';
import WebSider from './WebSider';
import Withdraw from '../Withdraw';
import History from '../History';
import { AccountAddressProps } from '../Header/UserProfile/AccountAddress';
import { etransferEvents } from '@etransfer/utils';
import { useUpdateRecord } from '../../hooks/updateRecord';

export default function ETransferContent({
  className,
  componentStyle,
  isCanClickHeaderLogo = true,
  isShowHeader = true,
  isShowHeaderUserProfile = true,
  isShowSider = true,
  isShowMobileFooter = false,
  isShowErrorTip = true,
  onClickHeaderLogo,
}: {
  className?: string;
  componentStyle: ComponentStyle;
  isCanClickHeaderLogo?: boolean;
  isShowHeader?: boolean;
  isShowHeaderUserProfile?: boolean;
  isShowSider?: boolean;
  isShowMobileFooter?: boolean;
  isShowErrorTip?: boolean;
  onClickHeaderLogo?: () => void;
}) {
  const [activeMenuKey, setActiveMenuKey] = useState(SideMenuKey.Deposit);
  const [accountList, setAccountList] = useState<AccountAddressProps['accountList']>([]);
  const isTelegramPlatform = TelegramPlatform.isTelegramPlatform();

  const handleMenuChange = useCallback((key: SideMenuKey) => {
    setActiveMenuKey(key);
  }, []);

  const getAccountList = useCallback(() => {
    const accountInfo = getAccountInfo();
    const accounts: any = accountInfo.accounts;
    const temp: AccountAddressProps['accountList'] = [];
    Object.keys(accounts)?.forEach((key) => {
      if (accounts?.[key]) {
        temp.push({
          label: key,
          value: accounts?.[key],
        });
      }
    }, []);
    setAccountList(temp);
  }, []);
  const getAccountListRef = useRef(getAccountList);
  getAccountListRef.current = getAccountList;

  useEffect(() => {
    const { remove } = etransferEvents.ETransferConfigUpdated.addListener(() => {
      console.log('update userInfo');
      getAccountListRef.current();
    });
    return () => {
      remove();
    };
  }, []);

  const isUnreadHistory = useUpdateRecord();

  return (
    <AntdLayout id="etransferContentLayout" className={clsx('etransfer-ui-content-layout', className)}>
      {isShowHeader && (
        <Header
          componentStyle={componentStyle}
          activeMenuKey={activeMenuKey}
          accountList={accountList}
          isUnreadHistory={isUnreadHistory}
          isShowMobileFooter={isShowMobileFooter}
          onChange={handleMenuChange}
          isCanClickLogo={isCanClickHeaderLogo}
          isShowUserProfile={isShowHeaderUserProfile}
          onClickLogo={onClickHeaderLogo}
        />
      )}
      <div className={clsx('etransfer-ui-flex-row', 'etransfer-ui-content-layout-body')}>
        {isShowSider && componentStyle === ComponentStyle.Web && (
          <WebSider activeMenuKey={activeMenuKey} isUnreadHistory={isUnreadHistory} onChange={handleMenuChange} />
        )}
        <div className={clsx('etransfer-web-content', !isTelegramPlatform && 'etransfer-web-content-not-tg')}>
          <Suspense fallback={<GlobalLoading />}>
            <ETransferDepositProvider>
              <ETransferWithdrawProvider>
                {activeMenuKey === SideMenuKey.Deposit && (
                  <Deposit
                    componentStyle={componentStyle}
                    isShowErrorTip={isShowErrorTip}
                    isShowMobilePoweredBy={true}
                  />
                )}
                {activeMenuKey === SideMenuKey.Withdraw && (
                  <Withdraw
                    componentStyle={componentStyle}
                    isShowMobilePoweredBy={true}
                    isShowErrorTip={isShowErrorTip}
                  />
                )}
                {activeMenuKey === SideMenuKey.History && (
                  <History
                    componentStyle={componentStyle}
                    isUnreadHistory={isUnreadHistory}
                    isShowMobilePoweredBy={true}
                  />
                )}
              </ETransferWithdrawProvider>
            </ETransferDepositProvider>
          </Suspense>
        </div>
      </div>
    </AntdLayout>
  );
}
