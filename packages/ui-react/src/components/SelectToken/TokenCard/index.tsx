import clsx from 'clsx';
import './index.less';
import { formatSymbolDisplay } from '../../../utils/format';
import TokenImage from '../TokenImage';
import { BalanceAndUSD } from '../BalanceAndUSD';
import { ChainId } from '@portkey/types';
import { NetworkType } from '../../../types';

export type TShowBalanceProps = {
  isShowBalance?: boolean;
  decimals?: string | number;
  chainId?: ChainId;
  networkType?: NetworkType;
  accountAddress?: string;
};

export interface TokenCardProps extends TShowBalanceProps {
  src: string;
  name: string;
  symbol: string;
  className?: string;
  isShowing?: boolean;
  isDisabled?: boolean;
  isShowImage?: boolean;
  onClick: () => void;
}

export function TokenCardForMobile({
  className,
  src,
  name,
  symbol,
  decimals,
  chainId,
  networkType,
  accountAddress,
  isShowing = false,
  isDisabled = false,
  isShowImage,
  isShowBalance = false,
  onClick,
}: TokenCardProps) {
  return (
    <div
      className={clsx(
        'etransfer-ui-flex-row-center-between',
        'etransfer-ui-token-card-for-mobile',
        isDisabled && 'etransfer-ui-token-card-disabled',
        className,
      )}
      onClick={onClick}>
      <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-token-card-for-mobile-left')}>
        <TokenImage src={src} isShowImage={isShowImage} symbol={formatSymbolDisplay(symbol)} />
        <span className={'token-card-name'}>{formatSymbolDisplay(symbol)}</span>
        <span className={'token-card-symbol'}>{name}</span>
      </div>

      {isShowing && isShowBalance && !!decimals && !!chainId && !!networkType && !!accountAddress && (
        <BalanceAndUSD
          symbol={symbol}
          decimals={decimals}
          chainId={chainId}
          networkType={networkType}
          accountAddress={accountAddress}
        />
      )}
    </div>
  );
}

export function TokenCardForWeb({
  className,
  src,
  name,
  symbol,
  decimals,
  chainId,
  networkType,
  accountAddress,
  isShowing = false,
  isDisabled = false,
  isShowImage,
  isShowBalance = false,
  onClick,
}: TokenCardProps) {
  return (
    <div
      className={clsx(
        'etransfer-ui-flex',
        'etransfer-ui-token-card-for-web',
        'etransfer-ui-token-card-for-web-hover',
        isDisabled && 'etransfer-ui-token-card-disabled',
        className,
      )}
      onClick={onClick}>
      <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-token-card-for-web-left')}>
        <TokenImage src={src} isShowImage={isShowImage} symbol={formatSymbolDisplay(symbol)} />
        <span className={'token-card-name'}>{formatSymbolDisplay(symbol)}</span>
        <span className={'token-card-symbol'}>{name}</span>
      </div>
      {isShowing && isShowBalance && !!decimals && !!chainId && !!networkType && !!accountAddress && (
        <BalanceAndUSD
          symbol={symbol}
          decimals={decimals}
          chainId={chainId}
          networkType={networkType}
          accountAddress={accountAddress}
        />
      )}
    </div>
  );
}
