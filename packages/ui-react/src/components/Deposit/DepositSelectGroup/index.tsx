import { TNetworkItem, TTokenOptionItem } from '@etransfer/types';
import { DepositSelectTokenForMobile, DepositSelectTokenForWeb } from '../../SelectToken/DepositSelectToken';
import { DepositSelectNetworkForMobile, DepositSelectNetworkForWeb } from '../../SelectNetwork/DepositSelectNetwork';

export interface DepositSelectGroupProps {
  title?: string;
  tokenList: TTokenOptionItem[];
  depositTokenSelected?: TTokenOptionItem;
  networkList: TNetworkItem[];
  networkSelected?: TNetworkItem;
  depositTokenChanged: (item: TTokenOptionItem) => void;
  networkChanged: (item: TNetworkItem) => Promise<void>;
}

export function DepositSelectGroupForWeb({
  title,
  tokenList,
  depositTokenSelected,
  networkList,
  networkSelected,
  depositTokenChanged,
  networkChanged,
}: DepositSelectGroupProps) {
  return (
    <div>
      <DepositSelectTokenForWeb
        title={title}
        className={'etransfer-ui-deposit-selected-token'}
        tokenList={tokenList}
        selected={depositTokenSelected}
        selectCallback={depositTokenChanged}
      />
      <DepositSelectNetworkForWeb
        // className={'selected-chain'}
        networkList={networkList}
        selected={networkSelected}
        isShowLoading={false}
        selectCallback={networkChanged}
      />
    </div>
  );
}

export function DepositSelectGroupForMobile({
  title,
  tokenList,
  depositTokenSelected,
  networkList,
  networkSelected,
  depositTokenChanged,
  networkChanged,
}: DepositSelectGroupProps) {
  return (
    <div>
      <DepositSelectTokenForMobile
        title={title}
        className={'etransfer-ui-deposit-selected-token'}
        tokenList={tokenList}
        selected={depositTokenSelected}
        selectCallback={depositTokenChanged}
      />
      <DepositSelectNetworkForMobile
        networkList={networkList}
        selected={networkSelected}
        isShowLoading={false}
        selectCallback={networkChanged}
      />
    </div>
  );
}
