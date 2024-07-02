import clsx from 'clsx';
import './index.less';
import { useCallback, useState } from 'react';
import { BusinessType, TNetworkItem } from '@etransfer/types';
import NetworkSelectDropdown from '../NetworkSelectDropdown';
import NetworkSelectDrawer from '../NetworkSelectDrawer';
import { DepositNetworkResultForMobile, DepositNetworkResultForWeb } from '../DepositNetworkResult';

export interface DepositSelectNetworkProps {
  networkList: TNetworkItem[];
  selected?: TNetworkItem;
  isDisabled?: boolean;
  isShowLoading?: boolean;
  className?: string;
  onChange?: (item: TNetworkItem) => void;
  selectCallback: (item: TNetworkItem) => Promise<void>;
}

export function DepositSelectNetworkForWeb({
  networkList,
  selected,
  isDisabled,
  isShowLoading,
  className,
  onChange,
  selectCallback,
}: DepositSelectNetworkProps) {
  const [isShowNetworkSelectDropdown, setIsShowNetworkSelectDropdown] = useState<boolean>(false);

  const onSelectNetwork = useCallback(
    async (item: TNetworkItem) => {
      if (item.network === selected?.network) {
        setIsShowNetworkSelectDropdown(false);
        return;
      }
      onChange?.(item);

      setIsShowNetworkSelectDropdown(false);

      await selectCallback(item);
    },
    [onChange, selectCallback, selected?.network],
  );

  return (
    <div
      className={clsx('etransfer-ui-deposit-select-network', 'etransfer-ui-deposit-select-network-for-web', className)}>
      <DepositNetworkResultForWeb
        selected={selected}
        isArrowDown={!isShowNetworkSelectDropdown}
        onClick={() => setIsShowNetworkSelectDropdown(true)}
      />

      <NetworkSelectDropdown
        className={'etransfer-ui-deposit-network-select-dropdown'}
        open={isShowNetworkSelectDropdown}
        type={BusinessType.Deposit}
        networkList={networkList}
        selectedNetwork={selected?.network}
        isDisabled={isDisabled}
        isShowLoading={isShowLoading}
        onSelect={onSelectNetwork}
        onClose={() => setIsShowNetworkSelectDropdown(false)}
      />
    </div>
  );
}

export function DepositSelectNetworkForMobile({
  label,
  networkList,
  selected,
  isDisabled,
  isShowLoading,
  className,
  onChange,
  selectCallback,
}: DepositSelectNetworkProps & { label?: string }) {
  const [isShowNetworkSelectDrawer, setIsShowNetworkSelectDrawer] = useState<boolean>(false);

  const onSelectNetwork = useCallback(
    async (item: TNetworkItem) => {
      if (item.network === selected?.network) {
        setIsShowNetworkSelectDrawer(false);
        return;
      }
      onChange?.(item);

      setIsShowNetworkSelectDrawer(false);

      await selectCallback(item);
    },
    [onChange, selectCallback, selected?.network],
  );

  return (
    <div
      className={clsx(
        'etransfer-ui-deposit-select-network',
        'etransfer-ui-deposit-select-network-for-mobile',
        className,
      )}>
      <DepositNetworkResultForMobile
        selected={selected}
        isArrowDown={!isShowNetworkSelectDrawer}
        label={label}
        onClick={() => setIsShowNetworkSelectDrawer(true)}
      />

      <NetworkSelectDrawer
        open={isShowNetworkSelectDrawer}
        onClose={() => setIsShowNetworkSelectDrawer(false)}
        type={BusinessType.Deposit}
        networkList={networkList}
        selectedNetwork={selected?.network}
        isDisabled={isDisabled}
        isShowLoading={isShowLoading}
        onSelect={onSelectNetwork}
      />
    </div>
  );
}
