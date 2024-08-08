import { useState, useCallback, useMemo } from 'react';
import { Form } from 'antd';
import clsx from 'clsx';
import './index.less';
import { BusinessType, TNetworkItem, TWalletType, TWithdrawInfo } from '@etransfer/types';
import PartialLoading from '../../PartialLoading';
import {
  AelfExploreType,
  DEFAULT_NULL_VALUE,
  DEFAULT_WITHDRAW_ERROR_MESSAGE,
  INITIAL_WITHDRAW_STATE,
  INITIAL_WITHDRAW_SUCCESS_CHECK,
} from '../../../constants';
import CommonButton from '../../CommonButton';
import CommonLink from '../../CommonLink';
import {
  etransferCore,
  getAccountAddress,
  getAccountInfo,
  getAelfExploreLink,
  getAelfReact,
  getNetworkType,
  setLoading,
} from '../../../utils';
import SuccessModal from '../SuccessModal';
import FailModal from '../FailModal';
import DoubleCheckModal from '../DoubleCheckModal';
import { ComponentStyle, CONTRACT_TYPE, TWithdrawInfoSuccess } from '../../../types';
import CommonSvg from '../../CommonSvg';
import FeeInfo from '../FeeInfo';
import { useETransferWithdraw } from '../../../context/ETransferWithdrawProvider';
import { WithdrawErrorNameType } from '@etransfer/core';
import { removeDIDAddressSuffix } from '@etransfer/utils';
import { WalletTypeEnum } from '../../../provider/types';

export interface WithdrawFooterProps {
  isTransactionFeeLoading: boolean;
  isSubmitDisabled: boolean;
  currentNetwork?: Partial<TNetworkItem>;
  amount: string;
  receiveAmount: string;
  address: string;
  withdrawInfo: TWithdrawInfo;
  componentStyle: ComponentStyle;
  clickFailedOk: () => void;
  clickSuccessOk: () => void;
}

export default function WithdrawFooter({
  isTransactionFeeLoading,
  currentNetwork,
  amount,
  receiveAmount,
  address,
  withdrawInfo,
  isSubmitDisabled,
  componentStyle = ComponentStyle.Web,
  clickFailedOk,
  clickSuccessOk,
}: WithdrawFooterProps) {
  // const { walletInfo, walletType, isLocking, callViewMethod, callSendMethod, getSignature } = useConnectWallet();
  // const accounts = useGetAccount();

  const [{ tokenList, tokenSymbol, chainItem, networkItem }] = useETransferWithdraw();

  // DoubleCheckModal
  const [isDoubleCheckModalOpen, setIsDoubleCheckModalOpen] = useState(false);

  // FailModal
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [failModalReason, setFailModalReason] = useState('');

  // SuccessModal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [withdrawInfoSuccess, setWithdrawInfoSuccess] = useState<TWithdrawInfoSuccess>(INITIAL_WITHDRAW_SUCCESS_CHECK);

  const currentToken = useMemo(() => {
    const item = tokenList?.find((item) => item.symbol === tokenSymbol);
    return item?.symbol ? item : INITIAL_WITHDRAW_STATE.tokenList[0];
  }, [tokenSymbol, tokenList]);

  const currentTokenDecimal = useMemo(() => currentToken.decimals, [currentToken.decimals]);

  const currentTokenAddress = useMemo(() => currentToken.contractAddress, [currentToken.contractAddress]);

  const onSubmit = useCallback(() => {
    if (!currentNetwork) return;
    setIsDoubleCheckModalOpen(true);
  }, [currentNetwork]);

  const createTransactionOrder = useCallback(async () => {
    try {
      setLoading(false);

      const aelfReact = getAelfReact(getNetworkType(), chainItem.key);
      const accountAddress = getAccountAddress(chainItem.key);
      const { walletType, caHash, managerAddress } = getAccountInfo();

      if (walletType !== WalletTypeEnum.elf && (!caHash || !managerAddress))
        throw new Error('User information is missing');
      if (!accountAddress) throw new Error('User address is missing');

      // const res = await etransferCore.sendWithdrawOrder({
      //   tokenContractCallSendMethod: (params, sendOptions) => callSendMethod(chainItem.key, params, sendOptions),
      //   tokenContractAddress: aelfReact.contractAddress[CONTRACT_TYPE.TOKEN],
      //   endPoint: aelfReact.endPoint,
      //   symbol: tokenSymbol,
      //   decimals: currentTokenDecimal,
      //   amount,
      //   toAddress: address,
      //   caContractAddress: aelfReact.contractAddress[CONTRACT_TYPE.CA],
      //   eTransferContractAddress: currentTokenAddress,
      //   walletType: walletType === WalletTypeEnum.elf ? TWalletType.NightElf : TWalletType.Portkey,
      //   caHash: caHash || undefined,
      //   network: networkItem?.network || '',
      //   chainId: chainItem.key,
      //   managerAddress: managerAddress || removeDIDAddressSuffix(accountAddress),
      //   accountAddress: removeDIDAddressSuffix(accountAddress),
      //   getSignature: getSignature,
      // });
      // console.log('>>>>>> res', res);
    } catch (error: any) {
      setLoading(false);
      if (error?.code == 4001) {
        setFailModalReason('The request is rejected. ETransfer needs your permission to proceed.');
      } else if (error.name === WithdrawErrorNameType.SHOW_FAILED_MODAL) {
        setFailModalReason(error.message);
      } else {
        setFailModalReason(DEFAULT_WITHDRAW_ERROR_MESSAGE);
      }
      console.log('sendTransferTokenTransaction error:', error);
      setIsFailModalOpen(true);
    } finally {
      setIsDoubleCheckModalOpen(false);
    }
  }, []);

  const onClickSuccess = useCallback(() => {
    setIsSuccessModalOpen(false);
    clickSuccessOk();
  }, [clickSuccessOk]);

  const onClickFailed = useCallback(() => {
    setIsFailModalOpen(false);
    clickFailedOk();
  }, [clickFailedOk]);

  return (
    <div className={clsx('form-footer', 'form-footer-safe-area')}>
      <div className={clsx('etransfer-ui-flex-1', 'etransfer-ui-flex-column', 'footer-info-wrapper')}>
        <div className={clsx('etransfer-ui-flex-column', 'receive-amount-wrapper')}>
          <div className={'info-label'}>Amount to Be Received</div>
          <div className={clsx('etransfer-ui-flex-row-center', 'info-value', 'info-value-big-font')}>
            {isTransactionFeeLoading && <PartialLoading />}
            {!isTransactionFeeLoading && `${(!isSuccessModalOpen && receiveAmount) || DEFAULT_NULL_VALUE} `}
            <span className={clsx('info-unit')}>{withdrawInfo.transactionUnit}</span>
          </div>
        </div>
        <FeeInfo
          isTransactionFeeLoading={isTransactionFeeLoading}
          isSuccessModalOpen={isSuccessModalOpen}
          transactionFee={withdrawInfo.transactionFee}
          transactionUnit={withdrawInfo.transactionUnit}
          aelfTransactionFee={withdrawInfo.aelfTransactionFee}
          aelfTransactionUnit={withdrawInfo.aelfTransactionUnit}
        />
      </div>
      <Form.Item shouldUpdate className={clsx('etransfer-ui-flex-none', 'form-submit-button-wrapper')}>
        <CommonButton
          className={'form-submit-button'}
          // htmlType="submit"
          onClick={onSubmit}
          disabled={isTransactionFeeLoading || !receiveAmount || isSubmitDisabled}>
          {BusinessType.Withdraw}
        </CommonButton>
      </Form.Item>

      <DoubleCheckModal
        componentStyle={componentStyle}
        withdrawInfo={{
          amount,
          receiveAmount,
          address,
          network: currentNetwork,
          transactionFee: {
            amount: withdrawInfo.transactionFee,
            currency: withdrawInfo.transactionUnit,
            name: withdrawInfo.transactionUnit,
          },
          aelfTransactionFee: {
            amount: withdrawInfo.aelfTransactionFee,
            currency: withdrawInfo.aelfTransactionUnit,
            name: withdrawInfo.aelfTransactionUnit,
          },
          symbol: tokenSymbol,
          amountUsd: withdrawInfo.amountUsd,
          receiveAmountUsd: withdrawInfo.receiveAmountUsd,
          feeUsd: withdrawInfo.feeUsd,
        }}
        modalProps={{
          open: isDoubleCheckModalOpen,
          onClose: () => setIsDoubleCheckModalOpen(false),
          onOk: () => {
            setIsDoubleCheckModalOpen(false);
            createTransactionOrder();
          },
        }}
        isTransactionFeeLoading={isTransactionFeeLoading}
      />
      <SuccessModal
        componentStyle={componentStyle}
        withdrawInfo={withdrawInfoSuccess}
        modalProps={{
          open: isSuccessModalOpen,
          onClose: onClickSuccess,
          onOk: onClickSuccess,
          footerSlot: CommonLink({
            href: getAelfExploreLink(withdrawInfoSuccess.transactionId, AelfExploreType.transaction, chainItem.key),
            children: (
              <div className={clsx('link-wrap', componentStyle === ComponentStyle.Web && 'linkToExplore')}>
                <span className={'link-word'}>View on aelf Explorer</span>
                <CommonSvg type="exploreLink" className={'link-explore-icon'} />
              </div>
            ),
          }),
        }}
      />
      <FailModal
        componentStyle={componentStyle}
        failReason={failModalReason}
        modalProps={{
          open: isFailModalOpen,
          onClose: onClickFailed,
          onOk: onClickFailed,
        }}
      />
    </div>
  );
}
