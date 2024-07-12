import clsx from 'clsx';
import { DEFAULT_DECIMAL } from '../../../utils';
import DepositDetailForWeb from '../DepositDetailForWeb';
import DepositSelectGroupForWeb from '../DepositSelectGroupForWeb';
import { TDepositForWebProps } from '../types';
import './index.less';

export default function DepositForWeb({
  // common
  className,
  componentStyle,
  isShowErrorTip,

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
    <div className={clsx('etransfer-ui-deposit-for-web', className)}>
      <div className={'etransfer-ui-deposit-title'}>Deposit Assets</div>
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
        componentStyle={componentStyle}
        isShowErrorTip={isShowErrorTip}
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
