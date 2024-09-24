import clsx from 'clsx';
import './index.less';
import { DEFAULT_DECIMAL } from '../../../utils';
import DepositDetailForMobile from '../DepositDetailForMobile';
import DepositSelectGroupForMobile from '../DepositSelectGroupForMobile';
import { TDepositForMobileProps } from '../types';
import CommonSvg from '../../CommonSvg';
import { ComponentStyle } from '../../../types';
import ProcessingTip from '../../CommonTips/ProcessingTip';
import { useScreenSize } from '../../../hooks';

export default function DepositForMobile({
  // common
  className,
  componentStyle,
  isShowErrorTip,
  isShowPoweredBy = false,

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
  isCheckTxnLoading,
  isShowProcessingTip = true,
  depositProcessingCount,
  withdrawProcessingCount,
  isShowNotLoginTip,
  onConnect,
  onRetry,
  onCheckTxnClick,
  onClickProcessingTip,
}: TDepositForMobileProps) {
  const { isMobilePX } = useScreenSize();

  return (
    <>
      {isShowProcessingTip && (
        <ProcessingTip
          depositProcessingCount={depositProcessingCount}
          withdrawProcessingCount={withdrawProcessingCount}
          borderRadius={0}
          onClick={onClickProcessingTip}
          marginBottom={isMobilePX ? 0 : 8}
        />
      )}
      <div className={clsx('etransfer-ui-deposit-for-mobile', className)}>
        <div>
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
            componentStyle={componentStyle}
            isShowErrorTip={isShowErrorTip}
            chainItem={chainSelected}
            depositTokenSymbol={depositTokenSelected?.symbol || ''}
            depositTokenDecimals={depositTokenSelected?.decimals || DEFAULT_DECIMAL}
            receiveTokenSymbol={receiveTokenSelected?.symbol || ''}
            networkItem={networkSelected}
            depositInfo={depositInfo}
            contractAddress={contractAddress}
            contractAddressLink={contractAddressLink}
            qrCodeValue={qrCodeValue}
            tokenLogoUrl={tokenLogoUrl}
            showRetry={showRetry}
            isCheckTxnLoading={isCheckTxnLoading}
            isShowNotLoginTip={isShowNotLoginTip}
            onLogin={onConnect}
            onRetry={onRetry}
            onCheckTxnClick={onCheckTxnClick}
          />
        </div>
        {isShowPoweredBy && componentStyle === ComponentStyle.Mobile && (
          <CommonSvg type="poweredBy" className="etransfer-ui-flex-center etransfer-ui-mobile-bottom-powered-by" />
        )}
      </div>
    </>
  );
}
