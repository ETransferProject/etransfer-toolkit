import { useMemo } from 'react';
import './index.less';
import clsx from 'clsx';
import CommonAddress from '../../../CommonAddress';
import { getAccountInfo } from '../../../../utils';
import { SYNCHRONIZING_ADDRESS } from '../../../../constants';
import { CopySize } from '../../../Copy';

interface AddressProps {
  hideBorder?: boolean;
}

export default function Address({ hideBorder }: AddressProps) {
  const accountsList = useMemo(() => {
    const accountInfo = getAccountInfo();
    const accounts = accountInfo.accounts;
    const temp: any[] = [];
    Object.keys(accounts)?.forEach((key) => {
      console.log('🌈 🌈 🌈 🌈 🌈 🌈 key', key);
      // if (key && accounts?.[key]) {
      //   temp.push({
      //     label: key,
      //     value: accounts?.[key],
      //   });
      // }
    }, []);

    return temp;
  }, []);

  return (
    <>
      <div>
        {accountsList.map((item) => (
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
    </>
  );
}
