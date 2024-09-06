import clsx from 'clsx';
import { ComponentStyle, PageKey, SideMenuKey } from '../../types';
import './index.less';
import { Layout as AntdLayout } from 'antd';
import Header from '../Header';
import GlobalLoading from '../GlobalLoading';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ETransferDepositProvider } from '../../context/ETransferDepositProvider';
import { ETransferWithdrawProvider } from '../../context/ETransferWithdrawProvider';
import { getAccountInfo, TelegramPlatform } from '../../utils';
import WebSider from './WebSider';
import { AccountAddressProps } from '../Header/UserProfile/AccountAddress';
import { etransferEvents } from '@etransfer/utils';
import { useUpdateRecord } from '../../hooks/updateRecord';
import ETransferContentBody from './ETransferContentBody';
import { useUpdateEffect } from 'react-use';
import { TDepositActionData } from '../Deposit/types';
import { TTransferDetailActionData } from '../TransferDetail/types';
import { TWithdrawActionData } from '../Withdraw/types';
import { THistoryActionData } from '../History/types';

type TPageActionData = TDepositActionData | TWithdrawActionData | THistoryActionData | TTransferDetailActionData | null;

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
  onLifeCycleChange,
}: {
  className?: string;
  componentStyle?: ComponentStyle;
  isCanClickHeaderLogo?: boolean;
  isShowHeader?: boolean;
  isShowHeaderUserProfile?: boolean;
  isShowSider?: boolean;
  isShowMobileFooter?: boolean;
  isShowErrorTip?: boolean;
  onClickHeaderLogo?: () => void;
  onLifeCycleChange?: (lifeCycle: PageKey, data?: any) => void;
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

  const [pageActionData, setPageActionData] = useState<TPageActionData>();
  const onActionChange = useCallback((data: TPageActionData) => {
    setPageActionData(data);
  }, []);

  useUpdateEffect(() => {
    let data: TPageActionData = null;
    switch (activePageKey) {
      case PageKey.Deposit:
      case PageKey.Withdraw:
      case PageKey.History:
        data = pageActionData as TPageActionData;
        break;
      case PageKey.TransferDetail:
        data = {
          orderId: transferDetailId,
        } as TTransferDetailActionData;
        break;

      default:
        break;
    }

    onLifeCycleChange?.(activePageKey, data);
  }, [activePageKey, pageActionData, transferDetailId]);

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
                <ETransferContentBody
                  activePageKey={activePageKey}
                  componentStyle={componentStyle}
                  transferDetailId={transferDetailId}
                  isUnreadHistory={isUnreadHistory}
                  isShowErrorTip={isShowErrorTip}
                  onClickProcessingTip={handleClickProcessingTip}
                  onClickHistoryItem={handleClickHistoryItem}
                  onTransferDetailBack={handleTransferDetailBack}
                  onDepositActionChange={onActionChange}
                  onWithdrawActionChange={onActionChange}
                  onHistoryActionChange={onActionChange}
                />
              </ETransferWithdrawProvider>
            </ETransferDepositProvider>
          </Suspense>
        </div>
      </div>
    </AntdLayout>
  );
}
