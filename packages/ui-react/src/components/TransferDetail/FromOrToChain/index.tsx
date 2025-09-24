import { ChainId } from '@portkey/types';
import { useMemo } from 'react';
import clsx from 'clsx';
import './index.less';
import { BlockchainNetworkType, CHAIN_NAME_ENUM } from '../../../constants';
import { SupportedChainId } from '@etransfer/types';
import { NetworkLogo } from '../../NetworkLogo';

export default function FromOrToChain({
  network,
  chainId,
  className,
}: {
  network: string;
  chainId?: ChainId;
  className?: string;
}) {
  const renderNetworkLogo = useMemo(() => {
    const currentNetwork = network === BlockchainNetworkType.AELF ? chainId : network;
    if (!currentNetwork) return null;
    return <NetworkLogo network={currentNetwork} size="small" />;
  }, [chainId, network]);

  const renderNetworkName = useMemo(() => {
    if (!chainId) return <span className={'etransfer-ui-from-or-to-chain-network-name'}>{network}</span>;

    const currentNetworkName =
      network === BlockchainNetworkType.AELF
        ? chainId === SupportedChainId.AELF
          ? CHAIN_NAME_ENUM.AELF
          : CHAIN_NAME_ENUM[chainId]
        : network;
    return <span className={'etransfer-ui-from-or-to-chain-network-name'}>{currentNetworkName}</span>;
  }, [chainId, network]);

  return (
    <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-from-or-to-chain', className)}>
      {renderNetworkLogo}
      {renderNetworkName}
    </div>
  );
}
