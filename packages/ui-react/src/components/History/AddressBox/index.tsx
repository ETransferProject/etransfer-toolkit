import clsx from 'clsx';
import './index.less';
import { useCallback } from 'react';
import { SupportedChainId } from '@etransfer/types';
import { formatDIDAddress, getOmittedStr } from '@etransfer/utils';
import { ChainId } from '@portkey/types';
import {
  BlockchainNetworkType,
  AelfExploreType,
  OtherExploreType,
  ExploreUrlType,
  DEFAULT_NULL_VALUE,
} from '../../../constants';
import { openWithBlank, getAelfExploreLink, getOtherExploreLink } from '../../../utils';
import CommonTooltip from '../../CommonTooltip';
import Copy, { CopySize } from '../../Copy';
import { NetworkLogoForMobile } from '../../NetworkLogo';
import { ComponentStyle } from '../../../types';
import { TAelfAccounts } from '../../../provider/types';

export type TAddressBoxProps = {
  type: 'To' | 'From';
  fromAddress: string;
  toAddress: string;
  network: string;
  fromChainId: ChainId;
  toChainId: ChainId;
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
  const calcAddress = useCallback(() => {
    const address = type === 'To' ? toAddress : fromAddress;
    if (address && network === BlockchainNetworkType.AELF) {
      // format address: add suffix
      const chainId: ChainId = type === 'To' ? toChainId : fromChainId;
      return formatDIDAddress(address, chainId);
    }
    if (!address && network === BlockchainNetworkType.AELF) {
      const chainId = type === 'To' ? toChainId : fromChainId;
      if (accounts && accounts[chainId]) {
        return accounts[chainId] || accounts[SupportedChainId.AELF] || DEFAULT_NULL_VALUE;
      }
      return DEFAULT_NULL_VALUE;
    }
    return address || DEFAULT_NULL_VALUE;
  }, [type, network, accounts, toChainId, fromChainId, fromAddress, toAddress]);

  const handleAddressClick = useCallback(() => {
    // link to Deposit: toTransfer.chainId and Withdraw: fromTransfer.chainId
    if (network === BlockchainNetworkType.AELF) {
      openWithBlank(
        getAelfExploreLink(calcAddress(), AelfExploreType.address, type === 'To' ? toChainId : fromChainId),
      );
      return;
    }
    openWithBlank(getOtherExploreLink(calcAddress(), OtherExploreType.address, network as keyof typeof ExploreUrlType));
  }, [network, calcAddress, type, toChainId, fromChainId]);

  return (
    <div
      className={clsx(
        'etransfer-ui-history-address-box',
        componentStyle === ComponentStyle.Mobile
          ? 'etransfer-ui-history-mobile-address-box'
          : 'etransfer-ui-history-web-address-box',
      )}>
      <NetworkLogoForMobile network={network} size="small" />
      <CommonTooltip title={calcAddress()} trigger={'hover'}>
        <span className={clsx('etransfer-ui-history-address-box-word')} onClick={handleAddressClick}>
          {getOmittedStr(calcAddress(), 8, 9)}
        </span>
      </CommonTooltip>
      <Copy toCopy={calcAddress()} size={CopySize.Small} />
    </div>
  );
}
