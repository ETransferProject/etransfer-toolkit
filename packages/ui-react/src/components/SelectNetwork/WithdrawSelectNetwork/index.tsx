import { useCallback, useState } from 'react';
import clsx from 'clsx';
import './index.less';
import { BusinessType, TNetworkItem } from '@etransfer/types';
import DynamicArrow from '../../DynamicArrow';
import NetworkSelectDrawer from '../NetworkSelectDrawer';
import NetworkSelectDropdown from '../NetworkSelectDropdown';
import { ComponentStyle } from '../../../types';

type TSelectNetworkProps = {
  networkList: TNetworkItem[];
  selected?: Partial<TNetworkItem>;
  isDisabled?: boolean;
  isShowLoading?: boolean;
  componentStyle?: ComponentStyle;
  onChange?: (item: TNetworkItem) => void;
  selectCallback: (item: TNetworkItem) => Promise<void>;
};

export default function WithdrawSelectNetwork({
  networkList,
  selected,
  isDisabled,
  isShowLoading,
  componentStyle = ComponentStyle.Web,
  onChange,
  selectCallback,
}: TSelectNetworkProps) {
  const [isShowNetworkSelectModal, setIsShowNetworkSelectModal] = useState<boolean>(false);

  const onSelectNetwork = useCallback(
    async (item: TNetworkItem) => {
      if (item.network === selected?.network) {
        setIsShowNetworkSelectModal(false);
        return;
      }
      onChange?.(item);

      setIsShowNetworkSelectModal(false);

      await selectCallback(item);
    },
    [onChange, selectCallback, selected?.network],
  );

  return (
    <div className={'etransfer-ui-withdraw-select-network'}>
      <div
        id="etransfer-ui-withdraw-select-network-result"
        className={clsx(
          'etransfer-ui-withdraw-select-network-result',
          'etransfer-ui-withdraw-select-network-result-form-item',
        )}
        onClick={() => setIsShowNetworkSelectModal(true)}>
        <div className={'etransfer-ui-withdraw-select-network-value-row'}>
          <div className={'etransfer-ui-withdraw-select-network-value'}>
            {selected?.network ? (
              <span
                className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-withdraw-select-network-value-selected')}>
                {componentStyle === ComponentStyle.Mobile ? (
                  <span className={'etransfer-ui-withdraw-select-network-primary'}>{selected.name}</span>
                ) : (
                  <>
                    <span className={'etransfer-ui-withdraw-select-network-primary'}>{selected.network}</span>
                    <span className={'etransfer-ui-withdraw-select-network-secondary'}>{selected.name}</span>
                  </>
                )}
              </span>
            ) : (
              <span className={'etransfer-ui-withdraw-select-network-value-placeholder'}>Select network</span>
            )}
          </div>

          <DynamicArrow isExpand={isShowNetworkSelectModal} size="Big" />
        </div>
      </div>

      {componentStyle === ComponentStyle.Mobile ? (
        <NetworkSelectDrawer
          open={isShowNetworkSelectModal}
          onClose={() => setIsShowNetworkSelectModal(false)}
          type={BusinessType.Withdraw}
          networkList={networkList}
          selectedNetwork={selected?.network}
          isDisabled={isDisabled}
          isShowLoading={isShowLoading}
          onSelect={onSelectNetwork}
        />
      ) : (
        <NetworkSelectDropdown
          className="etransfer-ui-withdraw-network-select-dropdown"
          open={isShowNetworkSelectModal}
          type={BusinessType.Withdraw}
          networkList={networkList}
          selectedNetwork={selected?.network}
          isDisabled={isDisabled}
          isShowLoading={isShowLoading}
          onSelect={onSelectNetwork}
          onClose={() => setIsShowNetworkSelectModal(false)}
        />
      )}
    </div>
  );
}
