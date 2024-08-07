import { useEffect, useState, useCallback } from 'react';
import { GlobalLoadingInfo } from '../../utils';
import { etransferEvents } from '@etransfer/utils';
import CircleLoading from '../CircleLoading';
import { Modal } from 'antd';
import clsx from 'clsx';
import './index.less';

export default function GlobalLoading() {
  const [loadingInfo, setLoadingInfo] = useState<GlobalLoadingInfo>();

  const setLoadingHandler = useCallback((isLoading: boolean, loadingInfo?: GlobalLoadingInfo) => {
    const isHasText = typeof loadingInfo?.isHasText === 'boolean' ? loadingInfo?.isHasText : true;
    const info = {
      ...loadingInfo,
      isHasText,
      text: isHasText ? loadingInfo?.text || 'Loading...' : '',
    };
    setLoadingInfo({
      isLoading,
      ...info,
    });
  }, []);

  useEffect(() => {
    const { remove } = etransferEvents.SetGlobalLoading.addListener(setLoadingHandler);

    return () => {
      remove();
    };
  }, [setLoadingHandler]);

  return (
    <Modal
      className={clsx('etransfer-ui-global-loading-modal', loadingInfo?.className)}
      closable={false}
      keyboard={false}
      maskClosable={false}
      footer={null}
      centered
      open={loadingInfo?.isLoading}>
      <CircleLoading />
      {!!loadingInfo?.text && (
        <span className={clsx('etransfer-ui-text-center', 'etransfer-ui-global-loading-modal-text')}>
          {loadingInfo?.text}
        </span>
      )}
    </Modal>
  );
}
