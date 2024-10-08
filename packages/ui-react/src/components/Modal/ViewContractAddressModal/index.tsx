import { GOT_IT } from '../../../constants';
import { ComponentStyle } from '../../../types';
import { CopySize } from '../../../types/components';
import { CommonModalProps } from '../../CommonModal';
import CommonModalTip from '../../CommonTips/CommonModalTip';
import Copy from '../../Copy';
import OpenLink from '../../OpenLink';
import './index.less';
import clsx from 'clsx';

export type TViewContractAddressModal = {
  className?: string;
  componentStyle?: ComponentStyle;
  network: string;
  value: string;
  open?: boolean;
  link?: string;
  getContainer?: CommonModalProps['getContainer'];
  onOk?: () => void;
};

const ViewContractAddressModalTitle = 'Contract Address on ';

export default function ViewContractAddressModal({
  className,
  componentStyle = ComponentStyle.Web,
  open = false,
  network,
  value,
  link,
  getContainer,
  onOk,
}: TViewContractAddressModal) {
  return (
    <CommonModalTip
      className={clsx('etransfer-ui-view-contract-address-modal', className)}
      footerClassName="etransfer-ui-view-contract-address-modal-footer"
      getContainer={getContainer}
      open={open}
      closable={false}
      okText={GOT_IT}
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
                componentStyle={componentStyle}
                size={CopySize.Big}
              />
            )}
            {!!link && <OpenLink className="etransfer-ui-flex-none etransfer-ui-cursor-pointer" href={link} />}
          </div>
        </div>
      </div>
    </CommonModalTip>
  );
}
