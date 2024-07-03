import { ConfigProvider } from 'antd';
import { ETRANSFER_PREFIX_CLS } from '../constants/index';

export default function ETransferStyleProvider({ children }: { children: React.ReactNode }) {
  return <ConfigProvider prefixCls={ETRANSFER_PREFIX_CLS}>{children}</ConfigProvider>;
}
