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

export default function ETransferContent({
  componentStyle,
  isCanClickHeaderLogo = true,
  isShowHeader = true,
  isShowSider = true,
  isShowMobileFooter,
  onClickHeaderLogo,
}: {
  componentStyle: ComponentStyle;
  isCanClickHeaderLogo?: boolean;
  isShowHeader?: boolean;
  isShowSider?: boolean;
  isShowMobileFooter?: boolean;
  onClickHeaderLogo?: () => void;
}) {
  const [activeMenuKey, setActiveMenuKey] = useState(SideMenuKey.Deposit);
  const [accountList, setAccountList] = useState<AccountAddressProps['accountList']>([]);
  const [isUnreadHistory, setIsUnreadHistory] = useState<boolean>(false);
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

  return (
    <AntdLayout id="etransferContentLayout" className={clsx('etransfer-ui-content-layout')}>
      {isShowHeader && (
        <Header
          componentStyle={componentStyle}
          activeMenuKey={activeMenuKey}
          accountList={accountList}
          isUnreadHistory={isUnreadHistory}
          isShowMobileFooter={isShowMobileFooter}
          onChange={handleMenuChange}
          isCanClickLogo={isCanClickHeaderLogo}
          onClickLogo={onClickHeaderLogo}
        />
      )}
      <div className={clsx('etransfer-ui-flex-row', 'etransfer-ui-content-layout-body')}>
        {isShowSider && componentStyle === ComponentStyle.Web && (
          <WebSider activeMenuKey={activeMenuKey} isUnreadHistory={isUnreadHistory} onChange={handleMenuChange} />
        )}
        <div className={clsx('etransfer-web-content', !isTelegramPlatform && 'etransfer-web-content-not-tg')}>
          <Suspense fallback={<GlobalLoading />}>
            {activeMenuKey === SideMenuKey.Deposit && (
              <ETransferDepositProvider>
                <Deposit componentStyle={componentStyle} />
              </ETransferDepositProvider>
            )}
            {activeMenuKey === SideMenuKey.Withdraw && (
              <ETransferWithdrawProvider>
                <Withdraw componentStyle={componentStyle} />
              </ETransferWithdrawProvider>
            )}
            {activeMenuKey === SideMenuKey.History && (
              <History componentStyle={componentStyle} isUnreadHistory={isUnreadHistory} />
            )}
          </Suspense>
        </div>
      </div>
    </AntdLayout>
  );
}
