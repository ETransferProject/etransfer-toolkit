import clsx from 'clsx';
import './index.less';
import { useCallback } from 'react';
import { formatDIDAddress, getOmittedStr } from '@etransfer/utils';
import {
  BlockchainNetworkType,
  DEFAULT_NULL_VALUE,
  AelfExploreType,
  OtherExploreType,
  ExploreUrlNotAelf,
  CHAIN_ID_LIST,
  COBO_CUSTODY,
} from '../../../constants';
import { openWithBlank, getAelfExploreLink, getOtherExploreLink } from '../../../utils';
import CommonTooltip from '../../CommonTooltip';
import Copy from '../../Copy';
import { ChainId } from '@portkey/types';
import { CopySize } from '../../../types/components';

interface WalletAddressProps {
  address: string;
  network: string;
  chainId?: ChainId;
  isOmitAddress?: boolean;
  className?: string;
}

export default function WalletAddress({
  address,
  network,
  chainId,
  isOmitAddress = true,
  className,
}: WalletAddressProps) {
  const calcAddress = useCallback(() => {
    if (chainId && network === BlockchainNetworkType.AELF) {
      if (address && CHAIN_ID_LIST.includes(chainId)) {
        // aelf chain address: add prefix and suffix
        return formatDIDAddress(address, chainId);
      } else {
        return address || DEFAULT_NULL_VALUE;
      }
    }

    return address || DEFAULT_NULL_VALUE;
  }, [chainId, network, address]);

  const handleAddressClick = useCallback(
    (event: any) => {
      event.stopPropagation();
      if (chainId && network === BlockchainNetworkType.AELF && CHAIN_ID_LIST.includes(chainId)) {
        openWithBlank(getAelfExploreLink(calcAddress(), AelfExploreType.address, chainId));
        return;
      }

      openWithBlank(
        getOtherExploreLink(calcAddress(), OtherExploreType.address, network as keyof typeof ExploreUrlNotAelf),
      );
    },
    [chainId, network, calcAddress],
  );

  return (
    <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-wallet-address-container', className)}>
      {calcAddress() === COBO_CUSTODY ? (
        <span className={clsx('etransfer-ui-wallet-address-cobo')}>{COBO_CUSTODY}</span>
      ) : (
        <>
          <CommonTooltip title={calcAddress()} trigger={'hover'}>
            <span className={clsx('etransfer-ui-wallet-address')} onClick={handleAddressClick}>
              {isOmitAddress ? getOmittedStr(calcAddress(), 8, 9) : calcAddress()}
            </span>
          </CommonTooltip>
          {!!calcAddress() && calcAddress() !== DEFAULT_NULL_VALUE && (
            <Copy toCopy={calcAddress()} size={CopySize.Small} />
          )}
        </>
      )}
    </div>
  );
}
