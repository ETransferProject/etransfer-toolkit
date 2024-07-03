import clsx from 'clsx';
import { DepositSelectGroupProps } from '../types';
import { ComponentStyle } from '../../../types/common';
import CommonSvg from '../../CommonSvg';
import DepositSelectChain from '../../SelectChain/DepositSelectChain';
import { DepositSelectNetworkForWeb } from '../../SelectNetwork/DepositSelectNetwork';
import { DepositSelectTokenForWeb } from '../../SelectToken/DepositSelectToken';
import './index.less';

export function DepositSelectGroupForWeb({
  depositTokenList,
  depositTokenSelected,
  depositTokenSelectCallback,
  networkList,
  networkSelected,
  isShowNetworkLoading,
  networkSelectCallback,
  chainList,
  chainSelected,
  chainChanged,
  receiveTokenList,
  receiveTokenSelected,
  receiveTokenSelectCallback,
}: DepositSelectGroupProps) {
  return (
    <div>
      <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-selected-data-wrapper')}>
        <div className={clsx('etransfer-ui-selected-token-wrapper')}>
          <div className={'label'}>Deposit Token</div>
          <DepositSelectTokenForWeb
            className={'selected-token'}
            tokenList={depositTokenList}
            selected={depositTokenSelected}
            selectCallback={depositTokenSelectCallback}
          />
        </div>
        <div className={'space'}></div>
        <div className={clsx('etransfer-ui-selected-token-wrapper')}>
          <div className={'label'}>Receive Token</div>
          <DepositSelectTokenForWeb
            className={'selected-token'}
            tokenList={receiveTokenList}
            selected={receiveTokenSelected}
            selectCallback={receiveTokenSelectCallback}
          />
        </div>
      </div>

      <div className={clsx('etransfer-ui-row-center', 'etransfer-ui-arrow-right')}>
        <CommonSvg type="doubleArrow" />
      </div>

      <div
        className={clsx(
          'etransfer-ui-flex-row-center',
          'etransfer-ui-selected-data-wrapper',
          'etransfer-ui-selected-row-2',
        )}>
        <div className={clsx('etransfer-ui-selected-chain-wrapper')}>
          <div className={'label'}>From</div>
          <DepositSelectNetworkForWeb
            className={'selected-chain'}
            networkList={networkList}
            selected={networkSelected}
            isShowLoading={isShowNetworkLoading}
            selectCallback={networkSelectCallback}
          />
        </div>
        <div className={'space'}></div>
        <div
          className={clsx('etransfer-ui-position-relative', 'etransfer-ui-selected-chain-wrapper')}
          id="etransferWebDepositChainWrapper">
          <div className={clsx('etransfer-ui-flex-row-center-between', 'label')}>
            <span>To</span>
            <div className="etransfer-ui-flex-row-center">
              <div className={'circle'} />
              <span className={'connected'}>Connected</span>
            </div>
          </div>

          <DepositSelectChain
            className={'selected-chain'}
            menuItems={chainList}
            selectedItem={chainSelected}
            mobileTitle="Deposit To"
            componentStyle={ComponentStyle.Web}
            chainChanged={chainChanged}
          />
        </div>
      </div>
    </div>
  );
}
