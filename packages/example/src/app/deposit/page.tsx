'use client';

import { eTransferCore } from '@/utils/core';
import { Button, Divider, Select, Input } from 'antd';
import { useCallback, useState } from 'react';
import { BusinessType, TConversionRate, TDepositInfo, TNetworkItem } from '@etransfer/types';
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
  const [toChain, setToChain] = useState<ChainId>(ChainList[1].value);

  // deposit info
  const [depositInfo, setDepositInfo] = useState<TDepositInfo | undefined>();
  const [amount, setAmount] = useState('');
  const [conversionRate, setConversionRate] = useState<TConversionRate | undefined>();

  const fetchNetworkList = useCallback(
    async (symbol?: string) => {
      try {
        const res = await eTransferCore.services.getNetworkList({
          type: BusinessType.Deposit,
          chainId: toChain,
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
    [fromToken, toChain],
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
    try {
      const res = await eTransferCore.services.getDepositInfo({
        chainId: toChain,
        network: fromNetwork,
        symbol: fromToken,
        toSymbol: toToken,
      });
      setDepositInfo(res.depositInfo);
    } catch (error) {
      console.error('fetchDepositAddress', error);
    }
  }, [fromNetwork, fromToken, toChain, toToken]);

  const fetchCalculate = useCallback(async () => {
    try {
      const res = await eTransferCore.services.getDepositCalculate({
        toChainId: toChain,
        fromSymbol: fromToken,
        toSymbol: toToken,
        fromAmount: amount,
      });
      setConversionRate(res.conversionRate);
    } catch (error) {
      console.error('fetchCalculate', error);
    }
  }, [amount, fromToken, toChain, toToken]);

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

  const onChangeAmount = useCallback((event: any) => {
    const value = event.target.value;
    if (!value) {
      setConversionRate(undefined);
    }
    setAmount(event.target.value);
  }, []);

  return (
    <div>
      <h1 className="page-title">Deposit Assets</h1>
      <Divider plain>First Step</Divider>
      <Button onClick={fetchTokenOption}>Get Token\Network Data</Button>

      <Divider plain>Second Step</Divider>
      <section>
        <div className="space-y-2">
          <span className="form-label">Chain:</span>
          <Select value={toChain} className="w-[200px]" onChange={onToChainChange} options={ChainList} />
        </div>
        <div className="space-y-2">
          <span className="form-label">From Token:</span>
          <Select value={fromToken} className="w-[200px]" onChange={onFromTokenChange} options={fromTokenList} />
        </div>

        <div className="space-y-2">
          <span className="form-label">Network:</span>
          <Select value={fromNetwork} className="w-[200px]" onChange={onFromNetworkChange} options={fromNetworkList} />
        </div>

        <div className="space-y-2">
          <span className="form-label">To Token:</span>
          <Select value={toToken} className="w-[200px]" onChange={onToTokenChange} options={toTokenList} />
        </div>

        <div className="space-y-2">
          <span className="form-label">Calculate:</span>
          <Input
            value={amount}
            className="w-[200px]"
            onChange={onChangeAmount}
            placeholder="Please select token first"
          />
          <Button className="ml-2 mr-2" onClick={fetchCalculate}>
            Get Receive
          </Button>
          <div>
            {!!conversionRate?.toAmount && (
              <span>
                Receive:
                <span className="text-brand-normal inline-block ml-2 mr-10">{`${conversionRate?.toAmount} ${conversionRate?.fromSymbol}`}</span>
              </span>
            )}
            {!!conversionRate?.minimumReceiveAmount && (
              <span>
                <span>Minimum Receive:</span>
                <span className="text-brand-normal inline-block ml-2 mr-2">{`${conversionRate?.minimumReceiveAmount} ${conversionRate?.fromSymbol}`}</span>
              </span>
            )}
          </div>
        </div>
      </section>

      <Divider plain>Last Step</Divider>
      <Button onClick={fetchDepositAddress}>Get Deposit Address</Button>
      <span className="ml-2">{`>>> ${depositInfo?.depositAddress || ''}`}</span>
    </div>
  );
}
