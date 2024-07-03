import { useState } from 'react';
import clsx from 'clsx';
import { DeviceSelectChainProps } from '../../types';
import './index.less';
import CommonDrawer from '../../../CommonDrawer';
import DynamicArrow from '../../../DynamicArrow';

export default function MobileSelectChain({
  title,
  className,
  childrenClassName,
  menuItems,
  selectedItem,
  isBorder = true,
  onClick,
}: Omit<DeviceSelectChainProps, 'getContainer'> & { title: string }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  return (
    <>
      <div
        className={clsx(
          'etransfer-ui-flex-row-center',
          'etransfer-ui-mobile-select-chain-trigger-container',
          isBorder && 'etransfer-ui-mobile-select-chain-trigger-container-border',
          className,
        )}
        onClick={() => setIsDrawerOpen(true)}>
        <div className={clsx('trigger-text', childrenClassName)}>{selectedItem?.label}</div>
        <DynamicArrow isExpand={isDrawerOpen} size="Small" className={'arrow-icon'} />
      </div>
      <CommonDrawer title={title} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className={clsx('etransfer-ui-flex-column', 'etransfer-ui-mobile-select-chain-drawer-content')}>
          {menuItems?.map((item) => (
            <div
              key={item.key}
              className={clsx('drawer-item', {
                ['drawer-item-selected']: item.key === selectedItem?.key,
              })}
              onClick={() => {
                onClick?.(item);
                setIsDrawerOpen(false);
              }}>
              {item.label}
            </div>
          ))}
        </div>
      </CommonDrawer>
    </>
  );
}
