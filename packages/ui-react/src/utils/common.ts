import { AelfExploreType, OtherExploreType, ExploreUrlType } from '../constants/network';
import { ChainId } from '@portkey/types';
import { getAelfExploreUrl } from '../provider/utils';

export function getAelfExploreLink(data: string, type: AelfExploreType, chainId: ChainId): string {
  const prefix = getAelfExploreUrl(chainId);
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
  network: keyof typeof ExploreUrlType,
): string {
  const prefix = ExploreUrlType[network];
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
