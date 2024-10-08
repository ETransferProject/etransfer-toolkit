import {
  AelfExploreType,
  OtherExploreType,
  ExploreUrlNotAelf,
  BlockchainNetworkType,
  LOOP_TOP_TX_URL,
} from '../constants/network';
import { ChainId } from '@portkey/types';
// import { getAelfExploreUrl } from '../provider/utils';
import { getAelfReact } from './contract';
import { getNetworkType } from './login';

export function getAelfExploreLink(data: string, type: AelfExploreType, chainId: ChainId): string {
  // let prefix = getAelfExploreUrl(chainId);

  // get exploreUrl from local constants
  const networkType = getNetworkType();
  const aelfReact = getAelfReact(networkType, chainId);
  const prefix = aelfReact.exploreUrl;

  if (!prefix) throw new Error(`Please config ${chainId}'s exploreUrl`);

  switch (type) {
    case AelfExploreType.transaction: {
      return `${prefix}tx/${data}`;
    }
    case AelfExploreType.token: {
      return `${prefix}token/${data}`;
    }
    case AelfExploreType.block: {
      return `${prefix}block/${data}`;
    }
    case AelfExploreType.address:
    default: {
      return `${prefix}address/${data}`;
    }
  }
}

export function getOtherExploreLink(
  data: string,
  type: OtherExploreType,
  network: keyof typeof ExploreUrlNotAelf,
): string {
  const prefix = ExploreUrlNotAelf[network];
  switch (type) {
    case OtherExploreType.transaction: {
      if (network === 'TRX') {
        return `${prefix}/#/transaction/${data}`;
      }
      return `${prefix}/tx/${data}`;
    }
    case OtherExploreType.address:
    default: {
      if (network === 'TRX') {
        return `${prefix}/#/address/${data}`;
      }
      return `${prefix}/address/${data}`;
    }
  }
}

export function openWithBlank(url: string): void {
  const newWindow = window.open(url, '_blank');
  if (newWindow) {
    newWindow.opener = null;
  }
}

export const viewTxDetailInExplore = (network: string, txHash: string, isCoboHash: boolean, chainId?: ChainId) => {
  if (isCoboHash) {
    openWithBlank(LOOP_TOP_TX_URL + txHash);
    return;
  }

  if (network === BlockchainNetworkType.AELF && chainId) {
    openWithBlank(getAelfExploreLink(txHash, AelfExploreType.transaction, chainId));
    return;
  }
  openWithBlank(getOtherExploreLink(txHash, OtherExploreType.transaction, network as keyof typeof ExploreUrlNotAelf));
};
