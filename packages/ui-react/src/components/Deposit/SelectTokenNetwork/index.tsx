import { TNetworkItem, TTokenOptionItem } from '@etransfer/types';
import CommonSpace from '../../CommonSpace';
import { DepositSelectNetworkForMobile } from '../../SelectNetwork/DepositSelectNetwork';
import { DepositSelectTokenForMobile } from '../../SelectToken/DepositSelectToken';
import './index.less';
import clsx from 'clsx';

type TSelectTokenNetwork = {
  className?: string;
  label: string;
  networkList: TNetworkItem[];
  networkSelected?: Partial<TNetworkItem>;
  tokenList: TTokenOptionItem[];
  tokenSelected?: TTokenOptionItem;
  isShowNetworkLoading?: boolean;
  networkSelectCallback: (item: TNetworkItem) => Promise<void>;
  tokenSelectCallback: (item: TTokenOptionItem) => void;
};
export default function SelectTokenNetwork({
  className,
  label,
  networkList,
  networkSelected,
  isShowNetworkLoading,
  tokenList,
  tokenSelected,
  networkSelectCallback,
  tokenSelectCallback,
}: TSelectTokenNetwork) {
  return (
    <div className={clsx('etransfer-ui-deposit-select-token-network', className)}>
      <DepositSelectNetworkForMobile
        label={label}
        networkList={networkList}
        selected={networkSelected}
        isShowLoading={isShowNetworkLoading}
        selectCallback={networkSelectCallback}
      />
      <CommonSpace direction="vertical" size={20} />
      <DepositSelectTokenForMobile
        title="Deposit Token"
        tokenList={tokenList}
        selected={tokenSelected}
        selectCallback={tokenSelectCallback}
      />
    </div>
  );
}
