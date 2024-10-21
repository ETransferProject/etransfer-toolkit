import { ReactNode } from 'react';
import { ETRANSFER_ROOT_ID } from '../constants';
import GlobalLoading from '../components/GlobalLoading';
import GoogleReCaptchaIframeModal from '../components/GoogleReCaptcha/GoogleReCaptchaIframeModal';

export function ETransferLayoutProvider({ children }: { children: ReactNode }) {
  return (
    <div id={ETRANSFER_ROOT_ID} className="etransfer-ui-wrapper">
      {children}
      <GlobalLoading />
      <GoogleReCaptchaIframeModal />
    </div>
  );
}
