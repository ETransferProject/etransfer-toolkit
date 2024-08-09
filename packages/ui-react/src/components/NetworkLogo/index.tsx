import clsx from 'clsx';
import './index.less';
import { useMemo } from 'react';
import CommonSvg from '../CommonSvg';
import { BlockchainNetworkType } from '../../constants/network';

type TNetworkLogoSize = 'normal' | 'small';

const NetworkLogoMap: Record<string, Record<TNetworkLogoSize, any>> = {
  [BlockchainNetworkType.AELF]: {
    normal: <CommonSvg type="aelfMedium" />,
    small: <CommonSvg type="aelf" />,
  },
  [BlockchainNetworkType.Arbitrum]: {
    normal: <CommonSvg type="arbitrumMedium" />,
    small: <CommonSvg type="arbitrum" />,
  },
  [BlockchainNetworkType.Avax]: {
    normal: <CommonSvg type="avaxMedium" />,
    small: <CommonSvg type="avax" />,
  },
  [BlockchainNetworkType.Binance]: {
    normal: <CommonSvg type="binanceMedium" />,
    small: <CommonSvg type="binance" />,
  },
  [BlockchainNetworkType.Ethereum]: {
    normal: <CommonSvg type="ethereumMedium" />,
    small: <CommonSvg type="ethereum" />,
  },
  [BlockchainNetworkType.Optimism]: {
    normal: <CommonSvg type="optimismMedium" />,
    small: <CommonSvg type="optimism" />,
  },
  [BlockchainNetworkType.Polygon]: {
    normal: <CommonSvg type="polygonMedium" />,
    small: <CommonSvg type="polygon" />,
  },
  [BlockchainNetworkType.Solana]: {
    normal: <CommonSvg type="solanaMedium" />,
    small: <CommonSvg type="solana" />,
  },
  [BlockchainNetworkType.Tron]: {
    normal: <CommonSvg type="tronMedium" />,
    small: <CommonSvg type="tron" />,
  },
  [BlockchainNetworkType.TON]: {
    normal: <CommonSvg type="tonMedium" />,
    small: <CommonSvg type="ton" />,
  },
};

export function NetworkLogoForWeb({
  network,
  className,
  size = 'normal',
}: {
  network: string;
  className?: string;
  size?: TNetworkLogoSize;
}) {
  const renderNetworkLogo = useMemo(() => NetworkLogoMap?.[network]?.[size], [network, size]);

  if (renderNetworkLogo) {
    return <div className={className}>{renderNetworkLogo}</div>;
  }

  // when not match network's type, display first character and uppercase
  return (
    <div className={clsx('etransfer-ui-network-logo-text', 'etransfer-ui-network-logo-text-for-web', className)}>
      {network?.charAt(0).toUpperCase()}
    </div>
  );
}

export function NetworkLogoForMobile({
  network,
  className,
  size = 'small',
}: {
  network: string;
  className?: string;
  size?: TNetworkLogoSize;
}) {
  const renderNetworkLogo = useMemo(() => NetworkLogoMap?.[network]?.[size], [network, size]);

  if (renderNetworkLogo) {
    return <div className={className}>{renderNetworkLogo}</div>;
  }

  // when not match network's type, display first character and uppercase
  return (
    <div className={clsx('etransfer-ui-network-logo-text', 'etransfer-ui-network-logo-text-for-mobile', className)}>
      {network?.charAt(0).toUpperCase()}
    </div>
  );
}
