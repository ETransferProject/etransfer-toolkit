import clsx from 'clsx';
import './index.less';
import { TokenSelectForWeb, TokenSelectProps } from '../TokenSelect';

interface TokenSelectDropdownProps extends TokenSelectProps {
  open: boolean;
  onClose: () => void;
}

export default function TokenSelectDropdown({
  className,
  open = false,
  tokenList,
  selectedToken,
  isDisabled,
  isShowLoading,
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
          isShowImage={open}
          tokenList={tokenList}
          selectedToken={selectedToken}
          onSelect={onSelect}
          isDisabled={isDisabled}
          isShowLoading={isShowLoading}
        />
      </div>
    </div>
  );
}
