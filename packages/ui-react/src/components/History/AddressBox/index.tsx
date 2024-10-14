import clsx from 'clsx';
import './index.less';
import { useCallback, useMemo } from 'react';
import { SupportedChainId } from '@etransfer/types';
import { formatDIDAddress, getOmittedStr } from '@etransfer/utils';
import { ChainId } from '@portkey/types';
import {
  BlockchainNetworkType,
  AelfExploreType,
  OtherExploreType,
  ExploreUrlNotAelf,
  DEFAULT_NULL_VALUE,
  COBO_CUSTODY,
} from '../../../constants';
import { openWithBlank, getAelfExploreLink, getOtherExploreLink } from '../../../utils';
import CommonTooltip from '../../CommonTooltip';
import Copy from '../../Copy';
import { NetworkLogo } from '../../NetworkLogo';
import { ComponentStyle } from '../../../types';
import { TAelfAccounts } from '../../../provider/types';
import { CopySize } from '../../../types/components';

export type TAddressBoxProps = {
  type: 'To' | 'From';
  fromAddress: string;
  toAddress: string;
  network: string;
  fromChainId?: ChainId;
  toChainId?: ChainId;
  accounts: TAelfAccounts;
  componentStyle?: ComponentStyle;
};

export default function AddressBox({
  type,
  fromAddress,
  toAddress,
  network,
  fromChainId,
  toChainId,
  accounts,
  componentStyle = ComponentStyle.Web,
}: TAddressBoxProps) {
  const chainId = useMemo(() => {
    return type === 'To' ? toChainId : fromChainId;
  }, [fromChainId, toChainId, type]);

  const calcAddress = useCallback(() => {
    const address = type === 'To' ? toAddress : fromAddress;
    if (address && network === BlockchainNetworkType.AELF) {
      // format address: add suffix
      return formatDIDAddress(address, chainId);
    }
    if (!address && network === BlockchainNetworkType.AELF && chainId) {
      if (accounts && accounts[chainId]) {
        return accounts[chainId] || accounts[SupportedChainId.AELF] || DEFAULT_NULL_VALUE;
      }
      return DEFAULT_NULL_VALUE;
    }
    return address || DEFAULT_NULL_VALUE;
  }, [type, toAddress, fromAddress, network, chainId, accounts]);

  const handleAddressClick = useCallback(
    (event: any) => {
      event.stopPropagation();
      // link to Deposit: toTransfer.chainId and Withdraw: fromTransfer.chainId
      if (network === BlockchainNetworkType.AELF && chainId) {
        openWithBlank(getAelfExploreLink(calcAddress(), AelfExploreType.address, chainId));
        return;
      }
      openWithBlank(
        getOtherExploreLink(calcAddress(), OtherExploreType.address, network as keyof typeof ExploreUrlNotAelf),
      );
    },
    [network, chainId, calcAddress],
  );

  return (
    <div
      className={clsx(
        'etransfer-ui-history-address-box',
        componentStyle === ComponentStyle.Mobile
          ? 'etransfer-ui-history-mobile-address-box'
          : 'etransfer-ui-history-web-address-box',
      )}>
      <NetworkLogo network={network === BlockchainNetworkType.AELF && chainId ? chainId : network} size="small" />
      {calcAddress() === COBO_CUSTODY || calcAddress() === DEFAULT_NULL_VALUE ? (
        <span className={clsx('etransfer-ui-history-address-word-static')}>{calcAddress()}</span>
      ) : (
        <>
          <CommonTooltip title={calcAddress()} trigger={'hover'}>
            <span className={clsx('etransfer-ui-history-address-box-word')} onClick={handleAddressClick}>
              {getOmittedStr(calcAddress(), 8, 9)}
            </span>
          </CommonTooltip>
          <Copy toCopy={calcAddress()} size={CopySize.Small} />
        </>
      )}
    </div>
  );
}
