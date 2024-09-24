import { useCallback, useMemo, useState } from 'react';
import './index.less';
import { OrderStatusEnum } from '@etransfer/types';
import { Tooltip } from 'antd';
import CommonModal from '../../CommonModal';
import { ComponentStyle } from '../../../types';
import { GOT_IT, HistoryStatusEnum, ORDER_FAILED_TIP, ORDER_PROCESSING_TIP } from '../../../constants';
import CommonSvg from '../../CommonSvg';

type TStatusBoxProps = {
  status: string;
  network: string;
  componentStyle?: ComponentStyle;
};

export default function StatusBox({ status, network, componentStyle = ComponentStyle.Web }: TStatusBoxProps) {
  const [isMobileOpenModal, setIsMobileOpenModal] = useState(false);
  const [tipMessage, setTipMessage] = useState('');
  const [title, setTitle] = useState('');
  const isMobileStyle = useMemo(() => componentStyle === ComponentStyle.Mobile, [componentStyle]);

  const handleClick = useCallback(() => {
    if (!isMobileStyle) {
      return;
    }
    // set tip message: Processing  Failed
    switch (status) {
      case OrderStatusEnum.Processing:
        setTipMessage(ORDER_PROCESSING_TIP + network);
        setTitle(HistoryStatusEnum.Processing);
        break;
      case OrderStatusEnum.Failed:
        setTipMessage(ORDER_FAILED_TIP);
        setTitle(HistoryStatusEnum.Failed);
        break;
      default:
        setTipMessage('');
        setTitle('');
        break;
    }
    setIsMobileOpenModal(true);
  }, [isMobileStyle, status, network]);

  const content = useMemo(() => {
    switch (status) {
      case OrderStatusEnum.Processing:
        return (
          <Tooltip title={!isMobileStyle && ORDER_PROCESSING_TIP + network}>
            <div className="etransfer-ui-history-status-box" onClick={() => handleClick()}>
              <CommonSvg type="timeFilled" />
              <span className="etransfer-ui-history-status-box-processing">{HistoryStatusEnum.Processing}</span>
              <CommonSvg type="questionMark" />
            </div>
          </Tooltip>
        );
      case OrderStatusEnum.Succeed:
        return <div className="etransfer-ui-history-status-box">{HistoryStatusEnum.Succeed}</div>;
      case OrderStatusEnum.Failed:
        return (
          <Tooltip title={!isMobileStyle && ORDER_FAILED_TIP} placement="top">
            <div className="etransfer-ui-history-status-box" onClick={() => handleClick()}>
              <CommonSvg type="closeFilled" />
              <span className="etransfer-ui-history-status-box-failed">{HistoryStatusEnum.Failed}</span>
              <CommonSvg type="questionMark" />
            </div>
          </Tooltip>
        );
      default:
        return null;
    }
  }, [status, handleClick, network, isMobileStyle]);

  return (
    <div className="etransfer-ui-history-status-box-wrapper">
      {content}
      <CommonModal
        width={'300px'}
        hideCancelButton={true}
        okText={GOT_IT}
        onOk={() => setIsMobileOpenModal(false)}
        title={title}
        open={isMobileOpenModal}
        onCancel={() => setIsMobileOpenModal(false)}>
        <div>{tipMessage}</div>
      </CommonModal>
    </div>
  );
}
