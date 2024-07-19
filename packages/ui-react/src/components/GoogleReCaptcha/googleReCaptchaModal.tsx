import { Modal } from 'antd';
import { ReCaptchaType } from './types';
import GoogleReCaptcha from '.';
import { NetworkType } from '../../types';
import CommonSvg from '../CommonSvg';
import './index.less';

type TGoogleReCaptchaResult = { type: ReCaptchaType; data: string | any; error?: any };

const RECAPTCHA_SITE_KEY_TESTNET = '6Lf-WvApAAAAAEmz8bha6UfBjuoX57dWYEIOjw2G';
const RECAPTCHA_SITE_KEY_MAINNET = '6LdgSOwpAAAAABwDI184IDgOWBpS3BnLgCDsUPS3';

const googleReCaptchaModal = async (
  networkType?: NetworkType,
  width?: number,
): Promise<TGoogleReCaptchaResult | undefined | any> => {
  const RECAPTCHA_SITE_KEY = networkType === 'TESTNET' ? RECAPTCHA_SITE_KEY_TESTNET : RECAPTCHA_SITE_KEY_MAINNET;
  return new Promise((resolve, reject) => {
    const modal = Modal.info({
      closable: true,
      closeIcon: <CommonSvg type="close" style={{ width: 20, height: 20 }} />,
      wrapClassName: 'etransfer-ui-reCaptcha-modal-wrapper',
      className: 'etransfer-ui-reCaptcha-modal-container',
      width: width,
      maskClosable: false,
      content: RECAPTCHA_SITE_KEY ? (
        <GoogleReCaptcha
          siteKey={RECAPTCHA_SITE_KEY}
          theme="light"
          size="normal"
          onSuccess={(res) => {
            resolve({ type: ReCaptchaType.success, data: res });
            modal.destroy();
          }}
          onError={(error) => {
            console.log('error', error);
            reject({ type: ReCaptchaType.error, error });
            modal.destroy();
          }}
          onExpired={(res) => {
            console.log('expired', res);
            reject({ type: ReCaptchaType.expire, data: res });
            modal.destroy();
          }}
        />
      ) : (
        'Invalid siteKey'
      ),
      onCancel: () => {
        reject({
          type: ReCaptchaType.cancel,
          data: 'User canceled the verification',
        });
        modal.destroy();
      },
    });
  });
};

export default googleReCaptchaModal;
