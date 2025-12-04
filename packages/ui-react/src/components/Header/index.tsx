import { ComponentStyle } from '../../types';
import MobileHeader, { MobileHeaderProps } from './MobileHeader';
import WebHeader, { WebHeaderProps } from './WebHeader';
import './index.less';

export default function Header({
  activeMenuKey,
  accountList,
  componentStyle,
  isCanClickLogo,
  isUnreadHistory,
  isShowUserProfile,
  isShowMobileFooter,
  onClickLogo,
  onChange,
}: { componentStyle?: ComponentStyle } & MobileHeaderProps & WebHeaderProps) {
  return (
    <div className="etransfer-ui-header-wrapper">
      {componentStyle === ComponentStyle.Mobile ? (
        <MobileHeader
          activeMenuKey={activeMenuKey}
          accountList={accountList}
          isUnreadHistory={isUnreadHistory}
          isShowUserProfile={isShowUserProfile}
          isShowMobileFooter={isShowMobileFooter}
          onChange={onChange}
        />
      ) : (
        <WebHeader
          accountList={accountList}
          isCanClickLogo={isCanClickLogo}
          isShowUserProfile={isShowUserProfile}
          onClickLogo={onClickLogo}
        />
      )}
    </div>
  );
}
