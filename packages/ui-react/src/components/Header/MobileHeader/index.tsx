import clsx from 'clsx';
import './index.less';
import { SideMenuKey } from '../../../types';
import MobileHeaderSelectMenu from '../MobileHeaderSelectMenu';

export interface MobileHeaderProps {
  activeMenuKey: SideMenuKey;
  isUnreadHistory: boolean;
  onChange: (key: SideMenuKey) => void;
}

export default function MobileHeader({ activeMenuKey, isUnreadHistory, onChange }: MobileHeaderProps) {
  return (
    <div className={clsx('etransfer-ui-flex-row-center-between', 'etransfer-ui-mobile-header-wrapper')}>
      <MobileHeaderSelectMenu activeMenuKey={activeMenuKey} isUnreadHistory={isUnreadHistory} onChange={onChange} />
      <span className={clsx('etransfer-ui-text-center', 'etransfer-ui-mobile-header-text')}>
        {activeMenuKey === SideMenuKey.Deposit && 'Deposit Assets'}
        {activeMenuKey === SideMenuKey.Withdraw && 'Withdraw Assets'}
        {activeMenuKey === SideMenuKey.History && 'History'}
      </span>
      {/* TODO */}
      {/* <LoginAndProfileEntry /> */}
    </div>
  );
}
