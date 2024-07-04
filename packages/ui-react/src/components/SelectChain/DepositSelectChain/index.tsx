import { useMemo } from 'react';
import clsx from 'clsx';
import './index.less';
import CommonSvg from '../../CommonSvg';
import ChainSelect from '../ChainSelect';
import CommonSpace from '../../CommonSpace';
import { IChainMenuItem } from '../../../types/chain';
import { ComponentStyle } from '../../../types/common';

interface DepositSelectChainProps {
  menuItems: IChainMenuItem[];
  selectedItem?: IChainMenuItem;
  className?: string;
  mobileTitle?: string;
  mobileLabel?: string;
  componentStyle: ComponentStyle;
  chainChanged: (item: IChainMenuItem) => void;
}

export default function DepositSelectChain({
  menuItems,
  selectedItem,
  className,
  mobileTitle = '',
  mobileLabel,
  componentStyle = ComponentStyle.Web,
  chainChanged,
}: DepositSelectChainProps) {
  const isMobileStyle = componentStyle === ComponentStyle.Mobile;
  const isDisabled = useMemo(() => {
    return menuItems?.length <= 1;
  }, [menuItems?.length]);

  return (
    <div
      id="etransferDepositChainSelect"
      className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-deposit-select-chain', className)}>
      {isMobileStyle && <span className={'select-chain-label'}>{mobileLabel}</span>}

      <CommonSvg type={isMobileStyle ? 'aelf' : 'aelfMedium'} />
      <CommonSpace direction={'horizontal'} size={isMobileStyle ? 6 : 8} />

      {isDisabled ? (
        <div className={clsx('select-chain', !isMobileStyle && 'select-chain-web')}>{selectedItem?.label}</div>
      ) : (
        <ChainSelect
          getContainer="etransferWebDepositChainWrapper"
          menuItems={menuItems}
          selectedItem={selectedItem}
          isBorder={false}
          title={mobileTitle}
          clickCallback={chainChanged}
          className={clsx('select-chain-container', !isMobileStyle && 'select-chain-container-web')}
          childrenClassName={clsx('select-chain-content', !isMobileStyle && 'select-chain-content-web')}
          overlayClassName={'select-chain-overlay'}
          suffixArrowSize={isMobileStyle ? 'Small' : 'Normal'}
          componentStyle={componentStyle}
        />
      )}
    </div>
  );
}
