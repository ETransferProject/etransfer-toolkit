import { CommonErrorNameType } from '@etransfer/request';
import { TDepositInfo, BusinessType, NetworkStatus, TNetworkItem } from '@etransfer/types';
import { etransferEvents, handleErrorMessage, isAuthTokenError } from '@etransfer/utils';
import { ChainId } from '@portkey/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { InitDepositInfo } from '../../constants/deposit';
import singleMessage from '../SingleMessage';
import { etransferCore, setLoading } from '../../utils';
import { ComponentStyle, IChainMenuItem } from '../../types';
import { useETransferDeposit } from '../../context/ETransferDepositProvider';
import { etransferDepositAction } from '../../context/ETransferDepositProvider/actions';
import { DepositProps, DepositReceiveTokenItem, DepositTokenOptionItem, TGetNetworkData } from './types';
import DepositForMobile from './DepositForMobile';
import DepositForWeb from './DepositForWeb';
import { checkDepositSupportNetworkList, checkDepositSupportTokenAndChain } from './utils';

export default function Deposit({ containerClassName, className, componentStyle = ComponentStyle.Web }: DepositProps) {
  const [isShowNetworkLoading, setIsShowNetworkLoading] = useState(false);
  const networkItemRef = useRef<string>();
  const [depositInfo, setDepositInfo] = useState<TDepositInfo>(InitDepositInfo);
  const [showRetry, setShowRetry] = useState(false);

  const [
    {
      depositTokenSymbol,
      depositTokenList,
      networkItem,
      networkList,
      receiveTokenList,
      receiveTokenSymbol,
      chainItem,
      chainList,
    },
    { dispatch },
  ] = useETransferDeposit();

  const depositTokenSelected = useMemo(() => {
    return depositTokenList?.find((item) => item.symbol === depositTokenSymbol) || depositTokenList?.[0];
  }, [depositTokenList, depositTokenSymbol]);

  const receiveTokenSelected = useMemo(() => {
    return receiveTokenList?.find((item) => item.symbol === receiveTokenSymbol) || receiveTokenList?.[0];
  }, [receiveTokenList, receiveTokenSymbol]);

  const getTokenList = useCallback(
    async (chainId: ChainId, fromSymbol: string, toSymbol: string) => {
      try {
        setLoading(true);
        const { tokenList } = await etransferCore.services.getTokenOption({
          type: BusinessType.Deposit,
        });
        // Format fromTokenList - add chainList for toTokenList
        const fromTokenList: DepositTokenOptionItem[] = checkDepositSupportTokenAndChain(tokenList);

        // Handle fromTokenList and fromToken
        dispatch(etransferDepositAction.setDepositTokenList.actions(fromTokenList));
        const isExitFromTokenSelected = fromTokenList?.find((item) => item.symbol === fromSymbol);
        const currentFromTokenSelected = isExitFromTokenSelected?.symbol || fromTokenList?.[0].symbol;
        const currentToTokenList: DepositReceiveTokenItem[] =
          isExitFromTokenSelected?.toTokenList || fromTokenList?.[0]?.toTokenList || [];

        if (!isExitFromTokenSelected?.symbol) {
          dispatch(etransferDepositAction.setDepositTokenSymbol.actions(currentFromTokenSelected));
        }

        // Handle toTokenList and toToken
        dispatch(etransferDepositAction.setReceiveTokenList.actions(currentToTokenList));
        const isExitToTokenSelected = currentToTokenList?.find((item) => item.symbol === toSymbol);

        if (isExitToTokenSelected?.symbol) {
          const isExitChain = isExitToTokenSelected?.chainList?.find((item) => item.key === chainId);
          if (!isExitChain && isExitToTokenSelected?.chainList?.[0]) {
            dispatch(etransferDepositAction.setChainItem.actions(isExitToTokenSelected.chainList[0]));
          }
          dispatch(etransferDepositAction.setChainList.actions(isExitToTokenSelected.chainList || []));
        } else {
          const toToken = currentToTokenList?.[0] || [];
          const tempChainList = toToken?.chainList;
          dispatch(etransferDepositAction.setReceiveTokenSymbol.actions(toToken?.symbol));
          dispatch(etransferDepositAction.setChainList.actions(tempChainList || []));
          tempChainList?.[0] && dispatch(etransferDepositAction.setChainItem.actions(tempChainList?.[0]));
        }
      } catch (error) {
        console.log('getTokenList error', error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const getDepositData = useCallback(async (chainId: ChainId, symbol: string, toSymbol: string) => {
    try {
      if (!networkItemRef.current) return;
      setLoading(true);
      const res = await etransferCore.services.getDepositInfo({
        chainId,
        network: networkItemRef.current || '',
        symbol,
        toSymbol,
      });
      setShowRetry(false);
      setLoading(false);
      setDepositInfo(res.depositInfo);
    } catch (error: any) {
      if (error.name !== CommonErrorNameType.CANCEL && error.code === '50000') {
        setShowRetry(true);
      } else {
        setShowRetry(false);
      }
      if (error.name !== CommonErrorNameType.CANCEL) {
        setDepositInfo(InitDepositInfo);
        setLoading(false);
      }
    }
  }, []);

  const getNetworkData = useCallback(
    async ({ chainId, symbol, toSymbol }: TGetNetworkData) => {
      try {
        setIsShowNetworkLoading(true);
        const lastSymbol = symbol || depositTokenSymbol;
        const lastToSymbol = toSymbol || receiveTokenSymbol;
        const { networkList } = await etransferCore.services.getNetworkList({
          type: BusinessType.Deposit,
          chainId: chainId,
          symbol: symbol,
        });
        const supportNetworkList = checkDepositSupportNetworkList(networkList);
        dispatch(etransferDepositAction.setNetworkList.actions(supportNetworkList));
        if (supportNetworkList?.length === 1 && supportNetworkList[0].status !== NetworkStatus.Offline) {
          networkItemRef.current = supportNetworkList[0].network;
          dispatch(etransferDepositAction.setNetworkItem.actions(supportNetworkList[0]));
        } else {
          const exitNetwork = supportNetworkList.filter((item) => item.network === networkItemRef.current);
          if (exitNetwork?.length === 0) {
            networkItemRef.current = undefined;
            dispatch(etransferDepositAction.setNetworkItem.actions(undefined));

            return;
          }
          dispatch(etransferDepositAction.setNetworkItem.actions(exitNetwork[0]));
        }
        componentStyle === ComponentStyle.Web && (await getDepositData(chainId, lastSymbol, lastToSymbol));
      } catch (error: any) {
        setIsShowNetworkLoading(false);
        if (error.name !== CommonErrorNameType.CANCEL && !isAuthTokenError(error)) {
          singleMessage.error(handleErrorMessage(error));
        }
      } finally {
        setIsShowNetworkLoading(false);
      }
    },
    [componentStyle, depositTokenSymbol, dispatch, getDepositData, receiveTokenSymbol],
  );

  const handleDepositTokenChange = async (newItem: DepositTokenOptionItem) => {
    // Set fromToken
    dispatch(etransferDepositAction.setDepositTokenSymbol.actions(newItem.symbol));
    dispatch(etransferDepositAction.setReceiveTokenList.actions(newItem.toTokenList || []));

    let toSymbol = receiveTokenSymbol;
    let toChain = chainItem;
    // Check 1 - toToken
    const isExitToToken = newItem.toTokenList?.find((item) => item.symbol === receiveTokenSymbol);
    // toToken not exist, toToken = fromToken
    if (!isExitToToken) {
      toSymbol = newItem.symbol;
      dispatch(etransferDepositAction.setReceiveTokenSymbol.actions(newItem.symbol));
      // Check 2 - toChain
      const isExitToChain = newItem?.toTokenList?.find((item) => item.chainIdList?.includes(chainItem.key));
      if (!isExitToChain && newItem?.toTokenList?.[0]?.chainList?.[0]) {
        toChain = newItem.toTokenList[0].chainList[0];
      }
      dispatch(etransferDepositAction.setChainItem.actions(toChain));
      dispatch(etransferDepositAction.setChainList.actions(newItem?.toTokenList?.[0]?.chainList || []));
    }
    // toToken exist, next check
    if (isExitToToken) {
      // Check 2 - toChain
      const isExitToChain = isExitToToken.chainList?.find((item) => item.key === chainItem.key);
      // toChain not exist, set toChain and toChainList
      if (!isExitToChain && isExitToToken.chainList?.[0]) {
        toChain = isExitToToken.chainList[0];
        dispatch(etransferDepositAction.setChainItem.actions(toChain));
      }
      // toChain exist, set and toChainList
      dispatch(etransferDepositAction.setChainList.actions(isExitToToken.chainList || []));
    }

    // Reset other data
    setDepositInfo(InitDepositInfo);
    setShowRetry(false);

    // Refresh network and deposit info
    await getNetworkData({
      chainId: toChain.key,
      symbol: newItem.symbol,
      toSymbol,
    });
  };

  const handleNetworkChanged = useCallback(
    async (item: TNetworkItem) => {
      networkItemRef.current = item.network;
      dispatch(etransferDepositAction.setNetworkItem.actions(item));
      componentStyle === ComponentStyle.Web &&
        (await getDepositData(chainItem.key, depositTokenSymbol, receiveTokenSymbol));
    },
    [chainItem.key, componentStyle, depositTokenSymbol, dispatch, getDepositData, receiveTokenSymbol],
  );

  const handleReceiveTokenChange = useCallback(
    async (newItem: DepositReceiveTokenItem) => {
      dispatch(etransferDepositAction.setReceiveTokenSymbol.actions(newItem.symbol));
      dispatch(etransferDepositAction.setChainList.actions(newItem.chainList || []));

      // Check - to chain
      let optionChainId = chainItem.key;
      const isExitChain = newItem?.chainList?.find((item) => item.key === chainItem.key);
      if (!isExitChain && newItem?.chainList?.[0]) {
        const chainItem = newItem.chainList[0];
        dispatch(etransferDepositAction.setChainItem.actions(chainItem));
        optionChainId = chainItem.key;
        // toChain changed, need refresh network and deposit info.
        return getNetworkData({
          chainId: optionChainId,
          symbol: depositTokenSymbol,
          toSymbol: newItem.symbol,
        });
      }
      // toChain and fromToken not changed, refresh deposit info.
      return componentStyle === ComponentStyle.Web && getDepositData(optionChainId, depositTokenSymbol, newItem.symbol);
    },
    [chainItem.key, componentStyle, depositTokenSymbol, dispatch, getDepositData, getNetworkData],
  );

  const handleChainChanged = useCallback(
    async (item: IChainMenuItem) => {
      // if currentSymbol is empty, don't send request
      dispatch(etransferDepositAction.setChainItem.actions(item));
      if (depositTokenSymbol) {
        await getNetworkData({
          chainId: item.key,
          symbol: depositTokenSymbol,
        });
      }
    },
    [depositTokenSymbol, dispatch, getNetworkData],
  );

  const handleNext = useCallback(async () => {
    await getDepositData(chainItem.key, depositTokenSymbol, receiveTokenSymbol);
  }, [getDepositData, chainItem.key, depositTokenSymbol, receiveTokenSymbol]);

  const handleRetry = useCallback(async () => {
    await getDepositData(chainItem.key, depositTokenSymbol, receiveTokenSymbol);
  }, [chainItem.key, depositTokenSymbol, getDepositData, receiveTokenSymbol]);

  const init = useCallback(async () => {
    await getTokenList(chainItem?.key, depositTokenSymbol, receiveTokenSymbol);

    if (networkItem?.network && Array.isArray(networkList) && networkList?.length > 0) {
      networkItemRef.current = networkItem?.network;
    }

    // get new network data, when refresh page and switch side menu
    await getNetworkData({ chainId: chainItem?.key, symbol: depositTokenSymbol, toSymbol: receiveTokenSymbol });
    // // read and write ETransferConfig
    // const { chainId, network, depositToken, receiveToken } = getDepositDefaultConfig();
    // networkItemRef.current = network;

    // await getTokenList(chainId, depositToken, receiveToken);

    // // get new network data, when refresh page and switch side menu
    // await getNetworkData({ chainId, symbol: depositToken, toSymbol: receiveToken });
  }, [
    chainItem?.key,
    depositTokenSymbol,
    getNetworkData,
    getTokenList,
    networkItem?.network,
    networkList,
    receiveTokenSymbol,
  ]);

  useEffectOnce(() => {
    init();
  });

  useEffect(() => {
    const { remove } = etransferEvents.AuthTokenSuccess.addListener(() => {
      console.log('login success');
      init();
    });
    return () => {
      remove();
    };
  }, [init]);

  return (
    <div className={containerClassName}>
      {componentStyle === ComponentStyle.Mobile ? (
        <DepositForMobile
          className={className}
          // select
          depositTokenList={depositTokenList || []}
          depositTokenSelected={depositTokenSelected}
          depositTokenSelectCallback={handleDepositTokenChange}
          networkList={networkList || []}
          networkSelected={networkItem}
          isShowNetworkLoading={isShowNetworkLoading}
          networkSelectCallback={handleNetworkChanged}
          chainList={chainList || []}
          chainSelected={chainItem}
          chainChanged={handleChainChanged}
          receiveTokenList={receiveTokenList || []}
          receiveTokenSelected={receiveTokenSelected}
          receiveTokenSelectCallback={handleReceiveTokenChange}
          // info
          depositInfo={depositInfo}
          contractAddress={networkItem?.contractAddress || ''}
          contractAddressLink={networkItem?.explorerUrl || ''}
          qrCodeValue={depositInfo.depositAddress}
          tokenLogoUrl={depositTokenSelected?.icon}
          showRetry={showRetry}
          onRetry={handleRetry}
          onNext={handleNext}
        />
      ) : (
        <DepositForWeb
          className={className}
          // select
          depositTokenList={depositTokenList || []}
          depositTokenSelected={depositTokenSelected}
          depositTokenSelectCallback={handleDepositTokenChange}
          networkList={networkList || []}
          networkSelected={networkItem}
          isShowNetworkLoading={isShowNetworkLoading}
          networkSelectCallback={handleNetworkChanged}
          chainList={chainList || []}
          chainSelected={chainItem}
          chainChanged={handleChainChanged}
          receiveTokenList={receiveTokenList || []}
          receiveTokenSelected={receiveTokenSelected}
          receiveTokenSelectCallback={handleReceiveTokenChange}
          // info
          depositInfo={depositInfo}
          contractAddress={networkItem?.contractAddress || ''}
          contractAddressLink={networkItem?.explorerUrl || ''}
          qrCodeValue={depositInfo.depositAddress}
          tokenLogoUrl={depositTokenSelected?.icon}
          showRetry={showRetry}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}