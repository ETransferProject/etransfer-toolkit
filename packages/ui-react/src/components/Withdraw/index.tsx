import { Form } from 'antd';
import './index.less';
import { ComponentStyle, IChainMenuItem } from '../../types';
import { TWithdrawFormValues, WithdrawFormKeys, WithdrawProps, WithdrawValidateStatus } from './types';
import WithdrawForm from './WithdrawForm';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import WithdrawSelectChain from '../SelectChain/WithdrawSelectChain';
import { useETransferWithdraw } from '../../context/ETransferWithdrawProvider';
import {
  BusinessType,
  NetworkStatus,
  PortkeyVersion,
  TGetNetworkListRequest,
  TGetWithdrawInfoRequest,
  TNetworkItem,
  TTokenItem,
  TWithdrawInfo,
} from '@etransfer/types';
import {
  AMOUNT_GREATER_THAN_BALANCE_TIP,
  BlockchainNetworkType,
  ETH_DELAY_WITHDRAWAL_TIP,
  INITIAL_WITHDRAW_INFO,
  INITIAL_WITHDRAW_STATE,
  NOT_ENOUGH_ELF_FEE,
  WITHDRAWAL_COMMENT_CHECK_TIP,
} from '../../constants';
import { etransferWithdrawAction } from '../../context/ETransferWithdrawProvider/actions';
import {
  etransferCore,
  formatSymbolDisplay,
  getAccountAddress,
  getBalanceDivDecimalsAdapt,
  isHaveTotalAccountInfo,
  parseWithCommas,
  setLoading,
} from '../../utils';
import {
  etransferEvents,
  handleErrorMessage,
  isAuthTokenError,
  isDIDAddressSuffix,
  isHtmlError,
  isWriteOperationError,
  removeELFAddressSuffix,
  ZERO,
} from '@etransfer/utils';
import { WITHDRAW_ADDRESS_ERROR_CODE_LIST } from '@etransfer/core';
import { CommonErrorNameType } from '@etransfer/request';
import singleMessage from '../SingleMessage';
import BigNumber from 'bignumber.js';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import clsx from 'clsx';
import { checkWithdrawSupportNetworkList, checkWithdrawSupportTokenList, getAelfMaxBalance } from './utils';
import ProcessingTip from '../CommonTips/ProcessingTip';
import { useWithdrawNoticeSocket } from '../../hooks/notice';

const FORM_VALIDATE_DATA = {
  [WithdrawFormKeys.TOKEN]: { validateStatus: WithdrawValidateStatus.Normal, errorMessage: '' },
  [WithdrawFormKeys.ADDRESS]: { validateStatus: WithdrawValidateStatus.Normal, errorMessage: '' },
  [WithdrawFormKeys.NETWORK]: { validateStatus: WithdrawValidateStatus.Normal, errorMessage: '' },
  [WithdrawFormKeys.AMOUNT]: { validateStatus: WithdrawValidateStatus.Normal, errorMessage: '' },
  [WithdrawFormKeys.COMMENT]: {
    validateStatus: WithdrawValidateStatus.Warning,
    errorMessage: WITHDRAWAL_COMMENT_CHECK_TIP,
  },
};

export default function Withdraw({
  className,
  chainClassName,
  fromClassName,
  componentStyle = ComponentStyle.Web,
  isShowMobilePoweredBy,
  isShowErrorTip = true,
  isListenNoticeAuto = true,
  depositProcessingCount = 0,
  isShowProcessingTip = true,
  onClickProcessingTip,
  onActionChange,
  onLogin,
}: WithdrawProps) {
  const [form] = Form.useForm<TWithdrawFormValues>();
  const [formValidateData, setFormValidateData] = useState<{
    [key in WithdrawFormKeys]: { validateStatus: WithdrawValidateStatus; errorMessage: string };
  }>(JSON.parse(JSON.stringify(FORM_VALIDATE_DATA)));

  const [
    { tokenSymbol, tokenList, networkItem, chainItem, chainList, address, withdrawProcessingCount },
    { dispatch },
  ] = useETransferWithdraw();
  const currentNetworkRef = useRef<TNetworkItem>();
  const currentChainItemRef = useRef<IChainMenuItem>(chainItem);
  const [withdrawInfo, setWithdrawInfo] = useState<TWithdrawInfo>(INITIAL_WITHDRAW_INFO);
  const withdrawInfoRef = useRef(INITIAL_WITHDRAW_INFO);
  const [amount, setAmount] = useState('0');
  const [balance, setBalance] = useState('');
  const [isShowNetworkLoading, setIsShowNetworkLoading] = useState(false);
  const [isNetworkDisable, setIsNetworkDisable] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isTransactionFeeLoading, setIsTransactionFeeLoading] = useState(false);

  const currentToken = useMemo(() => {
    const item = tokenList?.find((item) => item.symbol === tokenSymbol);
    return item?.symbol ? item : INITIAL_WITHDRAW_STATE.tokenList[0];
  }, [tokenList, tokenSymbol]);

  const currentTokenDecimal = useMemo(() => currentToken.decimals, [currentToken.decimals]);

  const minAmount = useMemo(() => {
    return withdrawInfo?.minAmount || '0.2';
  }, [withdrawInfo?.minAmount]);
  const receiveAmount = useMemo(() => {
    let result = '';
    if (
      !amount ||
      !withdrawInfo.transactionFee ||
      ZERO.plus(amount).isLessThan(ZERO.plus(withdrawInfo.transactionFee)) ||
      ZERO.plus(amount).isLessThan(ZERO.plus(minAmount))
    ) {
      result = '';
    } else {
      result = BigNumber(amount).minus(BigNumber(withdrawInfo.transactionFee)).toFixed();
    }

    return result;
  }, [amount, minAmount, withdrawInfo.transactionFee]);

  const getAddressInput = useCallback(() => {
    return form.getFieldValue(WithdrawFormKeys.ADDRESS)?.trim();
  }, [form]);

  const getCommentInput = useCallback(() => {
    return form.getFieldValue(WithdrawFormKeys.COMMENT)?.trim();
  }, [form]);

  const judgeIsSubmitDisabled = useCallback(
    (currentFormValidateData: typeof formValidateData) => {
      const isValueUndefined = (value: unknown) => value === undefined || value === '';
      const isDisabled =
        currentFormValidateData[WithdrawFormKeys.ADDRESS].validateStatus === WithdrawValidateStatus.Error ||
        currentFormValidateData[WithdrawFormKeys.NETWORK].validateStatus === WithdrawValidateStatus.Error ||
        currentFormValidateData[WithdrawFormKeys.AMOUNT].validateStatus === WithdrawValidateStatus.Error ||
        isValueUndefined(getAddressInput()) ||
        isValueUndefined(currentNetworkRef.current) ||
        isValueUndefined(form.getFieldValue(WithdrawFormKeys.AMOUNT));
      setIsSubmitDisabled(isDisabled);
    },
    [form, getAddressInput],
  );

  const handleFormValidateDataChange = useCallback(
    (updateFormValidateData: Partial<typeof formValidateData>) => {
      setFormValidateData((prev) => {
        const newFormValidateData = { ...prev, ...updateFormValidateData };
        judgeIsSubmitDisabled(newFormValidateData);
        return newFormValidateData;
      });
    },
    [judgeIsSubmitDisabled],
  );

  const getToken = useCallback(
    async (isInitCurrentSymbol?: boolean) => {
      const res = await etransferCore.services.getTokenList({
        type: BusinessType.Withdraw,
        chainId: currentChainItemRef.current.key,
      });
      const supportToken = checkWithdrawSupportTokenList(res.tokenList);
      dispatch(etransferWithdrawAction.setTokenList.actions(supportToken));

      if (isInitCurrentSymbol && !tokenSymbol) {
        dispatch(etransferWithdrawAction.setTokenSymbol.actions(supportToken[0].symbol));
      }
      return supportToken;
    },
    [dispatch, tokenSymbol],
  );

  const getAllNetworkData = useCallback(async () => {
    // only get data and render page, don't update error
    try {
      setIsShowNetworkLoading(true);
      const { networkList } = await etransferCore.services.getNetworkList({
        type: BusinessType.Withdraw,
        chainId: currentChainItemRef.current.key,
        symbol: tokenSymbol,
      });
      const supportNetworkList = checkWithdrawSupportNetworkList(networkList);
      dispatch(etransferWithdrawAction.setNetworkList.actions(supportNetworkList));
    } catch (error) {
      setIsShowNetworkLoading(false);
    } finally {
      setIsShowNetworkLoading(false);
    }
  }, [dispatch, tokenSymbol]);

  const getNetworkData = useCallback(
    async ({ symbol, address }: Omit<TGetNetworkListRequest, 'type' | 'chainId'>) => {
      try {
        setIsShowNetworkLoading(true);
        const params: TGetNetworkListRequest = {
          type: BusinessType.Withdraw,
          chainId: currentChainItemRef.current.key,
          symbol: symbol,
        };
        if (address) {
          params.address = isDIDAddressSuffix(address) ? removeELFAddressSuffix(address) : address;
        }

        const { networkList } = await etransferCore.services.getNetworkList(params);
        const supportNetworkList = checkWithdrawSupportNetworkList(networkList);
        dispatch(etransferWithdrawAction.setNetworkList.actions(supportNetworkList));

        if (supportNetworkList?.length === 1 && supportNetworkList[0].status !== NetworkStatus.Offline) {
          currentNetworkRef.current = supportNetworkList[0];
          dispatch(etransferWithdrawAction.setNetworkItem.actions(supportNetworkList[0]));
        } else {
          const exitNetwork = supportNetworkList.find((item) => item.network === currentNetworkRef.current?.network);
          if (!exitNetwork?.network) {
            currentNetworkRef.current = undefined;
            dispatch(etransferWithdrawAction.setNetworkItem.actions(undefined));
          } else {
            if (exitNetwork.status !== NetworkStatus.Offline) {
              dispatch(etransferWithdrawAction.setNetworkItem.actions(exitNetwork));
            } else {
              currentNetworkRef.current = undefined;
              dispatch(etransferWithdrawAction.setNetworkItem.actions(undefined));
            }
          }
        }
        const isSolanaNetwork =
          supportNetworkList?.length === 1 && supportNetworkList[0].network === BlockchainNetworkType.Solana;
        const isAddressShorterThanUsual = params.address && params.address.length >= 32 && params.address.length <= 39;
        if (isSolanaNetwork && isAddressShorterThanUsual) {
          // Only the Solana network has this warning
          handleFormValidateDataChange({
            [WithdrawFormKeys.ADDRESS]: {
              validateStatus: WithdrawValidateStatus.Warning,
              errorMessage:
                "The address you entered is shorter than usual. Please double-check to ensure it's the correct address.",
            },
          });
        } else {
          handleFormValidateDataChange({
            [WithdrawFormKeys.ADDRESS]: {
              validateStatus: WithdrawValidateStatus.Normal,
              errorMessage: '',
            },
          });
        }
        setIsNetworkDisable(false);
        setIsShowNetworkLoading(false);
      } catch (error: any) {
        console.log('getNetworkData error', error);

        setIsShowNetworkLoading(false);
        if (WITHDRAW_ADDRESS_ERROR_CODE_LIST.includes(error?.code)) {
          handleFormValidateDataChange({
            [WithdrawFormKeys.ADDRESS]: {
              validateStatus: WithdrawValidateStatus.Error,
              errorMessage: error?.message,
            },
          });
          setIsNetworkDisable(true);
          getAllNetworkData();
        } else {
          handleFormValidateDataChange({
            [WithdrawFormKeys.ADDRESS]: {
              validateStatus: WithdrawValidateStatus.Normal,
              errorMessage: '',
            },
          });
          if (
            error.name !== CommonErrorNameType.CANCEL &&
            !isWriteOperationError(error?.code, handleErrorMessage(error)) &&
            !isAuthTokenError(error)
          ) {
            if (isShowErrorTip) {
              singleMessage.error(handleErrorMessage(error));
            } else {
              throw new Error(handleErrorMessage(error));
            }
          }
        }
        dispatch(etransferWithdrawAction.setNetworkList.actions([]));
        if (error.name !== CommonErrorNameType.CANCEL && !isAuthTokenError(error)) {
          currentNetworkRef.current = undefined;
          dispatch(etransferWithdrawAction.setNetworkItem.actions(undefined));
        }
      } finally {
        setIsShowNetworkLoading(false);
      }
    },
    [dispatch, getAllNetworkData, handleFormValidateDataChange, isShowErrorTip],
  );

  const handleAmountValidate = useCallback(
    async (newMaxBalance?: string) => {
      if (!isHaveTotalAccountInfo()) return;

      const amount = form.getFieldValue(WithdrawFormKeys.AMOUNT);
      if (!amount) {
        handleFormValidateDataChange({
          [WithdrawFormKeys.AMOUNT]: {
            validateStatus: WithdrawValidateStatus.Normal,
            errorMessage: '',
          },
        });
        return;
      }
      const parserNumber = Number(parseWithCommas(amount));
      const currentMinAmount = Number(parseWithCommas(withdrawInfoRef.current.minAmount || minAmount));
      const currentTransactionUnit = formatSymbolDisplay(withdrawInfoRef.current.transactionUnit);
      const _balance = newMaxBalance || balance;
      const _maxBalance = await getAelfMaxBalance({
        balance: _balance,
        aelfFee: withdrawInfoRef.current?.aelfTransactionFee || '',
        chainId: currentChainItemRef.current.key,
        tokenSymbol,
        contractAddress: currentToken.contractAddress,
      });
      if (parserNumber < currentMinAmount) {
        handleFormValidateDataChange({
          [WithdrawFormKeys.AMOUNT]: {
            validateStatus: WithdrawValidateStatus.Error,
            errorMessage: `The minimum amount is ${currentMinAmount} ${currentTransactionUnit}. Please enter a value no less than this.`,
          },
        });
        return;
      } else if (
        withdrawInfoRef.current.remainingLimit &&
        parserNumber > Number(parseWithCommas(withdrawInfoRef.current.remainingLimit))
      ) {
        handleFormValidateDataChange({
          [WithdrawFormKeys.AMOUNT]: {
            validateStatus: WithdrawValidateStatus.Error,
            errorMessage: AMOUNT_GREATER_THAN_BALANCE_TIP,
          },
        });
        return;
      } else if (parserNumber > Number(parseWithCommas(_balance))) {
        handleFormValidateDataChange({
          [WithdrawFormKeys.AMOUNT]: {
            validateStatus: WithdrawValidateStatus.Error,
            errorMessage:
              'Insufficient balance. Please consider transferring a smaller amount or topping up before you try again.',
          },
        });
        return;
      } else if (_balance && tokenSymbol === 'ELF' && parserNumber > Number(parseWithCommas(_maxBalance))) {
        handleFormValidateDataChange({
          [WithdrawFormKeys.AMOUNT]: {
            validateStatus: WithdrawValidateStatus.Error,
            errorMessage: NOT_ENOUGH_ELF_FEE,
          },
        });

        return;
      } else {
        handleFormValidateDataChange({
          [WithdrawFormKeys.AMOUNT]: {
            validateStatus: WithdrawValidateStatus.Normal,
            errorMessage: '',
          },
        });

        return true;
      }
    },
    [balance, currentToken.contractAddress, form, handleFormValidateDataChange, minAmount, tokenSymbol],
  );

  const getWithdrawData = useCallback(
    async (optionSymbol?: string, newMaxBalance?: string) => {
      console.log('getWithdrawData - isLogin', isHaveTotalAccountInfo());
      if (!isHaveTotalAccountInfo()) return;

      const symbol = optionSymbol || tokenSymbol;
      const address = getAddressInput();
      try {
        setIsTransactionFeeLoading(true);
        const params: TGetWithdrawInfoRequest = {
          chainId: currentChainItemRef.current.key,
          symbol,
          version: PortkeyVersion.v2,
          address: isDIDAddressSuffix(address) ? removeELFAddressSuffix(address) : address,
        };
        if (currentNetworkRef.current?.network) {
          params.network = currentNetworkRef.current?.network;
        }
        // params add amount to get amountUsd、receiveAmountUsd
        const amount = form.getFieldValue(WithdrawFormKeys.AMOUNT);
        if (amount) {
          params.amount = amount;
        }

        // params add memo to check memo
        if (getCommentInput()) {
          params.memo = getCommentInput();
        }

        const res = await etransferCore.services.getWithdrawInfo(params);

        setWithdrawInfo({
          ...res.withdrawInfo,
          limitCurrency: formatSymbolDisplay(res.withdrawInfo.limitCurrency),
          transactionUnit: formatSymbolDisplay(res.withdrawInfo.transactionUnit),
        });
        withdrawInfoRef.current = {
          ...res.withdrawInfo,
          limitCurrency: formatSymbolDisplay(res.withdrawInfo.limitCurrency),
          transactionUnit: formatSymbolDisplay(res.withdrawInfo.transactionUnit),
        };
        setIsTransactionFeeLoading(false);

        handleAmountValidate(newMaxBalance);

        return res;
      } catch (error: any) {
        // when network error, transactionUnit should as the same with symbol
        setWithdrawInfo({
          ...INITIAL_WITHDRAW_INFO,
          limitCurrency: formatSymbolDisplay(symbol),
          transactionUnit: formatSymbolDisplay(symbol),
        });
        withdrawInfoRef.current = {
          ...INITIAL_WITHDRAW_INFO,
          limitCurrency: formatSymbolDisplay(symbol),
          transactionUnit: formatSymbolDisplay(symbol),
        };
        if (
          error.name !== CommonErrorNameType.CANCEL &&
          !isHtmlError(error?.code, handleErrorMessage(error)) &&
          !isWriteOperationError(error?.code, handleErrorMessage(error)) &&
          !isAuthTokenError(error)
        ) {
          setIsTransactionFeeLoading(false);
          if (isShowErrorTip) {
            singleMessage.error(handleErrorMessage(error));
          } else {
            throw new Error(handleErrorMessage(error));
          }
        }
      }
    },
    [form, getAddressInput, getCommentInput, handleAmountValidate, isShowErrorTip, tokenSymbol],
  );

  const getAccountBalance = useCallback(
    async (isLoading: boolean, item?: TTokenItem) => {
      try {
        console.log('getAccountBalance - symbol', item?.symbol);
        const caAddress = getAccountAddress(currentChainItemRef.current.key);

        if (!caAddress) return '';
        isLoading && setIsBalanceLoading(true);

        const symbol = item?.symbol || tokenSymbol;
        const decimals = item?.decimals || currentTokenDecimal;
        const tempBalance = await getBalanceDivDecimalsAdapt(
          currentChainItemRef.current.key,
          caAddress,
          symbol,
          decimals,
        );
        const amountValidate = await handleAmountValidate(tempBalance);
        setBalance((preMaxBalance) => {
          if (preMaxBalance !== tempBalance) {
            if (amountValidate) {
              getWithdrawData(undefined, tempBalance);
            }
          }
          return tempBalance;
        });
        return tempBalance;
      } catch (error) {
        if (isShowErrorTip) {
          singleMessage.error(handleErrorMessage(error));
        }
        throw new Error('Failed to get balance.');
      } finally {
        isLoading && setIsBalanceLoading(false);
      }
    },
    [currentTokenDecimal, getWithdrawData, handleAmountValidate, isShowErrorTip, tokenSymbol],
  );
  const getAccountBalanceRef = useRef(getAccountBalance);
  getAccountBalanceRef.current = getAccountBalance;

  const getAccountBalanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const getAccountBalanceInterval = useCallback(async (item?: TTokenItem) => {
    console.log('getAccountBalanceInterval start', item?.symbol);
    if (getAccountBalanceTimerRef.current) clearInterval(getAccountBalanceTimerRef.current);
    getAccountBalanceTimerRef.current = setInterval(async () => {
      console.log('getAccountBalanceInterval interval', item?.symbol);
      await getAccountBalanceRef.current(false, item);
    }, 8000);
  }, []);

  const handleChainChanged = useCallback(
    async (item: IChainMenuItem, token?: TTokenItem) => {
      try {
        setLoading(true);
        currentChainItemRef.current = item;
        dispatch(etransferWithdrawAction.setChainItem.actions(item));
        setAmount('');
        form.setFieldValue(WithdrawFormKeys.AMOUNT, '');
        handleAmountValidate();

        // reset max balance
        getAccountBalanceInterval();
        getAccountBalance(true, token);

        await getToken(true);
        await getNetworkData({
          symbol: token?.symbol || tokenSymbol,
          address: getAddressInput() || undefined,
        });
        await getWithdrawData(token?.symbol || tokenSymbol);
      } catch (error) {
        console.log('Change chain error: ', error);
      } finally {
        setLoading(false);
      }
    },
    [
      dispatch,
      form,
      getAccountBalance,
      getAccountBalanceInterval,
      getAddressInput,
      getNetworkData,
      getToken,
      getWithdrawData,
      handleAmountValidate,
      tokenSymbol,
    ],
  );

  const handleTokenChange = useCallback(
    async (item: TTokenItem) => {
      dispatch(etransferWithdrawAction.setTokenSymbol.actions(item.symbol));
      // when network failed, transactionUnit should show as symbol
      setWithdrawInfo({
        ...withdrawInfo,
        limitCurrency: formatSymbolDisplay(item.symbol),
        transactionUnit: formatSymbolDisplay(item.symbol),
      });
      withdrawInfoRef.current = {
        ...withdrawInfo,
        limitCurrency: formatSymbolDisplay(item.symbol),
        transactionUnit: formatSymbolDisplay(item.symbol),
      };
      try {
        setLoading(true);
        setAmount('');

        // change token and empty form key's value
        form.setFieldValue(WithdrawFormKeys.AMOUNT, '');
        form.setFieldValue(WithdrawFormKeys.ADDRESS, '');
        form.setFieldValue(WithdrawFormKeys.NETWORK, '');
        form.setFieldValue(WithdrawFormKeys.COMMENT, '');
        handleAmountValidate();

        currentNetworkRef.current = undefined;
        dispatch(etransferWithdrawAction.setNetworkItem.actions(undefined));

        // reset max balance
        getAccountBalanceInterval(item);
        getAccountBalance(true, item);

        await getNetworkData({
          symbol: item.symbol,
          address: getAddressInput() || undefined,
        });
        await getWithdrawData(item.symbol);
      } finally {
        setLoading(false);
      }
    },
    [
      dispatch,
      form,
      getAccountBalance,
      getAccountBalanceInterval,
      getAddressInput,
      getNetworkData,
      getWithdrawData,
      handleAmountValidate,
      withdrawInfo,
    ],
  );

  const handleClickMax = useCallback(async () => {
    if (balance && tokenSymbol === 'ELF') {
      try {
        setLoading(true);
        const res = await getWithdrawData();

        const _maxBalance = await getAelfMaxBalance({
          balance,
          aelfFee: res?.withdrawInfo?.aelfTransactionFee || '',
          chainId: currentChainItemRef.current.key,
          tokenSymbol,
          contractAddress: currentToken.contractAddress,
        });

        setAmount(_maxBalance);
        form.setFieldValue(WithdrawFormKeys.AMOUNT, _maxBalance);
      } finally {
        setLoading(false);
      }
    } else {
      setAmount(balance);
      form.setFieldValue(WithdrawFormKeys.AMOUNT, balance);

      const amountValidate = await handleAmountValidate();
      if (amountValidate) {
        await getWithdrawData();
      }
    }
  }, [balance, tokenSymbol, getWithdrawData, currentToken.contractAddress, form, handleAmountValidate]);

  const handleAddressBlur = useCallback(async () => {
    const addressInput = getAddressInput();

    if (!addressInput) {
      handleFormValidateDataChange({
        [WithdrawFormKeys.ADDRESS]: {
          validateStatus: WithdrawValidateStatus.Normal,
          errorMessage: '',
        },
      });
      await getNetworkData({
        symbol: tokenSymbol,
        address: addressInput,
      });
      await getWithdrawData();
      return;
    } else if (addressInput.length < 32 || addressInput.length > 59) {
      handleFormValidateDataChange({
        [WithdrawFormKeys.ADDRESS]: {
          validateStatus: WithdrawValidateStatus.Error,
          errorMessage: 'Please enter a correct address.',
        },
      });
      setIsNetworkDisable(true);
      dispatch(etransferWithdrawAction.setNetworkItem.actions(undefined));
      await getAllNetworkData();
      return;
    }

    if (isDIDAddressSuffix(addressInput)) {
      form.setFieldValue(WithdrawFormKeys.ADDRESS, removeELFAddressSuffix(addressInput));
      dispatch(etransferWithdrawAction.setAddress.actions(removeELFAddressSuffix(addressInput)));
    }

    await getNetworkData({
      symbol: tokenSymbol,
      address: addressInput,
    });

    await getWithdrawData();
  }, [
    dispatch,
    form,
    getAddressInput,
    getAllNetworkData,
    getNetworkData,
    getWithdrawData,
    handleFormValidateDataChange,
    tokenSymbol,
  ]);

  const handleAddressChange = useCallback(
    async (value: string | null) => {
      dispatch(etransferWithdrawAction.setAddress.actions(value));
    },
    [dispatch],
  );

  const handleNetworkChanged = useCallback(
    async (item: TNetworkItem) => {
      currentNetworkRef.current = item;
      dispatch(etransferWithdrawAction.setNetworkItem.actions(item));
      form.setFieldValue(WithdrawFormKeys.AMOUNT, '');
      setAmount('');
      handleAmountValidate();
      await getWithdrawData();
    },
    [dispatch, form, getWithdrawData, handleAmountValidate],
  );

  const handleAmountChange = useCallback((event: any) => {
    const value = event.target?.value;
    const valueNotComma = parseWithCommas(value);
    setAmount(valueNotComma || '');
  }, []);

  const handleAmountBlur = useCallback(async () => {
    const amountValidate = await handleAmountValidate();
    if (amountValidate) {
      getWithdrawData();
    }
  }, [getWithdrawData, handleAmountValidate]);

  const handleClickFailedOk = useCallback(async () => {
    setAmount('');
    form.setFieldValue(WithdrawFormKeys.AMOUNT, '');

    getWithdrawData();
  }, [form, getWithdrawData]);

  const handleClickSuccessOk = useCallback(async () => {
    setAmount('');
    form.setFieldValue(WithdrawFormKeys.AMOUNT, '');

    getWithdrawData();
  }, [form, getWithdrawData]);

  // ETH fee tip
  useEffect(() => {
    if ((networkItem?.network === 'SETH' || networkItem?.network === 'ETH') && Number(withdrawInfo.feeUsd) > 60) {
      handleFormValidateDataChange({
        [WithdrawFormKeys.NETWORK]: {
          validateStatus: WithdrawValidateStatus.Warning,
          errorMessage: ETH_DELAY_WITHDRAWAL_TIP,
        },
      });
    } else {
      handleFormValidateDataChange({
        [WithdrawFormKeys.NETWORK]: {
          validateStatus: WithdrawValidateStatus.Normal,
          errorMessage: '',
        },
      });
    }
  }, [networkItem?.network, handleFormValidateDataChange, withdrawInfo.feeUsd]);

  // Interval update TransactionFee
  const getTransactionFeeTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!withdrawInfo.expiredTimestamp) {
      return;
    }
    if (getTransactionFeeTimerRef.current) {
      clearInterval(getTransactionFeeTimerRef.current);
    }
    getTransactionFeeTimerRef.current = setInterval(async () => {
      if (new Date().getTime() > withdrawInfo.expiredTimestamp && currentNetworkRef.current?.network) {
        await getWithdrawData();
      }
    }, 10000);
    return () => {
      if (getTransactionFeeTimerRef.current) {
        clearInterval(getTransactionFeeTimerRef.current);
      }
    };
  }, [getWithdrawData, withdrawInfo.expiredTimestamp, currentNetworkRef.current?.network]);

  const init = useCallback(async () => {
    try {
      setLoading(true);

      if (address) {
        form.setFieldValue(WithdrawFormKeys.ADDRESS, address);
      }

      const newCurrentSymbol = tokenSymbol;
      let newTokenList = tokenList;
      newTokenList = await getToken(true);
      const newCurrentToken = newTokenList.find((item) => item.symbol === newCurrentSymbol);

      if (networkItem?.network) {
        currentNetworkRef.current = networkItem as TNetworkItem;
        form.setFieldValue(WithdrawFormKeys.NETWORK, networkItem);

        // get new network data, when refresh page or switch side menu
        await getNetworkData({ symbol: newCurrentSymbol, address });
        getWithdrawData(newCurrentSymbol);
      } else {
        handleChainChanged(currentChainItemRef.current, newCurrentToken);
      }

      console.log('withdraw init', newCurrentToken?.symbol);
      getAccountBalanceInterval(newCurrentToken);
    } catch (error) {
      console.log('withdraw init error', error);
    } finally {
      setLoading(false);
    }
  }, [
    address,
    form,
    getAccountBalanceInterval,
    getNetworkData,
    getToken,
    getWithdrawData,
    handleChainChanged,
    networkItem,
    tokenList,
    tokenSymbol,
  ]);
  const initRef = useRef(init);
  initRef.current = init;

  useEffectOnce(() => {
    initRef.current();

    return () => {
      if (getAccountBalanceTimerRef.current) {
        clearInterval(getAccountBalanceTimerRef.current);
        getAccountBalanceTimerRef.current = null;
      }
    };
  });

  useEffect(() => {
    const { remove } = etransferEvents.AuthTokenSuccess.addListener(() => {
      console.log('login success');
      initRef.current();
    });
    return () => {
      remove();
    };
  }, []);

  useWithdrawNoticeSocket(isListenNoticeAuto);

  useUpdateEffect(() => {
    onActionChange?.({
      symbolSelected: tokenSymbol,
      addressInput: address,
      networkSelected: networkItem?.network,
      chainSelected: chainItem.key,
      processingTransactionCount: withdrawProcessingCount,
    });
  }, [tokenSymbol, address, networkItem, chainItem, withdrawProcessingCount]);

  return (
    <div className={clsx('etransfer-ui-withdraw', className)}>
      {isShowProcessingTip && (
        <div className="etransfer-ui-withdraw-processing-tip">
          <ProcessingTip
            depositProcessingCount={depositProcessingCount}
            withdrawProcessingCount={withdrawProcessingCount}
            onClick={onClickProcessingTip}
            borderRadius={componentStyle === ComponentStyle.Web ? 8 : 0}
          />
        </div>
      )}
      <div className="etransfer-ui-withdraw-body">
        <WithdrawSelectChain
          className={chainClassName}
          mobileTitle="Withdraw from"
          mobileLabel="from"
          webLabel={'Withdraw Assets from'}
          menuItems={chainList || []}
          selectedItem={chainItem}
          componentStyle={componentStyle}
          chainChanged={handleChainChanged}
        />
        <WithdrawForm
          form={form}
          className={fromClassName}
          formValidateData={formValidateData}
          componentStyle={componentStyle}
          isShowMobilePoweredBy={isShowMobilePoweredBy}
          address={getAddressInput()}
          balance={balance}
          amount={amount}
          minAmount={minAmount}
          receiveAmount={receiveAmount}
          isShowNetworkLoading={isShowNetworkLoading}
          isNetworkDisable={isNetworkDisable}
          isBalanceLoading={isBalanceLoading}
          isSubmitDisabled={isSubmitDisabled}
          isTransactionFeeLoading={isTransactionFeeLoading}
          onTokenChange={handleTokenChange}
          onAddressBlur={handleAddressBlur}
          onAddressChange={handleAddressChange}
          withdrawInfo={withdrawInfo}
          onNetworkChange={handleNetworkChanged}
          onClickMax={handleClickMax}
          onAmountChange={handleAmountChange}
          onAmountBlur={handleAmountBlur}
          onClickFailedOk={handleClickFailedOk}
          onClickSuccessOk={handleClickSuccessOk}
          onLogin={onLogin}
        />
      </div>
    </div>
  );
}
