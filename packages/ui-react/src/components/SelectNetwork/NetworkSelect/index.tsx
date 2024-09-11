import clsx from 'clsx';
import './index.less';
import { BusinessType, TNetworkItem } from '@etransfer/types';
import CommonSvg from '../../CommonSvg';
import { NetworkCardForMobile, NetworkCardForWeb } from '../NetworkCard';
import { NetworkListSkeletonForMobile, NetworkListSkeletonForWeb } from '../NetworkListSkeleton';

export interface TNetworkSelectProps {
  className?: string;
  type: BusinessType;
  networkList: TNetworkItem[];
  selectedNetwork?: string;
  isDisabled?: boolean;
  isShowLoading?: boolean;
  onSelect: (item: TNetworkItem) => Promise<void>;
}

const DEPOSIT_TIP_CONTENT =
  'Note: Please select from the supported networks listed below. Sending tokens from other networks may result in the loss of your assets.';
const WITHDRAW_TIP_CONTENT =
  'Please ensure that your receiving platform supports the digital asset and network. If you are unsure, kindly check with the platform before proceeding.';
const NETWORK_LIST_TIP =
  'Networks not matching your withdrawal address have been automatically excluded. Please select from the networks listed below.';

function NetworkSelectTip({
  menuType = BusinessType.Deposit,
  showHighlight = true,
}: {
  menuType?: BusinessType;
  showHighlight?: boolean;
}) {
  return (
    <div
      className={clsx('etransfer-ui-flex-column', 'etransfer-ui-network-select-tip-wrapper', {
        ['etransfer-ui-network-select-tip-wrapper-deposit']: menuType === BusinessType.Deposit,
      })}>
      <div className={'network-select-tip'}>
        <CommonSvg className={'network-select-tip-icon'} type="info" />
        <span className={'network-select-tip-text'}>
          {menuType === BusinessType.Deposit ? DEPOSIT_TIP_CONTENT : WITHDRAW_TIP_CONTENT}
        </span>
      </div>
      {menuType === BusinessType.Withdraw && showHighlight && (
        <div className={'network-select-tip-highlight'}>{NETWORK_LIST_TIP}</div>
      )}
    </div>
  );
}

export function NetworkSelectForMobile({
  className,
  type,
  networkList,
  selectedNetwork,
  isDisabled,
  isShowLoading = false,
  onSelect,
}: TNetworkSelectProps) {
  return (
    <div className={clsx('etransfer-ui-network-select', 'etransfer-ui-network-select-for-mobile', className)}>
      <NetworkSelectTip
        menuType={type}
        showHighlight={!isShowLoading && !isDisabled && Array.isArray(networkList) && networkList.length > 0}
      />
      <div className={'network-select-list'}>
        {(isShowLoading || !Array.isArray(networkList) || networkList.length == 0) && <NetworkListSkeletonForMobile />}
        {!isShowLoading &&
          networkList?.map((item, idx) => {
            return (
              <NetworkCardForMobile
                key={'network-select' + item.network + idx}
                className={selectedNetwork == item.network ? 'network-card-selected' : undefined}
                isDisabled={isDisabled}
                name={item.name}
                type={type}
                transactionFee={item.withdrawFee}
                transactionFeeUnit={item.withdrawFeeUnit}
                multiConfirmTime={item.multiConfirmTime}
                multiConfirm={item.multiConfirm}
                onClick={() => onSelect(item)}
                status={item.status}
              />
            );
          })}
      </div>
    </div>
  );
}

export function NetworkSelectForWeb({
  className,
  type,
  networkList,
  selectedNetwork,
  isDisabled,
  isShowLoading = false,
  onSelect,
}: TNetworkSelectProps) {
  return (
    <div className={clsx('etransfer-ui-network-select', 'etransfer-ui-network-select-for-web', className)}>
      <NetworkSelectTip
        menuType={type}
        showHighlight={!isShowLoading && !isDisabled && Array.isArray(networkList) && networkList.length > 0}
      />
      <div className={'network-select-list'}>
        {(isShowLoading || !Array.isArray(networkList) || networkList.length == 0) && <NetworkListSkeletonForWeb />}
        {!isShowLoading &&
          networkList?.map((item, idx) => {
            return (
              <NetworkCardForWeb
                key={'network-select' + item.network + idx}
                className={selectedNetwork == item.network ? 'network-card-selected' : undefined}
                isDisabled={isDisabled}
                network={item.network}
                name={item.name}
                type={type}
                transactionFee={item.withdrawFee}
                transactionFeeUnit={item.withdrawFeeUnit}
                multiConfirmTime={item.multiConfirmTime}
                multiConfirm={item.multiConfirm}
                onClick={() => onSelect(item)}
                status={item.status}
              />
            );
          })}
      </div>
    </div>
  );
}
