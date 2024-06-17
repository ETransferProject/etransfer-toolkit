import { ChainId } from '@portkey/types';
import { ChainNamePrefix } from './constants/chain';

// testnet
export const SupportChain: Record<string, ChainId> = {
  MainChain: 'AELF',
  SideChain: 'tDVW',
};

// mainnet
// export const SupportChain: Record<string, ChainId> = {
//   MainChain: 'AELF',
//   SideChain: 'tDVV',
// };

export const ChainList = [
  {
    value: SupportChain.MainChain,
    label: ChainNamePrefix.MainChain + ' ' + SupportChain.MainChain,
  },
  {
    value: SupportChain.SideChain,
    label: ChainNamePrefix.SideChain + ' ' + SupportChain.SideChain,
  },
];
