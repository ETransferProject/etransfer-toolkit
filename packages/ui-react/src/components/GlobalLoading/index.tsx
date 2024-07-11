import { useEffect, useState, useCallback } from 'react';
import { GlobalLoadingInfo } from '../../utils/loading';
import { etransferEvents } from '@etransfer/utils';
import CircleLoading from '../CircleLoading';
import { Modal } from 'antd';
import clsx from 'clsx';
import './index.less';
import { ComponentStyle } from '../../types';

export interface GlobalLoadingProps {
  componentStyle?: ComponentStyle;
}

export default function GlobalLoading({ componentStyle = ComponentStyle.Web }: GlobalLoadingProps) {
  const [loadingInfo, setLoadingInfo] = useState<GlobalLoadingInfo>();
  const defaultWidth = componentStyle === ComponentStyle.Mobile ? 240 : 360;

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
      width={loadingInfo?.width || defaultWidth}
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
