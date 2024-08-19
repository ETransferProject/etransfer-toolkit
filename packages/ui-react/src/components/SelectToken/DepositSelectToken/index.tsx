import { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import './index.less';
import { formatSymbolDisplay } from '../../../utils/format';
import TokenImage from '../TokenImage';
import DynamicArrow from '../../DynamicArrow';
import TokenSelectDrawer from '../TokenSelectDrawer';
import TokenSelectDropdown from '../TokenSelectDropdown';
import { TTokenOptionItem } from '@etransfer/types';
import CommonSvg from '../../CommonSvg';

type TSelectTokenProps = {
  title?: string;
  tokenList?: TTokenOptionItem[];
  selected?: TTokenOptionItem;
  isDisabled?: boolean;
  className?: string;
  onChange?: (item: TTokenOptionItem) => void;
  selectCallback: (item: TTokenOptionItem) => void;
};

interface DepositTokenResultProps {
  selected?: TTokenOptionItem;
  imageSize?: number;
  isArrowDown?: boolean;
  onClick: () => void;
}

function DepositTokenResult({ selected, imageSize = 24, isArrowDown = true, onClick }: DepositTokenResultProps) {
  const symbolFormat = useMemo(() => formatSymbolDisplay(selected?.symbol || ''), [selected?.symbol]);

  const renderNotSelected = useMemo(() => {
    return (
      <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-select-token-not-selected')}>
        <CommonSvg type="addBig" />
        <span className={'select-token-value-placeholder'}>Select Token</span>
      </div>
    );
  }, []);

  return (
    <div
      id="etransfer-ui-deposit-select-token-result"
      className={clsx('etransfer-ui-select-token-result')}
      onClick={onClick}>
      <div className={'select-token-value-row'}>
        {selected?.symbol ? (
          <span className={clsx('etransfer-ui-flex-row-center', 'select-token-value-selected')}>
            <TokenImage isShowImage={true} symbol={symbolFormat} src={selected.icon} size={imageSize} />
            <span className={'primary'}>{symbolFormat}</span>
            <span className={'secondary'}>{selected.name}</span>
          </span>
        ) : (
          renderNotSelected
        )}
        <DynamicArrow isExpand={!isArrowDown} />
      </div>
    </div>
  );
}

export function DepositSelectTokenForWeb({
  tokenList,
  selected,
  isDisabled,
  className,
  onChange,
  selectCallback,
}: TSelectTokenProps) {
  const [isShowTokenSelectDropdown, setIsShowTokenSelectDropdown] = useState<boolean>(false);

  const onSelectToken = useCallback(
    async (item: TTokenOptionItem) => {
      if (item.symbol === selected?.symbol) {
        setIsShowTokenSelectDropdown(false);
        return;
      }
      onChange?.(item);
      setIsShowTokenSelectDropdown(false);

      selectCallback(item);
    },
    [onChange, selectCallback, selected?.symbol],
  );

  return (
    <div className={clsx('etransfer-ui-deposit-select-token', 'etransfer-ui-deposit-select-token-for-web', className)}>
      <DepositTokenResult
        selected={selected}
        imageSize={24}
        isArrowDown={!isShowTokenSelectDropdown}
        onClick={() => setIsShowTokenSelectDropdown(true)}
      />
      <TokenSelectDropdown
        className={'etransfer-ui-deposit-token-select-dropdown'}
        open={isShowTokenSelectDropdown}
        tokenList={tokenList}
        selectedToken={selected?.symbol}
        isDisabled={isDisabled}
        onSelect={onSelectToken}
        onClose={() => setIsShowTokenSelectDropdown(false)}
      />
    </div>
  );
}

export function DepositSelectTokenForMobile({
  title = '',
  tokenList,
  selected,
  isDisabled,
  className,
  onChange,
  selectCallback,
}: TSelectTokenProps) {
  const [isShowTokenSelectDrawer, setIsShowTokenSelectDrawer] = useState<boolean>(false);

  const onSelectToken = useCallback(
    async (item: TTokenOptionItem) => {
      if (item.symbol === selected?.symbol) {
        setIsShowTokenSelectDrawer(false);
        return;
      }
      onChange?.(item);
      setIsShowTokenSelectDrawer(false);

      selectCallback(item);
    },
    [onChange, selectCallback, selected?.symbol],
  );

  return (
    <div
      className={clsx('etransfer-ui-deposit-select-token', 'etransfer-ui-deposit-select-token-for-mobile', className)}>
      <DepositTokenResult
        selected={selected}
        imageSize={28}
        isArrowDown={!isShowTokenSelectDrawer}
        onClick={() => setIsShowTokenSelectDrawer(true)}
      />
      <TokenSelectDrawer
        open={isShowTokenSelectDrawer}
        onClose={() => setIsShowTokenSelectDrawer(false)}
        title={title}
        tokenList={tokenList}
        selectedToken={selected?.symbol}
        isDisabled={isDisabled}
        onSelect={onSelectToken}
      />
    </div>
  );
}
