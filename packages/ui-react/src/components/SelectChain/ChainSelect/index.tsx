import { useCallback, useMemo, useState } from 'react';
import WebSelectChain from './WebSelectChain';
import MobileSelectChain from './MobileSelectChain';
import { DeviceSelectChainProps, SelectChainProps } from '../types';
import { IChainMenuItem } from '../../../types/chain';
import { ComponentStyle } from '../../../types/common';
import SynchronizingChainModal from '../../Modal/SynchronizingChainModal';

export default function ChainSelect({
  title,
  className,
  childrenClassName,
  overlayClassName,
  getContainer,
  isBorder,
  suffixArrowSize,
  hideDownArrow,
  menuItems,
  selectedItem,
  componentStyle = ComponentStyle.Web,
  clickCallback,
}: SelectChainProps) {
  const [openSynchronizingModal, setOpenSynchronizingModal] = useState(false);

  const closeSynchronizingModal = useCallback(() => {
    setOpenSynchronizingModal(false);
  }, []);

  const onClickChain = useCallback(
    async (item: IChainMenuItem) => {
      if (item.key === selectedItem?.key) return;
      await clickCallback(item);
    },
    [clickCallback, selectedItem?.key],
  );
  const dropdownProps: Omit<DeviceSelectChainProps, 'getContainer'> = useMemo(() => {
    return {
      menuItems,
      selectedItem,
      onClick: onClickChain,
    };
  }, [menuItems, onClickChain, selectedItem]);

  return (
    <>
      {componentStyle === ComponentStyle.Mobile ? (
        <MobileSelectChain
          {...dropdownProps}
          title={title}
          className={className}
          childrenClassName={childrenClassName}
          isBorder={isBorder}
        />
      ) : (
        <WebSelectChain
          {...dropdownProps}
          getContainer={getContainer}
          className={className}
          childrenClassName={childrenClassName}
          overlayClassName={overlayClassName}
          isBorder={isBorder}
          suffixArrowSize={suffixArrowSize}
          hideDownArrow={hideDownArrow}
        />
      )}

      <SynchronizingChainModal
        open={openSynchronizingModal}
        onOk={closeSynchronizingModal}
        onCancel={closeSynchronizingModal}
      />
    </>
  );
}
