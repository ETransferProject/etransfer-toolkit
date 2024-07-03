import DepositDetailForMobile from '../DepositDetailForMobile';
import { DepositSelectGroupForMobile } from '../DepositSelectGroupForMobile';
import { TDepositForMobileProps } from '../types';

export default function DepositForMobile({
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
  showRetry,
  onRetry,
  onNext,
}: TDepositForMobileProps) {
  return (
    <div className="etransfer-ui-deposit-for-mobile">
      <DepositSelectGroupForMobile
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
      <DepositDetailForMobile
        chainItem={chainSelected}
        depositTokenSymbol={depositTokenSelected.symbol}
        depositTokenDecimals={depositTokenSelected.decimals}
        receiveTokenSymbol={receiveTokenSelected.symbol}
        networkItem={networkSelected}
        depositInfo={depositInfo}
        contractAddress={contractAddress}
        contractAddressLink={contractAddressLink}
        qrCodeValue={qrCodeValue}
        tokenLogoUrl={tokenLogoUrl}
        showRetry={showRetry}
        onRetry={onRetry}
        onNext={onNext}
      />
    </div>
  );
}
