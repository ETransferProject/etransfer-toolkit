import clsx from 'clsx';
import './index.less';
import CommonButton from '../../CommonButton';
import CommonSpace from '../../CommonSpace';
import Calculator from '../Calculator';
import ExchangeRate from '../ExchangeRate';
import { DepositDetailForMobileProps } from '../types';
import { useCallback, useMemo, useState } from 'react';
import CommonDrawer from '../../CommonDrawer';
import { qrCodePlaceholder } from '../../../assets/images';
import { DEPOSIT_ADDRESS_LABEL } from '../../../constants/deposit';
import CommonAddress from '../../CommonAddress';
import CommonImage from '../../CommonImage';
import CommonQRCode from '../../CommonQRCode';
import DepositInfo from '../DepositInfo';
import { DepositRetryForMobile } from '../DepositRetry';
import DepositTip from '../DepositTip';

export default function DepositDetailForMobile({
  className,
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
  onRetry,
  onNext,
}: DepositDetailForMobileProps) {
  const [isShowDepositInfo, setIsShowDepositInfo] = useState(false);
  const nextDisable = useMemo(
    () => !depositTokenSymbol || !receiveTokenSymbol || !chainItem?.key || !networkItem?.network,
    [chainItem?.key, depositTokenSymbol, networkItem?.network, receiveTokenSymbol],
  );

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
        {!showRetry && depositInfo?.depositAddress && (
          <CommonAddress label={DEPOSIT_ADDRESS_LABEL} value={depositInfo.depositAddress} />
        )}
      </div>
    );
  }, [depositInfo.depositAddress, onRetry, qrCodeValue, showRetry, tokenLogoUrl]);

  const renderDepositInfoDrawer = useMemo(() => {
    return (
      <CommonDrawer
        id="etransferMobileDepositDetailDrawer"
        className={'etransfer-ui-deposit-detail-drawer'}
        open={isShowDepositInfo}
        onClose={() => setIsShowDepositInfo(false)}
        destroyOnClose
        placement="bottom"
        title="Deposit Address"
        closable={true}
        height="88%">
        {depositTokenSymbol && receiveTokenSymbol && (
          <DepositTip fromToken={depositTokenSymbol} toToken={receiveTokenSymbol} isShowIcon={false} />
        )}

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
            depositTokenSymbol={depositTokenSymbol}
            extraNotes={depositInfo.extraNotes}
          />
        )}
      </CommonDrawer>
    );
  }, [
    isShowDepositInfo,
    depositTokenSymbol,
    receiveTokenSymbol,
    networkItem?.network,
    networkItem?.name,
    renderDepositAddress,
    depositInfo?.depositAddress,
    depositInfo.minAmount,
    depositInfo.minAmountUsd,
    depositInfo.extraNotes,
    contractAddress,
    contractAddressLink,
  ]);

  const onClickNext = useCallback(async () => {
    await onNext();
    setIsShowDepositInfo(true);
  }, [onNext]);

  return (
    <div className={clsx('etransfer-ui-deposit-detail-for-mobile', className)}>
      {depositTokenSymbol && receiveTokenSymbol && chainItem?.key && depositTokenSymbol !== receiveTokenSymbol && (
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

      <div
        className={clsx(
          'etransfer-ui-deposit-detail-for-mobile-next-button-wrapper',
          'etransfer-ui-deposit-detail-for-mobile-next-button-wrapper-safe-area',
        )}>
        <CommonSpace direction="vertical" size={24} />
        <CommonButton
          className="etransfer-ui-deposit-detail-for-mobile-next-button"
          onClick={onClickNext}
          disabled={nextDisable}>
          Next
        </CommonButton>
      </div>

      {renderDepositInfoDrawer}
    </div>
  );
}
