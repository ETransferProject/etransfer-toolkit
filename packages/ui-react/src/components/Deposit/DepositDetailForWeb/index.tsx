import clsx from 'clsx';
import './index.less';
import { qrCodePlaceholder } from '../../../assets/images';
import { DEPOSIT_ADDRESS_LABEL } from '../../../constants/deposit';
import CommonImage from '../../CommonImage';
import CommonSpace from '../../CommonSpace';
import Calculator from '../Calculator';
import DepositInfo from '../DepositInfo';
import { DepositRetryForWeb } from '../DepositRetry';
import DepositTip from '../DepositTip';
import ExchangeRate from '../ExchangeRate';
import CommonQRCode from '../../CommonQRCode';
import CommonAddress from '../../CommonAddress';
import { DepositDetailProps } from '../types';

export default function DepositDetailForWeb({
  className,
  componentStyle,
  isShowErrorTip,
  chainItem,
  depositTokenSymbol,
  depositTokenDecimals,
  receiveTokenSymbol,
  depositInfo,
  contractAddress,
  contractAddressLink,
  qrCodeValue,
  tokenLogoUrl,
  showRetry = false,
  onRetry,
}: DepositDetailProps) {
  return (
    <div className={clsx('etransfer-ui-deposit-detail-for-web', className)}>
      {depositTokenSymbol && receiveTokenSymbol && chainItem?.key && depositTokenSymbol !== receiveTokenSymbol && (
        <>
          <CommonSpace direction="vertical" size={12} />
          <ExchangeRate
            isShowErrorTip={isShowErrorTip}
            fromSymbol={depositTokenSymbol}
            toSymbol={receiveTokenSymbol}
            toChainId={chainItem?.key}
            slippage={depositInfo.extraInfo?.slippage}
          />
        </>
      )}

      {depositTokenSymbol !== receiveTokenSymbol && (
        <>
          <CommonSpace direction="vertical" size={24} />
          <Calculator
            isShowErrorTip={isShowErrorTip}
            depositTokenSymbol={depositTokenSymbol}
            depositTokenDecimals={depositTokenDecimals}
            chainItem={chainItem}
            receiveTokenSymbol={receiveTokenSymbol}
          />
        </>
      )}

      <CommonSpace direction="vertical" size={40} />
      {(showRetry || !!depositInfo.depositAddress) && <div className={'deposit-address-label'}>Deposit address</div>}
      {showRetry && <DepositRetryForWeb isShowImage={true} onClick={onRetry} />}
      {!showRetry && !!depositInfo.depositAddress && (
        <>
          <CommonSpace direction="vertical" size={4} />
          <DepositTip fromToken={depositTokenSymbol} toToken={receiveTokenSymbol} />
          <CommonSpace direction="vertical" size={12} />
          <div className={clsx('etransfer-ui-flex-row-center', 'deposit-address-wrapper')}>
            {qrCodeValue ? (
              <CommonQRCode value={qrCodeValue} logoUrl={tokenLogoUrl} logoSize={20} />
            ) : (
              <CommonImage
                className={clsx('etransfer-ui-flex-none')}
                src={qrCodePlaceholder as unknown as string}
                width={120}
                height={120}
                alt="qrCodePlaceholder"
              />
            )}
            <CommonAddress
              label={DEPOSIT_ADDRESS_LABEL}
              value={depositInfo.depositAddress}
              componentStyle={componentStyle}
            />
          </div>
          <CommonSpace direction="vertical" size={12} />
          <DepositInfo
            componentStyle={componentStyle}
            minimumDeposit={depositInfo.minAmount}
            contractAddress={contractAddress}
            contractAddressLink={contractAddressLink}
            minAmountUsd={depositInfo.minAmountUsd || ''}
            extraNotes={depositInfo.extraNotes}
            depositTokenSymbol={depositTokenSymbol}
          />
        </>
      )}
    </div>
  );
}
