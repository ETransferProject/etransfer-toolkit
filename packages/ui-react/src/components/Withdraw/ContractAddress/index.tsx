import clsx from 'clsx';
import './index.less';
import { useCallback, useState } from 'react';
import { CONTRACT_ADDRESS } from '../../../constants';
import { formatStr2Ellipsis } from '../../../utils';
import ViewContractAddressModal from '../../Modal/ViewContractAddressModal';
import CommonSvg from '../../CommonSvg';

export function ContractAddressForMobile({
  label = CONTRACT_ADDRESS,
  networkName,
  address,
  explorerUrl,
}: {
  label?: string;
  networkName: string;
  address: string;
  explorerUrl?: string;
}) {
  const [openModal, setOpenModal] = useState(false);
  const handleView = useCallback(() => {
    setOpenModal(true);
  }, []);

  return (
    <div className={clsx('etransfer-ui-flex-row-start', 'etransfer-ui-withdraw-contract-address-mobile')}>
      <div
        className={clsx('etransfer-ui-flex-none', 'etransfer-ui-withdraw-contract-address-label')}>{`• ${label}:`}</div>
      <div
        className={clsx('etransfer-ui-flex-row-start', 'etransfer-ui-withdraw-contract-address-value')}
        onClick={handleView}>
        {formatStr2Ellipsis(address, [6, 6])}
        <span className={clsx('etransfer-ui-withdraw-contract-address-icon')}>
          <CommonSvg type="questionMark" />
        </span>
      </div>

      <ViewContractAddressModal
        open={openModal}
        network={networkName}
        value={address}
        link={explorerUrl}
        onOk={() => setOpenModal(false)}
      />
    </div>
  );
}

export function ContractAddressForWeb({
  label = CONTRACT_ADDRESS,
  address,
  explorerUrl,
}: {
  label?: string;
  address: string;
  explorerUrl?: string;
}) {
  return (
    <div className={clsx('etransfer-ui-flex-row-start', 'etransfer-ui-withdraw-contract-address-web')}>
      <div className={clsx('etransfer-ui-flex-none', 'etransfer-ui-withdraw-contract-address-label')}>{label}</div>
      <div className={clsx('etransfer-ui-flex-1', 'etransfer-ui-flex-row-content-end')}>
        <span
          className={clsx(
            'etransfer-ui-text-right',
            'etransfer-ui-text-break',
            'etransfer-ui-withdraw-contract-address-value',
            {
              'etransfer-ui-text-link': !!explorerUrl,
            },
          )}
          onClick={() => {
            if (explorerUrl) {
              window?.open(explorerUrl, '_blank');
            }
          }}>
          {address}
        </span>
      </div>
    </div>
  );
}
