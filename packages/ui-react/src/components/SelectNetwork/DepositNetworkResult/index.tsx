import clsx from 'clsx';
import './index.less';
import { useMemo } from 'react';
import DynamicArrow from '../../DynamicArrow';
import { NetworkLogo } from '../../NetworkLogo';
import CommonSvg from '../../CommonSvg';
import { TNetworkItem } from '@etransfer/types';

export interface DepositNetworkResultProps {
  selected?: Partial<TNetworkItem>;
  isArrowDown?: boolean;
  onClick: () => void;
}

export function DepositNetworkResultForWeb({ selected, isArrowDown = true, onClick }: DepositNetworkResultProps) {
  const renderNotSelected = useMemo(() => {
    return (
      <div
        className={clsx(
          'etransfer-ui-flex-row-center',
          'etransfer-ui-select-network-not-selected',
          'etransfer-ui-select-network-not-selected-for-web',
        )}>
        <CommonSvg type="addMedium" className="etransfer-ui-flex-shrink-0" />
        <span className={'select-network-value-placeholder'}>Select Network</span>
      </div>
    );
  }, []);

  const renderNetworkLogo = useMemo(() => {
    return (
      selected?.network && (
        <NetworkLogo
          className="etransfer-ui-flex-shrink-0 etransfer-ui-flex"
          network={selected?.network}
          size={'big'}
        />
      )
    );
  }, [selected?.network]);

  const renderSelected = useMemo(() => {
    return (
      selected?.network && (
        <span className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-select-network-value-selected')}>
          {renderNetworkLogo}
          <span className={'primary'}>{selected?.name}</span>
        </span>
      )
    );
  }, [renderNetworkLogo, selected?.name, selected?.network]);

  return (
    <div
      id="etransfer-ui-select-network-result-for-web"
      className={clsx(
        'etransfer-ui-flex-row-center-between',
        'etransfer-ui-select-network-result',
        'etransfer-ui-select-network-result-for-web',
      )}
      onClick={onClick}>
      {selected?.network ? renderSelected : renderNotSelected}
      <DynamicArrow size={'Normal'} isExpand={!isArrowDown} />
    </div>
  );
}

export function DepositNetworkResultForMobile({
  selected,
  isArrowDown = true,
  label = 'From',
  onClick,
}: DepositNetworkResultProps & { label?: string }) {
  const renderNotSelected = useMemo(() => {
    return (
      <div
        className={clsx(
          'etransfer-ui-flex-row-center',
          'etransfer-ui-select-network-not-selected',
          'etransfer-ui-select-network-not-selected-for-mobile',
        )}>
        <CommonSvg type="add" className="etransfer-ui-flex-shrink-0" />
        <span className={'select-network-value-placeholder'}>Select Network</span>
      </div>
    );
  }, []);

  const renderNetworkLogo = useMemo(() => {
    return (
      selected?.network && (
        <NetworkLogo
          className="etransfer-ui-flex-shrink-0 etransfer-ui-flex"
          network={selected?.network}
          size={'small'}
        />
      )
    );
  }, [selected?.network]);

  const renderSelected = useMemo(() => {
    return (
      selected?.network && (
        <span className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-select-network-value-selected')}>
          {renderNetworkLogo}
          <span className={'primary'}>{selected?.name}</span>
        </span>
      )
    );
  }, [renderNetworkLogo, selected?.name, selected?.network]);

  return (
    <div
      id="etransfer-ui-select-network-result-for-mobile"
      className={clsx(
        'etransfer-ui-flex-row-center',
        'etransfer-ui-select-network-result',
        'etransfer-ui-select-network-result-for-mobile',
      )}
      onClick={onClick}>
      <div className={'select-network-label'}>{label}</div>
      {selected?.network ? renderSelected : renderNotSelected}
      <DynamicArrow size={'Small'} isExpand={!isArrowDown} />
    </div>
  );
}
