import clsx from 'clsx';
import './index.less';
import CommonSpace from '../../CommonSpace';
import Calculator from '../Calculator';
import ExchangeRate from '../ExchangeRate';
import { DepositDetailForMobileProps } from '../types';
import { useMemo } from 'react';
import { qrCodePlaceholder } from '../../../assets/images';
import { CHECK_TXN_BUTTON, CHECKING_TXN_BUTTON, DEPOSIT_ADDRESS_LABEL } from '../../../constants/deposit';
import CommonAddress from '../../CommonAddress';
import CommonImage from '../../CommonImage';
import CommonQRCode from '../../CommonQRCode';
import DepositInfo from '../DepositInfo';
import { DepositRetryForMobile } from '../DepositRetry';
import DepositTip from '../DepositTip';
import CommonButton from '../../CommonButton';
import { CommonButtonSize, CopySize } from '../../../types/components';
import NotLoginTip from '../NotLoginTip';

export default function DepositDetailForMobile({
  className,
  componentStyle,
  isShowErrorTip,
  chainItem,
  depositTokenSymbol,
  depositTokenDecimals,
  receiveTokenSymbol,
  networkItem,
  depositInfo,
  contractAddress,
  contractAddressLink,
  qrCodeValue,
  tokenLogoUrl,
  showRetry = false,
  isCheckTxnLoading = false,
  isShowNotLoginTip = false,
  onLogin,
  onRetry,
  onCheckTxnClick,
}: DepositDetailForMobileProps) {
  const allSelected = useMemo(() => {
    return !!depositTokenSymbol && !!receiveTokenSymbol && !!chainItem?.key && !!networkItem?.network;
  }, [chainItem?.key, depositTokenSymbol, networkItem?.network, receiveTokenSymbol]);

  const renderExchangeRate = useMemo(() => {
    return (
      depositTokenSymbol &&
      receiveTokenSymbol &&
      chainItem?.key &&
      depositTokenSymbol !== receiveTokenSymbol && (
        <>
          <CommonSpace direction="vertical" size={12} />
          <ExchangeRate
            isShowErrorTip={isShowErrorTip}
            fromSymbol={depositTokenSymbol}
            toSymbol={receiveTokenSymbol}
            toChainId={chainItem.key}
            slippage={depositInfo.extraInfo?.slippage}
          />
        </>
      )
    );
  }, [chainItem?.key, depositInfo.extraInfo?.slippage, depositTokenSymbol, isShowErrorTip, receiveTokenSymbol]);

  const renderCalculator = useMemo(() => {
    return (
      depositTokenSymbol !== receiveTokenSymbol && (
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
      )
    );
  }, [chainItem, depositTokenDecimals, depositTokenSymbol, isShowErrorTip, receiveTokenSymbol]);

  const renderDepositAddress = useMemo(() => {
    return (
      <div className={'deposit-address'}>
        <div className={clsx('etransfer-ui-flex-row-content-center')}>
          {qrCodeValue ? (
            <CommonQRCode value={qrCodeValue} logoUrl={tokenLogoUrl} />
          ) : (
            <CommonImage
              className={clsx('etransfer-ui-flex-none')}
              src={qrCodePlaceholder as unknown as string}
              width={164}
              height={164}
              alt="qrCodePlaceholder"
            />
          )}
        </div>
        <CommonSpace direction="vertical" size={16} />
        {showRetry && <DepositRetryForMobile onClick={onRetry} />}
        {!showRetry && !!depositInfo?.depositAddress && (
          <CommonAddress
            label={DEPOSIT_ADDRESS_LABEL}
            value={depositInfo.depositAddress}
            componentStyle={componentStyle}
            copySize={CopySize.Big}
          />
        )}
        {!showRetry && !!depositInfo.depositAddress && (
          <div className="etransfer-ui-flex-center">
            <CommonButton
              className={'etransfer-ui-check-txn-btn'}
              size={CommonButtonSize.ExtraSmall}
              onClick={onCheckTxnClick}
              loading={isCheckTxnLoading}>
              {isCheckTxnLoading ? CHECKING_TXN_BUTTON : CHECK_TXN_BUTTON}
            </CommonButton>
          </div>
        )}
      </div>
    );
  }, [
    componentStyle,
    depositInfo.depositAddress,
    isCheckTxnLoading,
    onCheckTxnClick,
    onRetry,
    qrCodeValue,
    showRetry,
    tokenLogoUrl,
  ]);

  const renderDepositInfo = useMemo(() => {
    return (
      <>
        {allSelected && <DepositTip fromToken={depositTokenSymbol} toToken={receiveTokenSymbol} isShowIcon={false} />}

        <CommonSpace direction="vertical" size={16} />

        {depositTokenSymbol && networkItem?.network && renderDepositAddress}

        <CommonSpace direction="vertical" size={12} />

        {depositTokenSymbol && networkItem?.network && depositInfo?.depositAddress && (
          <DepositInfo
            modalContainer={'#etransferMobileDepositDetailDrawer'}
            networkName={networkItem?.name}
            minimumDeposit={depositInfo.minAmount}
            contractAddress={contractAddress}
            contractAddressLink={contractAddressLink}
            minAmountUsd={depositInfo.minAmountUsd}
            serviceFee={depositInfo.serviceFee || ''}
            serviceFeeUsd={depositInfo.serviceFeeUsd || ''}
            depositTokenSymbol={depositTokenSymbol}
            extraNotes={depositInfo.extraNotes}
            componentStyle={componentStyle}
          />
        )}
      </>
    );
  }, [
    allSelected,
    depositTokenSymbol,
    receiveTokenSymbol,
    networkItem?.network,
    networkItem?.name,
    renderDepositAddress,
    depositInfo?.depositAddress,
    depositInfo.minAmount,
    depositInfo.minAmountUsd,
    depositInfo.serviceFee,
    depositInfo.serviceFeeUsd,
    depositInfo.extraNotes,
    contractAddress,
    contractAddressLink,
    componentStyle,
  ]);

  return (
    <div className={clsx('etransfer-ui-deposit-detail-for-mobile', className)}>
      {renderExchangeRate}

      {renderCalculator}

      <CommonSpace size={24} />

      {isShowNotLoginTip ? <NotLoginTip onLogin={() => onLogin?.()} /> : renderDepositInfo}
    </div>
  );
}
