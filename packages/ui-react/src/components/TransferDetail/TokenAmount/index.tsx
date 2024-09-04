import { useMemo } from 'react';
import './index.less';
import { OrderStatusEnum } from '@etransfer/types';
import { ZERO } from '@etransfer/utils';
import clsx from 'clsx';
import { DEFAULT_NULL_VALUE, MIN_AMOUNT_DISPLAY, MIN_AMOUNT_USD_DISPLAY, SWAPPING } from '../../../constants';
import { formatSymbolDisplay } from '../../../utils';
import TokenImage from '../../SelectToken/TokenImage';
import { TransferStatusType } from '../../../constants/transfer';

export default function TokenAmount({
  status,
  symbol,
  fromSymbol,
  icon = '',
  amount,
  amountUsd,
  className,
}: {
  status: OrderStatusEnum | TransferStatusType;
  symbol: string;
  fromSymbol?: string;
  icon?: string;
  amount?: string;
  amountUsd?: string;
  className?: string;
}) {
  const formatSymbol = useMemo(() => formatSymbolDisplay(symbol), [symbol]);

  const formatAmount = useMemo(() => {
    if (!amount) return '';
    if (ZERO.plus(amount).isLessThan(ZERO.plus(MIN_AMOUNT_DISPLAY))) {
      return `<${MIN_AMOUNT_DISPLAY}`;
    }
    return amount;
  }, [amount]);

  const formatUsd = useMemo(() => {
    if (!amountUsd) return '';
    if (ZERO.plus(amountUsd).isLessThan(ZERO.plus(MIN_AMOUNT_USD_DISPLAY))) {
      return `<$${MIN_AMOUNT_USD_DISPLAY}`;
    }
    return `$${MIN_AMOUNT_USD_DISPLAY}`;
  }, [amountUsd]);

  const renderFinished = useMemo(() => {
    if (formatAmount && formatSymbol) {
      return (
        <>
          <div className="etransfer-ui-flex-row-center etransfer-ui-token-amount-icon-wrap">
            <TokenImage
              symbol={symbol}
              className={'etransfer-ui-token-amount-icon'}
              src={icon}
              alt={`token-${symbol}`}
              size={16}
            />
            <span className={'etransfer-ui-token-amount-value'}>{formatAmount}</span>
            <span className={'etransfer-ui-token-amount-symbol'}>{` ${formatSymbol}`}</span>
          </div>
          {formatUsd && <div className={'etransfer-ui-token-amount-usd'}>{formatUsd}</div>}
        </>
      );
    }
    return DEFAULT_NULL_VALUE;
  }, [formatAmount, formatSymbol, formatUsd, icon, symbol]);

  const renderProcessing = useMemo(() => {
    if (fromSymbol && fromSymbol !== symbol) {
      return <span className={'etransfer-ui-token-amount-second'}>{SWAPPING}</span>;
    } else {
      return renderFinished;
    }
  }, [fromSymbol, renderFinished, symbol]);

  return (
    <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-token-amount', className)}>
      {(!status || status === OrderStatusEnum.Processing || status === TransferStatusType.Pending) && renderProcessing}
      {(status === OrderStatusEnum.Failed || status === TransferStatusType.Failed) && DEFAULT_NULL_VALUE}
      {(status === OrderStatusEnum.Succeed || status === TransferStatusType.Success) && renderFinished}
    </div>
  );
}
