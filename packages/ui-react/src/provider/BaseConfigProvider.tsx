import { ReactNode } from 'react';
import clsx from 'clsx';
import { ChainType } from '@portkey/types';
import { ETRANSFER_ROOT_ID } from '../constants';
import ETransferProvider from '../context/ETransferProvider';

export default function BaseConfigProvider({
  chainType = 'aelf',
  children,
}: {
  chainType?: ChainType;
  children: ReactNode;
}) {
  return (
    <ETransferProvider chainType={chainType}>
      <div id={ETRANSFER_ROOT_ID} className={clsx('etransfer-ui-wrapper')}>
        {children}
        {/* <ScreenLoading />
        <ReCaptchaModal /> */}
      </div>
    </ETransferProvider>
  );
}
