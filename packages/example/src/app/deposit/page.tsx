'use client';

import { eTransferCore } from '@/utils/core';
import { Button, Divider, Select } from 'antd';
import { useCallback, useState } from 'react';
import { BusinessType } from '@etransfer/types';
import { TDepositInfo, TNetworkItem } from '@etransfer/services';
import { ChainList } from '@/config';
import { ChainId } from '@portkey/types';

type TCascadeSelectorOption = {
  value: string;
  label: string;
  name: string;
  symbol: string;
  icon: string;
  contractAddress: string;
  decimals: number;
  toTokenList: TCascadeSelectorOption[];
  children?: TCascadeSelectorOption[];
};

export default function Deposit() {
  // From
  const [fromTokenList, setFromTokenList] = useState<TCascadeSelectorOption[]>([]);
  const [fromToken, setFromToken] = useState<string>('USDT');
  const [fromNetworkList, setFromNetworkList] = useState<TNetworkItem[]>([]);
  const [fromNetwork, setFromNetwork] = useState<string>('');

  // To
  const [toTokenList, setToTokenList] = useState<TCascadeSelectorOption[]>([]);
  const [toToken, setToToken] = useState<string>('');
  const [toChain, setToChain] = useState<ChainId>(ChainList[1].key);

  // deposit info
  const [depositInfo, setDepositInfo] = useState<TDepositInfo | undefined>();

  const fetchNetworkList = useCallback(
    async (symbol?: string) => {
      try {
        const res = await eTransferCore.services.getNetworkList({
          type: BusinessType.Deposit,
          chainId: 'tDVW',
          symbol: symbol || fromToken,
        });
        const list: any[] = JSON.parse(JSON.stringify(res.networkList)) || [];
        list.forEach(item => {
          item.label = item.network;
          item.value = item.network;
        });
        setFromNetworkList(list);
        setFromNetwork('');
      } catch (error) {
        console.error('fetchNetworkList', error);
      }
    },
    [fromToken],
  );

  const fetchTokenOption = useCallback(async () => {
    try {
      const res = await eTransferCore.services.getTokenOption({ type: BusinessType.Deposit });
      const tokenList: TCascadeSelectorOption[] = JSON.parse(JSON.stringify(res.tokenList));
      tokenList.forEach(token => {
        token.value = token.symbol;
        token.label = token.symbol;
        token.toTokenList?.forEach(toToken => {
          toToken.value = toToken.symbol;
          toToken.label = toToken.symbol;
        });
      });

      const toTokenList = tokenList.find(item => item.symbol === fromToken)?.toTokenList || [];

      setFromTokenList(tokenList);
      setToTokenList(toTokenList);
      setToToken(toTokenList[0].symbol);

      await fetchNetworkList();
    } catch (error) {
      console.error('fetchTokenOption', error);
    }
  }, [fetchNetworkList, fromToken]);

  const fetchDepositAddress = useCallback(async () => {
    const res = await eTransferCore.services.getDepositInfo({
      chainId: toChain,
      network: fromNetwork,
      symbol: fromToken,
      toSymbol: toToken,
    });
    setDepositInfo(res.depositInfo);
  }, [fromNetwork, fromToken, toChain, toToken]);

  const onFromTokenChange = useCallback(
    (val: string) => {
      const res = fromTokenList.find(item => item.symbol === val);

      setFromToken(val);
      setToTokenList(res?.toTokenList || []);
      setToToken('');
      setDepositInfo(undefined);
    },
    [fromTokenList],
  );

  const onFromNetworkChange = useCallback((val: string) => {
    setFromNetwork(val);
    setDepositInfo(undefined);
  }, []);

  const onToTokenChange = useCallback((val: string) => {
    setToToken(val);
    setDepositInfo(undefined);
  }, []);

  const onToChainChange = useCallback(
    async (val: ChainId) => {
      setToChain(val);
      setDepositInfo(undefined);

      await fetchNetworkList();
    },
    [fetchNetworkList],
  );

  return (
    <div>
      <h1 className="page-title">Deposit Assets</h1>
      <Divider plain>First Step</Divider>
      <Button onClick={fetchTokenOption}>Get Token\Network Data</Button>

      <Divider plain>Second Step</Divider>
      <section>
        <div className="space-y-2">
          <span className="form-label">Chain:</span>
          <Select value={toChain} style={{ width: 200 }} onChange={onToChainChange} options={ChainList} />
        </div>
        <div className="space-y-2">
          <span className="form-label">From Token:</span>
          <Select value={fromToken} style={{ width: 200 }} onChange={onFromTokenChange} options={fromTokenList} />
        </div>

        <div className="space-y-2">
          <span className="form-label">Network:</span>
          <Select value={fromNetwork} style={{ width: 200 }} onChange={onFromNetworkChange} options={fromNetworkList} />
        </div>

        <div className="space-y-2">
          <span className="form-label">To Token:</span>
          <Select value={toToken} style={{ width: 200 }} onChange={onToTokenChange} options={toTokenList} />
        </div>
      </section>

      <Divider plain>Last Step</Divider>
      <Button onClick={fetchDepositAddress}>Get Deposit Address</Button>
      <span>{`>>> ${depositInfo?.depositAddress || ''}`}</span>
    </div>
  );
}
