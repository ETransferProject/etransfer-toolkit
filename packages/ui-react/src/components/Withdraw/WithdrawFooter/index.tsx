import { useState, useMemo, useCallback } from 'react';
import { Form } from 'antd';
import clsx from 'clsx';
import './index.less';
import { BusinessType, TNetworkItem, TWithdrawInfo } from '@etransfer/types';
import PartialLoading from '../../PartialLoading';
import {
  AelfExploreType,
  DEFAULT_NULL_VALUE,
  INITIAL_WITHDRAW_STATE,
  INITIAL_WITHDRAW_SUCCESS_CHECK,
} from '../../../constants';
import CommonButton from '../../CommonButton';
import CommonLink from '../../CommonLink';
import { getAelfExploreLink } from '../../../utils';
import SuccessModal from '../SuccessModal';
import FailModal from '../FailModal';
import DoubleCheckModal from '../DoubleCheckModal';
import { ComponentStyle, TWithdrawInfoSuccess } from '../../../types';
import CommonSvg from '../../CommonSvg';
import FeeInfo from '../FeeInfo';
import { useETransferWithdraw } from '../../../context/ETransferWithdrawProvider';

export interface WithdrawFooterProps {
  isTransactionFeeLoading: boolean;
  isSubmitDisabled: boolean;
  currentNetwork?: TNetworkItem;
  receiveAmount: string;
  address: string;
  balance: string;
  withdrawInfo: TWithdrawInfo;
  componentStyle: ComponentStyle;
  clickFailedOk: () => void;
  clickSuccessOk: () => void;
}

export default function WithdrawFooter({
  isTransactionFeeLoading,
  currentNetwork,
  receiveAmount,
  address,
  balance,
  withdrawInfo,
  isSubmitDisabled,
  componentStyle = ComponentStyle.Web,
  clickFailedOk,
  clickSuccessOk,
}: WithdrawFooterProps) {
  // const { walletInfo, walletType, isLocking, callViewMethod, callSendMethod, getSignature } = useConnectWallet();
  // const accounts = useGetAccount();

  const [{ tokenSymbol, tokenList, networkItem, networkList, chainItem, chainList }, { dispatch }] =
    useETransferWithdraw();

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

  const onClickSuccess = useCallback(() => {
    setIsSuccessModalOpen(false);
    clickSuccessOk();
  }, [clickSuccessOk]);

  const onClickFailed = useCallback(() => {
    setIsSuccessModalOpen(false);
    clickFailedOk();
  }, [clickFailedOk]);

  return (
    <div className={clsx('form-footer', 'form-footer-safe-area')}>
      <div className={clsx('flex-1', 'flex-column', 'footer-info-wrapper')}>
        <div className={clsx('flex-column', 'receive-amount-wrapper')}>
          <div className={'info-label'}>Amount to Be Received</div>
          <div className={clsx('flex-row-center', 'info-value', 'info-value-big-font')}>
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
      <Form.Item shouldUpdate className={clsx('flex-none', 'form-submit-button-wrapper')}>
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
          receiveAmount,
          address,
          network: currentNetwork,
          amount: balance,
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
            // sendTransferTokenTransaction();
          },
        }}
        isTransactionFeeLoading={isTransactionFeeLoading}
      />
      <SuccessModal
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
