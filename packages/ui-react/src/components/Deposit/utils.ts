import { TNetworkItem } from '@etransfer/types';
import {
  getDepositSupportChainIds,
  getDepositSupportNetworks,
  getDepositSupportDepositTokens,
  getDepositSupportReceiveTokens,
} from '../../provider/utils';
import { DepositReceiveTokenItem, DepositTokenOptionItem } from './types';
import { IChainMenuItem } from '../../types';
import { ChainId } from '@portkey/types';
import { CHAIN_MENU_DATA } from '../../constants';

export const checkDepositSupportDepositTokenList = (list: DepositTokenOptionItem[]) => {
  const res = getDepositSupportDepositTokens();
  if (!res.isLimit) return list;

  return list?.filter((item) => res.limits?.includes(item.symbol));
};

export const checkDepositSupportReceiveTokenList = (list: DepositReceiveTokenItem[]) => {
  const res = getDepositSupportReceiveTokens();
  if (!res.isLimit) return list;

  return list?.filter((item) => res.limits?.includes(item.symbol));
};

export const checkDepositSupportNetworkList = (list: TNetworkItem[]) => {
  const res = getDepositSupportNetworks();
  if (!res.isLimit) return list;

  return list?.filter((item) => res.limits?.includes(item.network));
};

export const checkDepositSupportChainList = (list: ChainId[]) => {
  const res = getDepositSupportChainIds();
  if (!res.isLimit) return list;

  return list?.filter((item) => res.limits?.includes(item));
};

export const checkDepositSupportChain = (chainId: ChainId) => {
  const res = getDepositSupportChainIds();
  if (!res.isLimit) return true;

  return res.limits?.includes(chainId);
};

export const checkDepositSupportTokenAndChain = (list: DepositTokenOptionItem[]) => {
  const depositTokenList = checkDepositSupportDepositTokenList(list);

  depositTokenList.forEach((from) => {
    if (from.toTokenList) {
      from.toTokenList = checkDepositSupportReceiveTokenList(from.toTokenList);

      from.toTokenList?.forEach((to) => {
        const toChainList: IChainMenuItem[] = [];
        if (to?.chainIdList) {
          to.chainIdList = checkDepositSupportChainList(to.chainIdList);
          to?.chainIdList?.forEach((item) => {
            if (CHAIN_MENU_DATA[item]?.key) {
              toChainList.push(CHAIN_MENU_DATA[item]);
            }
          });
          to.chainList = toChainList;
        }
      });
    }
  });

  return JSON.parse(JSON.stringify(depositTokenList));
};
