import { useMemo, useState } from 'react';
import clsx from 'clsx';
import './index.less';
import { CONTRACT_ADDRESS, MINIMUM_DEPOSIT, SERVICE_FEE, SERVICE_FEE_TIP } from '../../../constants/deposit';
import { formatStr2Ellipsis, formatSymbolDisplay } from '../../../utils/format';
import { openWithBlank } from '../../../utils/common';
import { valueFixed2LessThanMin } from '@etransfer/utils';
import CommonSvg from '../../CommonSvg';
import { CommonModalProps } from '../../CommonModal';
import ViewContractAddressModal from '../../Modal/ViewContractAddressModal';
import { ComponentStyle } from '../../../types/common';
import CommonSpace from '../../CommonSpace';
import DepositDescription from './DepositDescription';
import CommonTip from '../../CommonTip';
import { NOTICE } from '../../../constants';

export interface DepositInfoProps {
  className?: string;
  depositTokenSymbol: string;
  networkName?: string;
  minimumDeposit: string;
  contractAddress: string;
  contractAddressLink: string;
  minAmountUsd: string;
  extraNotes?: string[];
  serviceFee?: string;
  serviceFeeUsd?: string;
  threshold?: string;
  modalContainer?: CommonModalProps['getContainer'];
  componentStyle?: ComponentStyle;
  customDescriptionNode?: React.ReactNode;
}

export default function DepositInfo({
  className,
  depositTokenSymbol,
  networkName,
  minimumDeposit,
  contractAddress,
  contractAddressLink,
  minAmountUsd,
  extraNotes,
  serviceFee,
  serviceFeeUsd,
  threshold,
  modalContainer,
  componentStyle = ComponentStyle.Web,
  customDescriptionNode,
}: DepositInfoProps) {
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const renderContractLinkForMobile = useMemo(() => {
    return (
      <span
        className={clsx('etransfer-ui-text-right', 'etransfer-ui-flex-row-center-end', 'address-ellipsis')}
        onClick={() => setOpenAddressModal(true)}>
        <span className="etransfer-ui-text-underline-none">{formatStr2Ellipsis(contractAddress, [6, 6])}</span>
        <span className={clsx('question-mark-icon')}>
          <CommonSvg type="questionMark" />
        </span>
      </span>
    );
  }, [contractAddress]);

  const renderContractLinkForWeb = useMemo(() => {
    return (
      <span
        className={clsx('etransfer-ui-text-right', 'info-value', {
          'etransfer-ui-text-link': !!contractAddressLink,
        })}
        onClick={() => openWithBlank(contractAddressLink)}>
        {contractAddress || '-'}
      </span>
    );
  }, [contractAddress, contractAddressLink]);

  const renderDepositDescription = useMemo(() => {
    return (
      Array.isArray(extraNotes) &&
      extraNotes.length > 0 && <DepositDescription list={extraNotes} customContent={customDescriptionNode} />
    );
  }, [customDescriptionNode, extraNotes]);

  const serviceFeeTip = useMemo(() => {
    return (
      <div>
        <div>{SERVICE_FEE_TIP}</div>
        <div>{`• Deposit amount ≥ ${threshold} ${formatSymbolDisplay(depositTokenSymbol)}: No service fee`}</div>
        <div>
          {`• Deposit amount < ${threshold} ${formatSymbolDisplay(
            depositTokenSymbol,
          )}: Max service fee ${serviceFee} ${formatSymbolDisplay(depositTokenSymbol)}`}
        </div>
      </div>
    );
  }, [depositTokenSymbol, serviceFee, threshold]);

  return (
    <div className={clsx('etransfer-ui-flex-column etransfer-ui-deposit-info', className)}>
      {!!serviceFee && serviceFee !== '0' && (
        <div className={clsx('etransfer-ui-flex-row-start', 'info-line')}>
          <div className={clsx('etransfer-ui-flex-row-center etransfer-ui-gap-4', 'info-title')}>
            {SERVICE_FEE}
            <CommonTip
              tip={serviceFeeTip}
              className={'service-fee-tip'}
              modalTitle={NOTICE}
              icon={<CommonSvg type="questionMark16" />}
              componentStyle={componentStyle}
            />
          </div>
          <div className={clsx('etransfer-ui-flex-1')}>
            <div className={clsx('etransfer-ui-text-right', 'info-value')}>
              {`0~${serviceFee}`} {formatSymbolDisplay(depositTokenSymbol)}
            </div>
            <div className={clsx('etransfer-ui-text-right', 'info-exhibit')}>
              {`$ 0~${valueFixed2LessThanMin(serviceFeeUsd, '')}`}
            </div>
          </div>
        </div>
      )}
      {!!minimumDeposit && (
        <div className={clsx('etransfer-ui-flex', 'info-line')}>
          <div className={clsx('etransfer-ui-flex-none', 'info-title')}>{MINIMUM_DEPOSIT}</div>
          <div className={clsx('etransfer-ui-flex-1')}>
            <div className={clsx('etransfer-ui-text-right', 'info-value')}>
              {minimumDeposit} {formatSymbolDisplay(depositTokenSymbol)}
            </div>
            <div className={clsx('etransfer-ui-text-right', 'info-exhibit')}>
              {minAmountUsd === '0' ? '$ 0' : valueFixed2LessThanMin(minAmountUsd, '$ ')}
            </div>
          </div>
        </div>
      )}
      {!!contractAddress && (
        <div className={clsx('etransfer-ui-flex', 'info-line')}>
          <div className={clsx('etransfer-ui-flex-none', 'info-title')}>{CONTRACT_ADDRESS}</div>
          <div className={clsx('etransfer-ui-flex-1', 'etransfer-ui-flex-row-content-end')}>
            {componentStyle === ComponentStyle.Mobile ? renderContractLinkForMobile : renderContractLinkForWeb}
          </div>
        </div>
      )}

      <CommonSpace direction="vertical" size={24} />
      {renderDepositDescription}

      <ViewContractAddressModal
        componentStyle={componentStyle}
        open={openAddressModal}
        getContainer={modalContainer}
        network={networkName || ''}
        value={contractAddress}
        link={contractAddressLink}
        onOk={() => setOpenAddressModal(false)}
      />
    </div>
  );
}
