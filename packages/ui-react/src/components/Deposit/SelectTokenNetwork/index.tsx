import { TNetworkItem, TTokenOptionItem } from '@etransfer/types';
import CommonSpace from '../../CommonSpace';
import { DepositSelectNetworkForMobile } from '../../SelectNetwork/DepositSelectNetwork';
import { DepositSelectTokenForMobile } from '../../SelectToken/DepositSelectToken';
import './index.less';

type TSelectTokenNetwork = {
  label: string;
  networkList: TNetworkItem[];
  networkSelected?: TNetworkItem;
  tokenList: TTokenOptionItem[];
  tokenSelected?: TTokenOptionItem;
  isShowNetworkLoading?: boolean;
  networkSelectCallback: (item: TNetworkItem) => Promise<void>;
  tokenSelectCallback: (item: TTokenOptionItem) => void;
};
export default function SelectTokenNetwork({
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
    <div className="etransfer-ui-deposit-select-token-network">
      <DepositSelectNetworkForMobile
        label={label}
        networkList={networkList}
        selected={networkSelected}
        isShowLoading={isShowNetworkLoading}
        selectCallback={networkSelectCallback}
      />
      <CommonSpace direction="vertical" size={20} />
      <DepositSelectTokenForMobile
        tokenList={tokenList}
        selected={tokenSelected}
        selectCallback={tokenSelectCallback}
      />
    </div>
  );
}
