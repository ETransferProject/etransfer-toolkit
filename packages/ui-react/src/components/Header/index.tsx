import { ComponentStyle } from '../../types';
import MobileHeader, { MobileHeaderProps } from './MobileHeader';
import WebHeader, { WebHeaderProps } from './WebHeader';

export default function Header({
  activeMenuKey,
  componentStyle,
  isCanClickLogo,
  onClickLogo,
  onChange,
}: { componentStyle: ComponentStyle } & MobileHeaderProps & WebHeaderProps) {
  return (
    <div className="etransfer-ui-header-wrapper">
      {componentStyle === ComponentStyle.Mobile ? (
        <MobileHeader activeMenuKey={activeMenuKey} isUnreadHistory={false} onChange={onChange} />
      ) : (
        <WebHeader isCanClickLogo={isCanClickLogo} onClickLogo={onClickLogo} />
      )}
    </div>
  );
}
