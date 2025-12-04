import clsx from 'clsx';
import './index.less';
import { SideMenuKey } from '../../../types';
import MobileHeaderSelectMenu from '../MobileHeaderSelectMenu';
import MobileUserProfile from '../UserProfile/MobileUserProfile';
import { AccountAddressProps } from '../UserProfile/AccountAddress';

export interface MobileHeaderProps {
  activeMenuKey: SideMenuKey;
  accountList: AccountAddressProps['accountList'];
  isUnreadHistory: boolean;
  isShowUserProfile?: boolean;
  isShowMobileFooter?: boolean;
  onChange: (key: SideMenuKey) => void;
}

export default function MobileHeader({
  activeMenuKey,
  accountList,
  isUnreadHistory,
  isShowUserProfile,
  isShowMobileFooter,
  onChange,
}: MobileHeaderProps) {
  return (
    <div className={clsx('etransfer-ui-flex-row-center-between', 'etransfer-ui-mobile-header-wrapper')}>
      <MobileHeaderSelectMenu
        activeMenuKey={activeMenuKey}
        isUnreadHistory={isUnreadHistory}
        isShowFooter={isShowMobileFooter}
        onChange={onChange}
      />
      <span className={clsx('etransfer-ui-text-center', 'etransfer-ui-mobile-header-text')}>
        {activeMenuKey === SideMenuKey.Deposit && 'Deposit Assets'}
        {activeMenuKey === SideMenuKey.Withdraw && 'Withdraw Assets'}
        {activeMenuKey === SideMenuKey.History && 'History'}
      </span>
      {isShowUserProfile && Array.isArray(accountList) && accountList.length > 0 && (
        <MobileUserProfile accountList={accountList} />
      )}
    </div>
  );
}
