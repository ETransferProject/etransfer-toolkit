import clsx from 'clsx';
import { ComponentStyle, SideMenuKey } from '../../types';
import './index.less';
import { Layout as AntdLayout } from 'antd';
import Header from '../Header';
import GlobalLoading from '../GlobalLoading';
import { Suspense, useCallback, useState } from 'react';
import { ETransferDepositProvider } from '../../context/ETransferDepositProvider';
import CommonSpace from '../CommonSpace';
import Deposit from '../Deposit';
import { ETransferWithdrawProvider } from '../../context/ETransferWithdrawProvider';
import { TelegramPlatform } from '../../utils';
import WebSider from './WebSider';

export default function ETransferContent({
  componentStyle,
  isCanClickHeaderLogo = true,
  isShowHeader = true,
  isShowSider = true,
  onClickHeaderLogo,
}: {
  componentStyle: ComponentStyle;
  isCanClickHeaderLogo?: boolean;
  isShowHeader?: boolean;
  isShowSider?: boolean;
  onClickHeaderLogo?: () => void;
}) {
  const [activeMenuKey, setActiveMenuKey] = useState(SideMenuKey.Deposit);
  const [isUnreadHistory, setIsUnreadHistory] = useState<boolean>(false);
  const isTelegramPlatform = TelegramPlatform.isTelegramPlatform();

  const handleMenuChange = useCallback((key: SideMenuKey) => {
    setActiveMenuKey(key);
  }, []);

  return (
    <AntdLayout id="etransferContentLayout" className={clsx('etransfer-ui-content-layout')}>
      {isShowHeader && (
        <Header
          componentStyle={componentStyle}
          activeMenuKey={activeMenuKey}
          isUnreadHistory={isUnreadHistory}
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
                <CommonSpace direction={'vertical'} size={24} />
                <Deposit componentStyle={componentStyle} />
              </ETransferDepositProvider>
            )}
            {activeMenuKey === SideMenuKey.Withdraw && (
              <ETransferWithdrawProvider>
                <CommonSpace direction={'vertical'} size={24} />
                <Deposit componentStyle={componentStyle} />
              </ETransferWithdrawProvider>
            )}
            {activeMenuKey === SideMenuKey.History && (
              <div>
                <CommonSpace direction={'vertical'} size={24} />
                <Deposit componentStyle={componentStyle} />
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </AntdLayout>
  );
}
