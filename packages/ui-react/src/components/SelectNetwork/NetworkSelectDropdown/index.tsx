import clsx from 'clsx';
import './index.less';
import { BusinessType } from '@etransfer/types';
import { NetworkSelectForWeb, TNetworkSelectProps } from '../NetworkSelect';

interface NetworkSelectDropdownProps extends TNetworkSelectProps {
  type: BusinessType;
  open: boolean;
  onClose: () => void;
}

export default function NetworkSelectDropdown({
  className,
  type,
  open = false,
  networkList,
  selectedNetwork,
  isDisabled,
  isShowLoading,
  onSelect,
  onClose,
}: NetworkSelectDropdownProps) {
  return (
    <div className={clsx('etransfer-ui-network-select-dropdown')}>
      <div
        className={clsx(
          'network-select-dropdown-mask',
          open ? 'network-select-dropdown-show' : 'network-select-dropdown-hidden',
        )}
        onClick={onClose}></div>
      <div
        className={clsx(
          'network-select-dropdown',
          open ? 'network-select-dropdown-show' : 'network-select-dropdown-hidden',
          className,
        )}>
        <NetworkSelectForWeb
          type={type}
          networkList={networkList}
          selectedNetwork={selectedNetwork}
          onSelect={onSelect}
          isDisabled={isDisabled}
          isShowLoading={isShowLoading}
        />
      </div>
    </div>
  );
}
