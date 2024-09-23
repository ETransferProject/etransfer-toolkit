import SelectTokenNetwork from '../SelectTokenNetwork';
import SelectTokenChain from '../SelectTokenChain';
import CommonSpace from '../../CommonSpace';
import { DepositSelectGroupProps } from '../types';

export default function DepositSelectGroupForMobile({
  className,
  depositTokenList,
  depositTokenSelected,
  depositTokenSelectCallback,
  networkList,
  networkSelected,
  isShowNetworkLoading,
  networkSelectCallback,
  chainList,
  chainSelected,
  chainChanged,
  receiveTokenList,
  receiveTokenSelected,
  receiveTokenSelectCallback,
}: Omit<DepositSelectGroupProps, 'onConnect'>) {
  return (
    <div className={className}>
      <SelectTokenNetwork
        label={'From'}
        tokenList={depositTokenList}
        tokenSelected={depositTokenSelected}
        tokenSelectCallback={depositTokenSelectCallback}
        networkList={networkList}
        networkSelected={networkSelected}
        isShowNetworkLoading={isShowNetworkLoading}
        networkSelectCallback={networkSelectCallback}
      />

      <CommonSpace direction="vertical" size={8} />

      <SelectTokenChain
        label={'To'}
        tokenList={receiveTokenList}
        tokenSelected={receiveTokenSelected}
        tokenSelectCallback={receiveTokenSelectCallback}
        chainList={chainList}
        chainSelected={chainSelected}
        chainChanged={chainChanged}
      />
    </div>
  );
}
