import { ReactNode } from 'react';
import clsx from 'clsx';
import { ETRANSFER_ROOT_ID } from '../constants';
import { ETransferProvider } from '../context/ETransferProvider';
import GlobalLoading from '../components/GlobalLoading';
import { NetworkType } from '../types';

export function ETransferLayoutProvider({
  networkType = 'MAINNET',
  children,
}: {
  networkType?: NetworkType;
  children: ReactNode;
}) {
  return (
    <ETransferProvider networkType={networkType}>
      <div id={ETRANSFER_ROOT_ID} className={clsx('etransfer-ui-wrapper')}>
        {children}
        <GlobalLoading />
        {/* <ReCaptchaModal /> */}
      </div>
    </ETransferProvider>
  );
}
