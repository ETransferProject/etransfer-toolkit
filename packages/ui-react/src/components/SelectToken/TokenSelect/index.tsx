import clsx from 'clsx';
import './index.less';
import { TokenCardForMobile, TokenCardForWeb, TShowBalanceProps } from '../TokenCard';
import { TTokenOptionItem } from '@etransfer/types';

export interface TokenSelectProps extends Omit<TShowBalanceProps, 'decimals'> {
  className?: string;
  itemClassName?: string;
  isShowImage?: boolean;
  tokenList?: TTokenOptionItem[];
  selectedToken?: string;
  open?: boolean;
  isDisabled?: boolean;
  onSelect: (item: TTokenOptionItem) => Promise<void>;
}

export function TokenSelectForMobile({
  className,
  itemClassName,
  isShowImage,
  tokenList,
  selectedToken,
  open,
  isDisabled,
  isShowBalance,
  chainId,
  networkType,
  accountAddress,
  onSelect,
}: TokenSelectProps) {
  return (
    <div className={clsx('token-select', 'token-select-for-mobile', className)}>
      <div className={'token-select-list'}>
        {tokenList?.map((item, idx) => {
          return (
            <TokenCardForMobile
              key={'token-select' + item.symbol + idx}
              className={clsx(selectedToken == item.symbol ? 'token-card-selected' : undefined, itemClassName)}
              isDisabled={isDisabled}
              name={item?.name || ''}
              src={item.icon}
              symbol={item.symbol}
              isShowing={open}
              isShowImage={isShowImage}
              isShowBalance={isShowBalance}
              decimals={item.decimals}
              chainId={chainId}
              networkType={networkType}
              accountAddress={accountAddress}
              onClick={() => onSelect(item)}
            />
          );
        })}
      </div>
    </div>
  );
}

export function TokenSelectForWeb({
  className,
  itemClassName,
  tokenList,
  selectedToken,
  isDisabled,
  open,
  isShowImage,
  isShowBalance,
  chainId,
  networkType,
  accountAddress,
  onSelect,
}: TokenSelectProps) {
  return (
    <div className={clsx('token-select', 'token-select-for-web', className)}>
      <div className={'token-select-list'}>
        {tokenList?.map((item, idx) => {
          return (
            <TokenCardForWeb
              key={'token-select' + item.symbol + idx}
              className={clsx(selectedToken == item.symbol ? 'token-card-selected' : undefined, itemClassName)}
              isDisabled={isDisabled}
              src={item.icon}
              name={item?.name || ''}
              symbol={item.symbol}
              isShowing={open}
              isShowImage={isShowImage}
              isShowBalance={isShowBalance}
              decimals={item.decimals}
              chainId={chainId}
              networkType={networkType}
              accountAddress={accountAddress}
              onClick={() => onSelect(item)}
            />
          );
        })}
      </div>
    </div>
  );
}
