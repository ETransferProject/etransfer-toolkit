import { TNetworkItem, TTokenItem } from '@etransfer/types';
import { getWithdrawSupportNetworks, getWithdrawSupportTokens } from '../../provider/utils';

export const checkWithdrawSupportTokenList = (list: TTokenItem[]) => {
  const res = getWithdrawSupportTokens();
  if (!res.isLimit) return list;

  return list?.filter((item) => res.limits?.includes(item.symbol));
};

export const checkWithdrawSupportNetworkList = (list: TNetworkItem[]) => {
  const res = getWithdrawSupportNetworks();
  if (!res.isLimit) return list;

  return list?.filter((item) => res.limits?.includes(item.network));
};
