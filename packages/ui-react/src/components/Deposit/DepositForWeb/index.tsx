import { DEFAULT_DECIMAL } from '../../../utils';
import DepositDetailForWeb from '../DepositDetailForWeb';
import { DepositSelectGroupForWeb } from '../DepositSelectGroupForWeb';
import { TDepositForWebProps } from '../types';

export default function DepositForWeb({
  // select
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

  // info
  depositInfo,
  contractAddress,
  contractAddressLink,
  qrCodeValue,
  tokenLogoUrl,
  showRetry = false,
  onRetry,
}: TDepositForWebProps) {
  return (
    <div className="etransfer-ui-deposit-for-web">
      <DepositSelectGroupForWeb
        depositTokenList={depositTokenList}
        depositTokenSelected={depositTokenSelected}
        depositTokenSelectCallback={depositTokenSelectCallback}
        networkList={networkList}
        networkSelected={networkSelected}
        isShowNetworkLoading={isShowNetworkLoading}
        networkSelectCallback={networkSelectCallback}
        chainList={chainList}
        chainSelected={chainSelected}
        chainChanged={chainChanged}
        receiveTokenList={receiveTokenList}
        receiveTokenSelected={receiveTokenSelected}
        receiveTokenSelectCallback={receiveTokenSelectCallback}
      />
      <DepositDetailForWeb
        chainItem={chainSelected}
        depositTokenSymbol={depositTokenSelected?.symbol || ''}
        depositTokenDecimals={depositTokenSelected?.decimals || DEFAULT_DECIMAL}
        receiveTokenSymbol={receiveTokenSelected?.symbol || ''}
        depositInfo={depositInfo}
        contractAddress={contractAddress}
        contractAddressLink={contractAddressLink}
        qrCodeValue={qrCodeValue}
        tokenLogoUrl={tokenLogoUrl}
        showRetry={showRetry}
        onRetry={onRetry}
      />
    </div>
  );
}
