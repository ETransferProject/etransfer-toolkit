import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useUpdateEffect } from 'react-use';
import './index.less';
import { useReCaptcha } from '../../hooks/recaptcha';
import { getNetworkType, setLoading } from '../../utils';
import { ETRANSFER_WEB_PAGE, ETRANSFER_WEB_PAGE_TESTNET } from '../../constants';
import { etransferEvents } from '@etransfer/utils';
import { GoogleReCaptchaMethods } from './types';
import { setReCaptchaModal } from '../../utils/recaptcha';
import { Modal } from 'antd';
import CommonSvg from '../CommonSvg';

export default function GoogleReCaptchaIframeModal() {
  const reCaptchaInfo = useReCaptcha();
  const reCaptchaIframeHost = useMemo(() => {
    const networkType = getNetworkType();
    return networkType === 'TESTNET' ? ETRANSFER_WEB_PAGE_TESTNET : ETRANSFER_WEB_PAGE;
  }, []);

  const [modalInfo, setModalInfo] = useState<
    {
      open?: boolean;
      modalWidth?: number;
    } & GoogleReCaptchaMethods
  >();

  const setHandler = useCallback((open?: boolean, handlers?: GoogleReCaptchaMethods) => {
    if (open) setModalLoading(true);

    setModalInfo({
      open,
      ...handlers,
    });
  }, []);

  useEffect(() => {
    const { remove } = etransferEvents.SetRecaptchaConfig.addListener(setHandler);
    return () => {
      remove();
    };
  }, [setHandler]);

  const closeModal = useCallback(() => {
    setReCaptchaModal(false);
  }, []);

  const onCancel = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const [isLoading, setModalLoading] = useState(false);

  const eventHandler = useCallback(
    (event: MessageEvent<any>) => {
      if (event.origin === reCaptchaIframeHost) {
        if (event.data.type === 'GOOGLE_RECAPTCHA_RESULT') {
          modalInfo?.onSuccess?.(event.data.data);
          closeModal();
        } else if (event.data.type === 'GOOGLE_RECAPTCHA_ERROR') {
          modalInfo?.onError?.(event.data.data);
        } else if (event.data.type === 'GOOGLE_RECAPTCHA_EXPIRED') {
          modalInfo?.onExpired?.(event.data.data);
        }
      }
    },
    [closeModal, modalInfo, reCaptchaIframeHost],
  );

  const connect = useCallback(() => {
    window.addEventListener('message', eventHandler);
  }, [eventHandler]);

  useUpdateEffect(() => {
    if (modalInfo?.open) {
      connect();
      setLoading(true);
    } else {
      setModalLoading(true);
      window.removeEventListener('message', eventHandler);
    }
  }, [modalInfo?.open]);

  const timeRef = useRef<NodeJS.Timeout | null>();

  const iframeLoad = useCallback(() => {
    setModalLoading(false);
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      timeRef.current && clearTimeout(timeRef.current);
      timeRef.current = null;
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Modal
      className={'etransfer-ui-reCaptcha-iframe-modal-container'}
      open={modalInfo?.open}
      width={modalInfo?.modalWidth || 480}
      centered
      zIndex={299}
      onCancel={onCancel}
      footer={null}
      mask={false}
      closeIcon={<CommonSvg type="close" />}
      //   hideCancelButton={true}
      //   hideOkButton={true}
    >
      <div className="etransfer-ui-reCaptcha-modal-inner">
        <iframe
          onLoad={iframeLoad}
          style={{ width: isLoading ? 0 : '100%', border: '0' }}
          src={`${reCaptchaIframeHost}/recaptcha?type=iframe&theme=${reCaptchaInfo?.theme || 'light'}&size=${
            reCaptchaInfo?.size || 'normal'
          }`}></iframe>
      </div>
    </Modal>
  );
}
