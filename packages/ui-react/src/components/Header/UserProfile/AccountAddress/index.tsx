import './index.less';
import clsx from 'clsx';
import CommonAddress from '../../../CommonAddress';
import { SYNCHRONIZING_ADDRESS } from '../../../../constants';
import { CopySize } from '../../../../types/components';

export interface AccountAddressProps {
  hideBorder?: boolean;
  accountList: { label: string; value: string }[];
}

export default function AccountAddress({ hideBorder, accountList }: AccountAddressProps) {
  return (
    <div>
      {accountList?.map((item) => (
        <div key={item.label} className={clsx('address-wrapper', hideBorder ? 'address-hideBorder' : '')}>
          <CommonAddress
            labelClassName={'label'}
            valueClassName={'value'}
            valueWrapperClassName={'flex-row-start'}
            label={item.label}
            value={item.value || SYNCHRONIZING_ADDRESS}
            showCopy={!!item.value && item.value !== SYNCHRONIZING_ADDRESS}
            copySize={CopySize.Normal}
          />
        </div>
      ))}
    </div>
  );
}
