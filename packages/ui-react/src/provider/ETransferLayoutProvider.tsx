import { ReactNode } from 'react';
import clsx from 'clsx';
import { ETRANSFER_ROOT_ID } from '../constants';
import GlobalLoading from '../components/GlobalLoading';

export function ETransferLayoutProvider({ children }: { children: ReactNode }) {
  return (
    <div id={ETRANSFER_ROOT_ID} className={clsx('etransfer-ui-wrapper')}>
      {children}
      <GlobalLoading />
      {/* <ReCaptchaModal /> */}
    </div>
  );
}
