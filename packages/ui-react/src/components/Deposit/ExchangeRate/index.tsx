import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import clsx from 'clsx';
import { etransferEvents, handleErrorMessage, isAuthTokenError } from '@etransfer/utils';
import { ChainId } from '@portkey/types';
import { DEFAULT_NULL_VALUE } from '../../../constants/index';
import { formatSymbolDisplay } from '../../../utils/format';
import { MAX_UPDATE_TIME } from '../../../constants/calculate';
import { SIGNATURE_MISSING_TIP } from '../../../constants/misc';
import { useEffectOnce } from 'react-use';
import CommonSvg from '../../CommonSvg';
import singleMessage from '../../SingleMessage';
import { etransferCore } from '../../../utils';

type TExchangeRate = {
  className?: string;
  isShowErrorTip?: boolean;
  fromSymbol: string;
  toSymbol: string;
  toChainId: ChainId;
  slippage?: string;
};

const EXCHANGE_FROM_AMOUNT = '1';

export default function ExchangeRate({
  className,
  isShowErrorTip = true,
  fromSymbol,
  toSymbol,
  toChainId,
  slippage,
}: TExchangeRate) {
  // const { fromTokenSymbol, toChainItem, toTokenSymbol } = useDepositState();
  const [exchange, setExchange] = useState(DEFAULT_NULL_VALUE);
  const [updateTime, setUpdateTime] = useState(MAX_UPDATE_TIME);
  const updateTimeRef = useRef(MAX_UPDATE_TIME);
  const updateTimerRef = useRef<NodeJS.Timeout>();

  const slippageFormat = useMemo(() => {
    if (!slippage) return '';
    return Number(slippage) * 100;
  }, [slippage]);

  const getCalculate = useCallback(async () => {
    try {
      const { conversionRate } = await etransferCore.services.getDepositCalculate({
        toChainId,
        fromSymbol,
        toSymbol,
        fromAmount: EXCHANGE_FROM_AMOUNT,
      });
      setExchange(conversionRate?.toAmount || DEFAULT_NULL_VALUE);
    } catch (error) {
      if (isAuthTokenError(error)) {
        singleMessage.info(SIGNATURE_MISSING_TIP);
      } else {
        if (isShowErrorTip) {
          singleMessage.error(handleErrorMessage(error));
        } else {
          throw new Error(handleErrorMessage(error));
        }
      }
    }
  }, [fromSymbol, isShowErrorTip, toChainId, toSymbol]);

  const handleSetTimer = useCallback(async () => {
    updateTimerRef.current = setInterval(() => {
      --updateTimeRef.current;

      if (updateTimeRef.current === 0) {
        getCalculate();
        updateTimeRef.current = MAX_UPDATE_TIME;
      }

      setUpdateTime(updateTimeRef.current);
    }, 1000);
  }, [getCalculate]);

  const stopInterval = useCallback(() => {
    clearInterval(updateTimerRef.current);
    updateTimerRef.current = undefined;
    setExchange(DEFAULT_NULL_VALUE);
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(updateTimerRef.current);
    updateTimerRef.current = undefined;
    updateTimeRef.current = MAX_UPDATE_TIME;
    setUpdateTime(MAX_UPDATE_TIME);
    handleSetTimer();
  }, [handleSetTimer]);

  useEffect(() => {
    getCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromSymbol, toSymbol, toChainId]);

  useEffect(() => {
    resetTimer();
    return () => {
      stopInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromSymbol, toSymbol, toChainId]);

  // Listener login
  const getCalculateRef = useRef(getCalculate);
  getCalculateRef.current = getCalculate;
  useEffectOnce(() => {
    const { remove } = etransferEvents.LoginSuccess.addListener(getCalculateRef.current);

    return () => {
      remove();
    };
  });

  return (
    <div className={clsx('etransfer-ui-flex-row-between', 'etransfer-ui-exchange-rate', className)}>
      <div className="etransfer-ui-flex-row-center">
        <span className="value">{`1 ${fromSymbol} ≈ ${exchange} ${formatSymbolDisplay(toSymbol)}`}</span>
        <CommonSvg type="time" />
        <span className="count-time">{`${updateTime}s`}</span>
      </div>
      {slippage && <div>{`Slippage: ${slippageFormat}%`}</div>}
    </div>
  );
}
