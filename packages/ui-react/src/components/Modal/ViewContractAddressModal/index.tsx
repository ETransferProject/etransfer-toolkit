import { CommonModalProps } from '../../CommonModal';
import CommonModalTips from '../../CommonModalTips';
import Copy from '../../Copy';
import OpenLink from '../../OpenLink';
import './index.less';
import clsx from 'clsx';

export type TViewContractAddressModal = {
  open?: boolean;
  network: string;
  value: string;
  link?: string;
  getContainer?: CommonModalProps['getContainer'];
  onOk?: () => void;
};

const ViewContractAddressModalTitle = 'Contract Address on ';

export default function ViewContractAddressModal({
  open = false,
  network,
  value,
  link,
  getContainer,
  onOk,
}: TViewContractAddressModal) {
  return (
    <CommonModalTips
      className="etransfer-ui-view-contract-address-modal"
      footerClassName="etransfer-ui-view-contract-address-modal-footer"
      getContainer={getContainer}
      open={open}
      closable={false}
      okText="OK"
      onOk={onOk}>
      <div className="etransfer-ui-view-contract-address-modal-body">
        <div className="view-contract-address-modal-title">
          {ViewContractAddressModalTitle}
          {network}
        </div>
        <div className={clsx('etransfer-ui-flex-row-between', 'view-contract-address-modal-content')}>
          <div className="view-contract-address-modal-contract">{value}</div>
          <div className={clsx('etransfer-ui-flex-row-start', 'view-contract-address-modal-action')}>
            {!!value && (
              <Copy
                className={clsx('etransfer-ui-flex-none', 'view-contract-address-modal-copy-icon')}
                toCopy={value}
              />
            )}
            {!!link && <OpenLink className="etransfer-ui-flex-none etransfer-ui-cursor-pointer" href={link} />}
          </div>
        </div>
      </div>
    </CommonModalTips>
  );
}