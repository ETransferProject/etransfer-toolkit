import clsx from 'clsx';
import { DeviceSelectChainProps } from '../../types';
import './index.less';
import CommonDropdown from '../../../CommonDropdown';

export default function WebSelectChain({
  className,
  childrenClassName,
  overlayClassName,
  menuItems,
  selectedItem,
  isBorder,
  suffixArrowSize,
  hideDownArrow,
  onClick,
  getContainer,
}: DeviceSelectChainProps) {
  return (
    <CommonDropdown
      getContainer={getContainer}
      className={className}
      childrenClassName={childrenClassName}
      overlayClassName={clsx('etransfer-ui-web-select-chain-dropdown', overlayClassName)}
      isBorder={isBorder}
      menu={{
        items: menuItems,
        selectedKeys: [selectedItem?.key || ''],
      }}
      handleMenuClick={(item) => {
        onClick?.(menuItems.find((chain) => chain?.key === item?.key) || menuItems[0]);
      }}
      suffixArrowSize={suffixArrowSize}
      hideDownArrow={hideDownArrow}>
      <div className={'trigger-text'}>{selectedItem?.label}</div>
    </CommonDropdown>
  );
}
