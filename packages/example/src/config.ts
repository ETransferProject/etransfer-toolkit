import { ChainId } from '@portkey/types';
import { ChainNamePrefix } from './constants/chain';

export const SupportChain: Record<string, ChainId> = {
  MainChain: 'AELF',
  SideChain: 'tDVW',
};

export const ChainList = [
  {
    key: SupportChain.MainChain,
    label: ChainNamePrefix.MainChain + SupportChain.MainChain,
  },
  {
    key: SupportChain.SideChain,
    label: ChainNamePrefix.SideChain + SupportChain.SideChain,
  },
];
