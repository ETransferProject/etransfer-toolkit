import { TTokenItem } from '@etransfer/types';
import { ComponentStyle, IChainMenuItem, NetworkType } from '../../../types';
import TokenSelectDrawer from '../TokenSelectDrawer';
import TokenSelectDropdown from '../TokenSelectDropdown';
import DynamicArrow from '../../DynamicArrow';
import { formatSymbolDisplay } from '../../../utils';
import TokenImage from '../TokenImage';
import { useCallback, useState } from 'react';
import clsx from 'clsx';
import 'index.less';

export interface WithdrawSelectTokenProps {
  tokenList: TTokenItem[];
  chainItem: IChainMenuItem;
  selected?: TTokenItem;
  isDisabled?: boolean;
  componentStyle?: ComponentStyle;
  networkType?: NetworkType;
  accountAddress?: string;
  onChange?: (item: TTokenItem) => void;
  selectCallback: (item: TTokenItem) => void;
}

export default function WithdrawSelectToken({
  tokenList,
  chainItem,
  selected,
  isDisabled,
  componentStyle = ComponentStyle.Web,
  networkType = 'MAINNET',
  accountAddress,
  onChange,
  selectCallback,
}: WithdrawSelectTokenProps) {
  const [isShowTokenSelectModal, setIsShowTokenSelectModal] = useState<boolean>(false);
  //   const [{ chainItem, chainList }, { dispatch }] = useETransferWithdraw();

  const onSelectToken = useCallback(
    async (item: TTokenItem) => {
      if (item.symbol === selected?.symbol) {
        setIsShowTokenSelectModal(false);
        return;
      }
      onChange?.(item);
      //   dispatch(setChainItem(item.symbol));
      setIsShowTokenSelectModal(false);

      selectCallback(item);
    },
    [onChange, selectCallback, selected?.symbol],
  );

  return (
    <div className={'etransfer-ui-withdraw-select-token'}>
      <div
        id="etransfer-ui-withdraw-select-token-result"
        className={clsx(
          'etransfer-ui-withdraw-select-token-result',
          'etransfer-ui-withdraw-select-token-result-form-item',
        )}
        onClick={() => setIsShowTokenSelectModal(true)}>
        <div className={'etransfer-ui-withdraw-select-token-value-row'}>
          <div className={'etransfer-ui-withdraw-select-token-value'}>
            {selected?.symbol ? (
              <span
                className={clsx(
                  'etransfer-ui-withdraw-flex-row-center',
                  'etransfer-ui-withdraw-select-token-value-selected',
                )}>
                <TokenImage
                  src={selected.icon}
                  isShowImage={true}
                  symbol={formatSymbolDisplay(selected.symbol)}
                  size={24}
                />
                <span className={'etransfer-ui-withdraw-select-token-primary'}>
                  {formatSymbolDisplay(selected.symbol)}
                </span>
                <span className={'etransfer-ui-withdraw-select-token-secondary'}>{selected.name}</span>
              </span>
            ) : (
              <span className={'etransfer-ui-withdraw-select-token-value-placeholder'}>Select a token</span>
            )}
          </div>
          <DynamicArrow isExpand={isShowTokenSelectModal} size="Big" />
        </div>
      </div>

      {componentStyle === ComponentStyle.Mobile ? (
        <TokenSelectDrawer
          itemClassName="etransfer-ui-withdraw-token-modal-token-item"
          title="Withdraw Assets"
          open={isShowTokenSelectModal}
          onClose={() => setIsShowTokenSelectModal(false)}
          tokenList={tokenList}
          selectedToken={selected?.symbol}
          isDisabled={isDisabled}
          isShowBalance={true}
          chainId={chainItem.key}
          networkType={networkType}
          accountAddress={accountAddress}
          onSelect={onSelectToken}
        />
      ) : (
        <TokenSelectDropdown
          itemClassName="etransfer-ui-withdraw-token-modal-token-item"
          open={isShowTokenSelectModal}
          tokenList={tokenList}
          selectedToken={selected?.symbol}
          isDisabled={isDisabled}
          isShowBalance={true}
          chainId={chainItem.key}
          networkType={networkType}
          accountAddress={accountAddress}
          onSelect={onSelectToken}
          onClose={() => setIsShowTokenSelectModal(false)}
        />
      )}
    </div>
  );
}
