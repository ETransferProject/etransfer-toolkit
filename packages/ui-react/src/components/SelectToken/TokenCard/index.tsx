import clsx from 'clsx';
import './index.less';
import { formatSymbolDisplay } from '../../../utils/format';
import TokenImage from '../TokenImage';

export interface TokenCardProps {
  src: string;
  name: string;
  symbol: string;
  className?: string;
  isDisabled?: boolean;
  isShowImage?: boolean;
  onClick: () => void;
}

export function TokenCardForMobile({
  className,
  src,
  name,
  symbol,
  isDisabled = false,
  isShowImage,
  onClick,
}: TokenCardProps) {
  return (
    <div
      className={clsx(
        'etransfer-ui-token-card-for-mobile',
        'etransfer-ui-token-card-for-web-hover',
        isDisabled && 'etransfer-ui-token-card-disabled',
        className,
      )}
      onClick={onClick}>
      <TokenImage src={src} isShowImage={isShowImage} symbol={formatSymbolDisplay(symbol)} />
      <span className={'token-card-name'}>{formatSymbolDisplay(symbol)}</span>
      <span className={'token-card-symbol'}>{name}</span>
    </div>
  );
}

export function TokenCardForWeb({
  className,
  src,
  name,
  symbol,
  isDisabled = false,
  isShowImage,
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
      <TokenImage src={src} isShowImage={isShowImage} symbol={formatSymbolDisplay(symbol)} />
      <span className={'token-card-name'}>{formatSymbolDisplay(symbol)}</span>
      <span className={'token-card-symbol'}>{name}</span>
    </div>
  );
}
