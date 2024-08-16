import clsx from 'clsx';
import './index.less';
import { ComponentStyle, IChainMenuItem } from '../../../types';
import ChainSelect from '../ChainSelect';

interface WithdrawSelectChainProps {
  className?: string;
  mobileTitle?: string;
  mobileLabel?: string;
  webLabel?: string;
  menuItems: IChainMenuItem[];
  selectedItem?: IChainMenuItem;
  componentStyle?: ComponentStyle;
  chainChanged: (item: IChainMenuItem) => void;
}

export default function WithdrawSelectChain({
  className,
  mobileTitle = '',
  mobileLabel,
  webLabel,
  menuItems,
  selectedItem,
  componentStyle = ComponentStyle.Web,
  chainChanged,
}: WithdrawSelectChainProps) {
  return (
    <div className={clsx('etransfer-ui-withdraw-select-chain', className)} id="etransferWithdrawSelectChain">
      <span className={'etransfer-ui-withdraw-select-chain-label'}>
        {componentStyle === ComponentStyle.Mobile ? mobileLabel : webLabel}
      </span>
      <ChainSelect
        componentStyle={componentStyle}
        getContainer="etransferWithdrawSelectChain"
        title={mobileTitle}
        clickCallback={chainChanged}
        menuItems={menuItems}
        selectedItem={selectedItem}
      />
    </div>
  );
}
