import clsx from 'clsx';
import { DeviceSelectChainProps } from '../../types';
import './index.less';
import CommonDropdown from '../../../CommonDropdown';
import { useMemo } from 'react';
import { CHAIN_ID } from '../../../../constants';
import CommonSvg from '../../../CommonSvg';

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
  const menuItemsAddIcon = useMemo(() => {
    const list: any[] = [];
    menuItems.forEach((item) => {
      list.push({
        ...item,
        icon: item.key === CHAIN_ID.AELF ? <CommonSvg type="aelfBig" /> : <CommonSvg type="tDVVBig" />,
      });
    });

    return list;
  }, [menuItems]);

  return (
    <CommonDropdown
      getContainer={getContainer}
      className={className}
      childrenClassName={childrenClassName}
      overlayClassName={clsx('etransfer-ui-web-select-chain-dropdown', overlayClassName)}
      isBorder={isBorder}
      menu={{
        items: menuItemsAddIcon,
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
