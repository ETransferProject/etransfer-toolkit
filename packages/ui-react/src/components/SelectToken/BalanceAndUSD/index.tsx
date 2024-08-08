import clsx from 'clsx';
import './index.less';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChainId } from '@portkey/types';
import BigNumber from 'bignumber.js';
import CommonSpace from '../../CommonSpace';
import PartialLoading from '../../PartialLoading';
import { DEFAULT_NULL_VALUE } from '../../../constants';
import { etransferCore, getAelfReact, getBalanceDivDecimals } from '../../../utils';
import { CONTRACT_TYPE, NetworkType } from '../../../types';

export function BalanceAndUSD({
  networkType,
  chainId,
  accountAddress,
  symbol,
  decimals,
}: {
  networkType: NetworkType;
  chainId: ChainId;
  accountAddress: string;
  symbol: string;
  decimals: string | number;
}) {
  const [balance, setBalance] = useState<string>('');
  const [balanceUsd, setBalanceUsd] = useState<string>('');

  const fetchTokenPrices = useCallback(async () => {
    try {
      const res = await etransferCore.services.getTokenPrices({ symbols: symbol });
      return res.items;
    } catch (error) {
      console.log('fetchTokenPrices error', error);
      return [];
    }
  }, [symbol]);

  const getBalanceAndUSD = useCallback(
    async (symbol: string, decimals: string | number, chainId: ChainId) => {
      try {
        const { endPoint, contractAddress } = getAelfReact(networkType, chainId);
        const [tokenPrices, balance] = await Promise.all([
          fetchTokenPrices(),
          getBalanceDivDecimals(endPoint, contractAddress[CONTRACT_TYPE.TOKEN], accountAddress, symbol, decimals),
        ]);

        setBalance(balance || '');

        const price = tokenPrices?.find((item) => item.symbol === symbol);
        if (!price || !price?.priceUsd) {
          setBalanceUsd;
        } else {
          setBalanceUsd(
            BigNumber(price?.priceUsd)
              .times(BigNumber(Number(balance)))
              .toFixed(2),
          );
        }
      } catch (error) {
        console.log('getBalanceAndUSD  error', error);
      }
    },
    [accountAddress, fetchTokenPrices, networkType],
  );

  const getBalanceAndUSDRef = useRef(getBalanceAndUSD);
  getBalanceAndUSDRef.current = getBalanceAndUSD;
  useEffect(() => {
    getBalanceAndUSDRef.current(symbol, decimals, chainId);
  }, [chainId, decimals, symbol]);

  if (!balance)
    return (
      <div className="etransfer-ui-flex-column-end">
        <CommonSpace direction="vertical" size={15} />
        <PartialLoading />
        <CommonSpace direction="vertical" size={15} />
      </div>
    );

  return (
    <div className={clsx('etransfer-ui-flex-column-end', 'etransfer-ui-balance-and-usd')}>
      <div className={'etransfer-ui-balance'}>{balance}</div>
      <div className={'etransfer-ui-usd'}>{balanceUsd ? `$ ${balanceUsd}` : DEFAULT_NULL_VALUE}</div>
    </div>
  );
}
