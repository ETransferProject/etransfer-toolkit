import { TTokenOptionItem } from '@etransfer/types';
import './index.less';
import DepositSelectChain from '../../SelectChain/DepositSelectChain';
import { DepositSelectTokenForMobile } from '../../SelectToken/DepositSelectToken';
import CommonSpace from '../../CommonSpace';
import { ComponentStyle } from '../../../types/common';
import { IChainMenuItem } from '../../../types/chain';

type TSelectTokenChain = {
  label: string;
  tokenList: TTokenOptionItem[];
  tokenSelected?: TTokenOptionItem;
  chainList: IChainMenuItem[];
  chainSelected: IChainMenuItem;
  chainChanged: (item: IChainMenuItem) => void;
  tokenSelectCallback: (item: TTokenOptionItem) => void;
};
export default function SelectTokenChain({
  label,
  tokenList,
  tokenSelected,
  chainList,
  chainSelected,
  chainChanged,
  tokenSelectCallback,
}: TSelectTokenChain) {
  return (
    <div className="etransfer-ui-deposit-select-token-chain">
      <DepositSelectChain
        menuItems={chainList}
        selectedItem={chainSelected}
        mobileLabel={label}
        mobileTitle={`Deposit ${label}`}
        chainChanged={chainChanged}
        componentStyle={ComponentStyle.Mobile}
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
