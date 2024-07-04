import { useMemo, useState } from 'react';
import clsx from 'clsx';
import './index.less';
import { CONTRACT_ADDRESS, MINIMUM_DEPOSIT } from '../../../constants/deposit';
import { formatStr2Ellipsis, formatSymbolDisplay } from '../../../utils/format';
import { openWithBlank } from '../../../utils/common';
import { valueFixed2LessThanMin } from '../../../utils/calculate';
import CommonSvg from '../../CommonSvg';
import { CommonModalProps } from '../../CommonModal';
import ViewContractAddressModal from '../../Modal/ViewContractAddressModal';
import { ComponentStyle } from '../../../types/common';
import CommonSpace from '../../CommonSpace';
import DepositDescription from './DepositDescription';

export interface DepositInfoProps {
  depositTokenSymbol: string;
  networkName?: string;
  minimumDeposit: string;
  contractAddress: string;
  contractAddressLink: string;
  minAmountUsd: string;
  extraNotes?: string[];
  modalContainer?: CommonModalProps['getContainer'];
  componentStyle?: ComponentStyle;
}

export default function DepositInfo({
  depositTokenSymbol,
  networkName,
  minimumDeposit,
  contractAddress,
  contractAddressLink,
  minAmountUsd,
  extraNotes,
  modalContainer,
  componentStyle = ComponentStyle.Web,
}: DepositInfoProps) {
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const renderContractLinkForMobile = useMemo(() => {
    return (
      <span className={clsx('etransfer-ui-text-right', 'info-value')} onClick={() => setOpenAddressModal(true)}>
        <span className={clsx('etransfer-ui-flex-row-center', 'address-ellipsis')}>
          <span className="etransfer-ui-text-underline-none">{formatStr2Ellipsis(contractAddress, [6, 6])}</span>
          <span className={clsx('question-mark-icon')}>
            <CommonSvg type="questionMark" />
          </span>
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
    return Array.isArray(extraNotes) && extraNotes.length > 0 && <DepositDescription list={extraNotes} />;
  }, [extraNotes]);

  return (
    <div className="etransfer-ui-flex-column etransfer-ui-deposit-info">
      {!!minimumDeposit && (
        <div className={clsx('etransfer-ui-flex', 'info-line')}>
          <div className={clsx('etransfer-ui-flex-none', 'info-title')}>{MINIMUM_DEPOSIT}</div>
          <div className={clsx('etransfer-ui-flex-1')}>
            <div className={clsx('etransfer-ui-text-right', 'info-value')}>
              {minimumDeposit} {formatSymbolDisplay(depositTokenSymbol)}
            </div>
            <div className={clsx('etransfer-ui-text-right', 'info-exhibit')}>
              {valueFixed2LessThanMin(minAmountUsd, '$ ')}
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
