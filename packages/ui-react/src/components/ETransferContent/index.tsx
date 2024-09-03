import clsx from 'clsx';
import { ComponentStyle, PageKey, SideMenuKey } from '../../types';
import './index.less';
import { Layout as AntdLayout } from 'antd';
import Header from '../Header';
import GlobalLoading from '../GlobalLoading';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ETransferDepositProvider, useETransferDeposit } from '../../context/ETransferDepositProvider';
import Deposit from '../Deposit';
import { ETransferWithdrawProvider, useETransferWithdraw } from '../../context/ETransferWithdrawProvider';
import { getAccountInfo, TelegramPlatform } from '../../utils';
import WebSider from './WebSider';
import Withdraw from '../Withdraw';
import History from '../History';
import { AccountAddressProps } from '../Header/UserProfile/AccountAddress';
import { etransferEvents } from '@etransfer/utils';
import { useUpdateRecord } from '../../hooks/updateRecord';
import TransferDetail from '../TransferDetail';
import { useNoticeSocket } from '../../hooks/notice';

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
  const [activePageKey, setActivePageKey] = useState(PageKey.Deposit);
  const [accountList, setAccountList] = useState<AccountAddressProps['accountList']>([]);
  const isTelegramPlatform = TelegramPlatform.isTelegramPlatform();
  const showHeader = useMemo(() => {
    return isShowHeader && !(activePageKey === PageKey.TransferDetail && componentStyle === ComponentStyle.Mobile);
  }, [activePageKey, componentStyle, isShowHeader]);

  const handleMenuChange = useCallback((key: SideMenuKey) => {
    setActiveMenuKey(key);
    etransferEvents.DisplayNewPage.emit(key as unknown as PageKey);
  }, []);

  const handleTransferDetailBack = useCallback(() => {
    setActiveMenuKey(SideMenuKey.History);
    etransferEvents.DisplayNewPage.emit(PageKey.History);
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

  useNoticeSocket();

  const [{ depositProcessingCount }] = useETransferDeposit();
  const [{ withdrawProcessingCount }] = useETransferWithdraw();
  const handleClickProcessingTip = useCallback(() => {
    setActiveMenuKey(SideMenuKey.History);
    setActivePageKey(PageKey.History);
  }, []);

  const [transferDetailId, setTransferDetailId] = useState('');
  const handleClickHistoryItem = useCallback((id: string) => {
    setTransferDetailId(id);
    setActiveMenuKey(SideMenuKey.History);
    setActivePageKey(PageKey.TransferDetail);
  }, []);

  // TODO socket UnsubscribeUserOrderRecord
  useEffect(() => {
    const { remove: eTransferConfigUpdatedRemove } = etransferEvents.ETransferConfigUpdated.addListener(() => {
      console.log('update userInfo');
      getAccountListRef.current();
    });
    const { remove: setPageRemove } = etransferEvents.DisplayNewPage.addListener((pageKey) => {
      setActivePageKey(pageKey);
    });

    return () => {
      eTransferConfigUpdatedRemove();
      setPageRemove();
    };
  }, []);

  const isUnreadHistory = useUpdateRecord();

  return (
    <AntdLayout id="etransferContentLayout" className={clsx('etransfer-ui-content-layout', className)}>
      {showHeader && (
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
                {activePageKey === PageKey.Deposit && (
                  <Deposit
                    componentStyle={componentStyle}
                    isShowErrorTip={isShowErrorTip}
                    isShowMobilePoweredBy={true}
                    isShowProcessingTip={true}
                    withdrawProcessingCount={withdrawProcessingCount}
                    onClickProcessingTip={handleClickProcessingTip}
                  />
                )}
                {activePageKey === PageKey.Withdraw && (
                  <Withdraw
                    componentStyle={componentStyle}
                    isShowMobilePoweredBy={true}
                    isShowErrorTip={isShowErrorTip}
                    isShowProcessingTip={true}
                    depositProcessingCount={depositProcessingCount}
                    onClickProcessingTip={handleClickProcessingTip}
                  />
                )}
                {activePageKey === PageKey.History && (
                  <History
                    componentStyle={componentStyle}
                    isUnreadHistory={isUnreadHistory}
                    isShowMobilePoweredBy={true}
                    onClickHistoryItem={handleClickHistoryItem}
                  />
                )}
                {activePageKey === PageKey.TransferDetail && (
                  <TransferDetail
                    componentStyle={componentStyle}
                    isShowBackElement={true}
                    orderId={transferDetailId}
                    onBack={handleTransferDetailBack}
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
