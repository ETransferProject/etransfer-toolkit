import clsx from 'clsx';
import './index.less';
import { TokenCardForMobile, TokenCardForWeb } from '../TokenCard';
import { TTokenOptionItem } from '@etransfer/types';

export interface TokenSelectProps {
  className?: string;
  isShowImage?: boolean;
  tokenList?: TTokenOptionItem[];
  selectedToken?: string;
  isDisabled?: boolean;
  isShowLoading?: boolean;
  onSelect: (item: TTokenOptionItem) => Promise<void>;
}

export function TokenSelectForMobile({
  className,
  isShowImage,
  tokenList,
  selectedToken,
  isDisabled,
  onSelect,
}: TokenSelectProps) {
  return (
    <div className={clsx('token-select', 'token-select-for-mobile', className)}>
      <div className={'token-select-list'}>
        {tokenList?.map((item, idx) => {
          return (
            <TokenCardForMobile
              key={'token-select' + item.symbol + idx}
              className={selectedToken == item.symbol ? 'token-card-selected' : undefined}
              isDisabled={isDisabled}
              name={item?.name || ''}
              src={item.icon}
              symbol={item.symbol}
              isShowImage={isShowImage}
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
  tokenList,
  selectedToken,
  isDisabled,
  onSelect,
  isShowImage,
}: TokenSelectProps) {
  return (
    <div className={clsx('token-select', 'token-select-for-web', className)}>
      <div className={'token-select-list'}>
        {tokenList?.map((item, idx) => {
          return (
            <TokenCardForWeb
              key={'token-select' + item.symbol + idx}
              className={selectedToken == item.symbol ? 'token-card-selected' : undefined}
              isDisabled={isDisabled}
              src={item.icon}
              name={item?.name || ''}
              symbol={item.symbol}
              isShowImage={isShowImage}
              onClick={() => onSelect(item)}
            />
          );
        })}
      </div>
    </div>
  );
}
