import clsx from 'clsx';
import './index.less';
import { TokenSelectForWeb, TokenSelectProps } from '../TokenSelect';

interface TokenSelectDropdownProps extends TokenSelectProps {
  listClassName?: string;
  itemClassName?: string;
  open: boolean;
  onClose: () => void;
}

export default function TokenSelectDropdown({
  className,
  listClassName,
  itemClassName,
  open = false,
  tokenList,
  selectedToken,
  isDisabled,
  isShowBalance,
  chainId,
  networkType,
  accountAddress,
  onSelect,
  onClose,
}: TokenSelectDropdownProps) {
  return (
    <div className={'etransfer-ui-token-select-dropdown'}>
      <div
        className={clsx(
          'token-select-dropdown-mask',
          open ? 'token-select-dropdown-show' : 'token-select-dropdown-hidden',
        )}
        onClick={onClose}></div>
      <div
        className={clsx(
          'token-select-dropdown',
          // { ['token-select-dropdown-form-item']: isFormItemStyle },
          open ? 'token-select-dropdown-show' : 'token-select-dropdown-hidden',
          className,
        )}>
        <TokenSelectForWeb
          className={listClassName}
          itemClassName={itemClassName}
          open={open}
          isShowImage={open}
          tokenList={tokenList}
          selectedToken={selectedToken}
          onSelect={onSelect}
          isDisabled={isDisabled}
          isShowBalance={isShowBalance}
          chainId={chainId}
          networkType={networkType}
          accountAddress={accountAddress}
        />
      </div>
    </div>
  );
}
