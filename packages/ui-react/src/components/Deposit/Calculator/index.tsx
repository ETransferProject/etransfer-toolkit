import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { Input } from 'antd';
import './index.less';
import clsx from 'clsx';
import { etransferEvents, handleErrorMessage, isAuthTokenError } from '@etransfer/utils';
import CommonSpace from '../../CommonSpace';
import CommonSvg from '../../CommonSvg';
import DynamicArrow from '../../DynamicArrow';
import singleMessage from '../../SingleMessage';
import { formatSymbolDisplay } from '../../../utils/format';
import { MAX_UPDATE_TIME } from '../../../constants';
import { SIGNATURE_MISSING_TIP } from '../../../constants/misc';
import { IChainMenuItem } from '../../../types/chain';
import { etransferCore } from '../../../utils';
import { ComponentStyle } from '../../../types/common';

const DEFAULT_AMOUNT = '0.00';
const DEFAULT_PAY_AMOUNT = '100';

export interface CalculatorProps {
  isShowErrorTip?: boolean;
  depositTokenSymbol: string;
  depositTokenDecimals: number;
  receiveTokenSymbol: string;
  chainItem?: IChainMenuItem;
  componentStyle?: ComponentStyle;
  className?: string;
}

export default function Calculator({
  isShowErrorTip = true,
  depositTokenSymbol,
  depositTokenDecimals,
  chainItem,
  receiveTokenSymbol,
  componentStyle = ComponentStyle.Web,
  className,
}: CalculatorProps) {
  const [payAmount, setPayAmount] = useState(DEFAULT_PAY_AMOUNT);
  const amountRef = useRef(DEFAULT_PAY_AMOUNT);
  const [receiveAmount, setReceiveAmount] = useState(DEFAULT_AMOUNT);
  const [minReceiveAmount, setMinReceiveAmount] = useState(DEFAULT_AMOUNT);
  const [isExpand, setIsExpand] = useState(true);

  const getCalculate = useCallback(async () => {
    try {
      if (!amountRef.current || !chainItem?.key || !depositTokenSymbol || !receiveTokenSymbol) return;
      const { conversionRate } = await etransferCore.services.getDepositCalculate({
        toChainId: chainItem?.key,
        fromSymbol: depositTokenSymbol,
        toSymbol: receiveTokenSymbol,
        fromAmount: amountRef.current,
      });
      if (amountRef.current) {
        setReceiveAmount(conversionRate?.toAmount || DEFAULT_AMOUNT);
        setMinReceiveAmount(conversionRate?.minimumReceiveAmount || DEFAULT_AMOUNT);
      }
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
  }, [chainItem?.key, depositTokenSymbol, isShowErrorTip, receiveTokenSymbol]);

  const updateTimeRef = useRef(MAX_UPDATE_TIME);
  const updateTimerRef = useRef<NodeJS.Timeout>();
  const handleSetTimer = useCallback(async () => {
    updateTimerRef.current = setInterval(() => {
      --updateTimeRef.current;

      if (updateTimeRef.current === 0) {
        getCalculate();
        updateTimeRef.current = MAX_UPDATE_TIME;
      }
    }, 1000);
  }, [getCalculate]);

  const resetTimer = useCallback(() => {
    clearInterval(updateTimerRef.current);
    updateTimerRef.current = undefined;
    updateTimeRef.current = MAX_UPDATE_TIME;
    handleSetTimer();
  }, [handleSetTimer]);

  useEffect(() => {
    return () => {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;
    };
  }, []);

  const onPayChange = useCallback(
    (event: any) => {
      const oldValue = amountRef.current;
      const valueOrigin: string = event.target.value;
      const newValue = valueOrigin.replace(/[^\d.]/g, '');

      // CHECK1: not empty
      if (!newValue || newValue === '.') {
        event.target.value = '';
        amountRef.current = '';
        setPayAmount('');
        setReceiveAmount(DEFAULT_AMOUNT);
        setMinReceiveAmount(DEFAULT_AMOUNT);
        return;
      }

      // CHECK2: comma count
      const commaCount = newValue?.match(/\./gim)?.length;
      if (commaCount && commaCount > 1) {
        event.target.value = oldValue;
        return;
      }

      // CHECK3: decimals
      const stringReg = `^[0-9]{1,9}((\\.\\d)|(\\.\\d{0,${depositTokenDecimals}}))?$`;
      const CheckNumberReg = new RegExp(stringReg);

      if (!CheckNumberReg.exec(newValue)) {
        event.target.value = oldValue;
        return;
      }

      event.target.value = newValue;
      amountRef.current = newValue;
      setPayAmount(newValue);
      // start 15s countdown
      resetTimer();
      // then, get one-time new value
      getCalculate();
    },
    [depositTokenDecimals, getCalculate, resetTimer],
  );

  useEffect(() => {
    // start 15s countdown
    resetTimer();
    // then, get one-time new value
    getCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainItem, depositTokenSymbol, receiveTokenSymbol]);

  // Listener login
  const getCalculateRef = useRef(getCalculate);
  getCalculateRef.current = getCalculate;
  useEffectOnce(() => {
    const { remove } = etransferEvents.LoginSuccess.addListener(getCalculateRef.current);

    return () => {
      remove();
    };
  });

  const renderHeader = useMemo(() => {
    return (
      <div
        className={clsx('etransfer-ui-flex-row-center-between', 'etransfer-ui-calculator-header')}
        onClick={() =>
          setIsExpand((pre) => {
            return !pre;
          })
        }>
        <div className={clsx('etransfer-ui-flex-row-center', 'calculator-header-right')}>
          <CommonSvg type="calculator" />
          <span className={'calculator-header-title'}>Calculator</span>
        </div>
        <DynamicArrow isExpand={isExpand} />
      </div>
    );
  }, [isExpand]);

  const renderYouPay = useMemo(() => {
    return (
      <div>
        <div className={'label'}>You Pay</div>
        <CommonSpace direction="vertical" size={6} />
        <div className={clsx('etransfer-ui-flex-row-center', 'you-pay-main')}>
          <Input className={'pay-input'} placeholder="0.00" value={payAmount} onInput={onPayChange} />
          <div className={'dividing-line'} />
          <span className={'unit'}>{depositTokenSymbol}</span>
        </div>
      </div>
    );
  }, [depositTokenSymbol, onPayChange, payAmount]);

  const renderReceive = useMemo(() => {
    return (
      <div>
        <div className={'label'}>You Receive</div>
        <CommonSpace direction="vertical" size={8} />
        <div className={'receive-amount'}>{`≈${receiveAmount} ${formatSymbolDisplay(receiveTokenSymbol)}`}</div>
        <div className={clsx('etransfer-ui-flex-row-center', 'min-receive')}>
          <span className={'label'}>Minimum Sum To Receive:</span>
          <span className={'min-receive-amount'}>{`≈${minReceiveAmount} ${formatSymbolDisplay(
            receiveTokenSymbol,
          )}`}</span>
        </div>
      </div>
    );
  }, [minReceiveAmount, receiveAmount, receiveTokenSymbol]);

  return (
    <div className={clsx('etransfer-ui-calculator', className)}>
      {renderHeader}
      {isExpand && (
        <>
          <CommonSpace direction="vertical" size={16} />
          {componentStyle === ComponentStyle.Mobile ? (
            <div className={'etransfer-ui-calculator-content'}>
              <div>{renderYouPay}</div>
              <CommonSpace direction="vertical" size={16} />
              <div>{renderReceive}</div>
            </div>
          ) : (
            <div className={clsx('etransfer-ui-flex-row-start', 'etransfer-ui-calculator-content')}>
              <div className="etransfer-ui-flex-1">{renderYouPay}</div>
              <div className="etransfer-ui-flex-1">{renderReceive}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
