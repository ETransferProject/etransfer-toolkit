import { TNetworkItem, TTokenItem } from '@etransfer/types';
import { getWithdrawSupportNetworks, getWithdrawSupportTokens } from '../../provider/utils';
import { checkIsEnoughAllowance, ZERO } from '@etransfer/utils';
import { APPROVE_ELF_FEE } from '../../constants';
import { CONTRACT_TYPE } from '../../types';
import { getAccountAddress, getAelfReact, getNetworkType } from '../../utils';
import { ChainId } from '@portkey/types';

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

export const getAelfMaxBalance = async ({
  balance,
  aelfFee,
  tokenSymbol,
  chainId,
  contractAddress,
}: {
  balance: string;
  aelfFee: string;
  tokenSymbol: string;
  chainId: ChainId;
  contractAddress: string;
}) => {
  let _maxBalance = balance;

  if (aelfFee && ZERO.plus(aelfFee).gt(0)) {
    const aelfReact = getAelfReact(getNetworkType(), chainId);
    const accountAddress = getAccountAddress(chainId);
    if (!accountAddress) throw new Error('User address is missing');

    const isEnoughAllowance = await checkIsEnoughAllowance({
      tokenContractAddress: aelfReact.contractAddress[CONTRACT_TYPE.TOKEN],
      endPoint: aelfReact.endPoint,
      symbol: tokenSymbol,
      owner: accountAddress,
      spender: contractAddress,
      amount: _maxBalance,
    });

    let _maxBalanceBignumber;
    if (isEnoughAllowance) {
      _maxBalanceBignumber = ZERO.plus(balance).minus(aelfFee);
    } else {
      _maxBalanceBignumber = ZERO.plus(balance).minus(aelfFee).minus(APPROVE_ELF_FEE);
    }
    _maxBalance = _maxBalanceBignumber.lt(0) ? '0' : _maxBalanceBignumber.toFixed();
  }
  return _maxBalance;
};
