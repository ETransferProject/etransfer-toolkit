import clsx from 'clsx';
import './index.less';
import { useMemo } from 'react';
import CommonSvg from '../CommonSvg';
import { BlockchainNetworkType } from '../../constants/network';

type TNetworkLogoSize = 'normal' | 'small' | 'big';

const NetworkLogoMap: Record<string, Record<TNetworkLogoSize, any>> = {
  [BlockchainNetworkType.AELF]: {
    normal: <CommonSvg type="aelfMedium" />,
    small: <CommonSvg type="aelf" />,
    big: <CommonSvg type="aelfBig" />,
  },
  [BlockchainNetworkType.tDVV]: {
    normal: <CommonSvg type="tDVVMedium" />,
    small: <CommonSvg type="tDVV" />,
    big: <CommonSvg type="tDVVBig" />,
  },
  [BlockchainNetworkType.tDVW]: {
    normal: <CommonSvg type="tDVVMedium" />,
    small: <CommonSvg type="tDVV" />,
    big: <CommonSvg type="tDVVBig" />,
  },
  [BlockchainNetworkType.Arbitrum]: {
    normal: <CommonSvg type="arbitrumMedium" />,
    small: <CommonSvg type="arbitrum" />,
    big: <CommonSvg type="arbitrumBig" />,
  },
  [BlockchainNetworkType.Avax]: {
    normal: <CommonSvg type="avaxMedium" />,
    small: <CommonSvg type="avax" />,
    big: <CommonSvg type="avaxBig" />,
  },
  [BlockchainNetworkType.Binance]: {
    normal: <CommonSvg type="binanceMedium" />,
    small: <CommonSvg type="binance" />,
    big: <CommonSvg type="binanceBig" />,
  },
  [BlockchainNetworkType.Ethereum]: {
    normal: <CommonSvg type="ethereumMedium" />,
    small: <CommonSvg type="ethereum" />,
    big: <CommonSvg type="ethereumBig" />,
  },
  [BlockchainNetworkType.Optimism]: {
    normal: <CommonSvg type="optimismMedium" />,
    small: <CommonSvg type="optimism" />,
    big: <CommonSvg type="optimismBig" />,
  },
  [BlockchainNetworkType.Polygon]: {
    normal: <CommonSvg type="polygonMedium" />,
    small: <CommonSvg type="polygon" />,
    big: <CommonSvg type="polygonBig" />,
  },
  [BlockchainNetworkType.Solana]: {
    normal: <CommonSvg type="solanaMedium" />,
    small: <CommonSvg type="solana" />,
    big: <CommonSvg type="solanaBig" />,
  },
  [BlockchainNetworkType.Tron]: {
    normal: <CommonSvg type="tronMedium" />,
    small: <CommonSvg type="tron" />,
    big: <CommonSvg type="tronBig" />,
  },
  [BlockchainNetworkType.TON]: {
    normal: <CommonSvg type="tonMedium" />,
    small: <CommonSvg type="ton" />,
    big: <CommonSvg type="tonBig" />,
  },
  [BlockchainNetworkType.BASE]: {
    normal: <CommonSvg type="baseMedium" />,
    small: <CommonSvg type="base" />,
    big: <CommonSvg type="baseBig" />,
  },
};

export function NetworkLogo({
  id,
  network,
  className,
  size = 'big',
}: {
  network: string;
  id?: string;
  className?: string;
  size?: TNetworkLogoSize;
}) {
  const renderNetworkLogo = useMemo(() => NetworkLogoMap?.[network]?.[size], [network, size]);

  if (renderNetworkLogo) {
    return (
      <div id={id} className={clsx(`etransfer-ui-network-logo-${size}`, className)}>
        {renderNetworkLogo}
      </div>
    );
  }

  // when not match network's type, display first character and uppercase
  return (
    <div id={id} className={clsx('etransfer-ui-network-logo', `etransfer-ui-network-logo-${size}`, className)}>
      {network?.charAt(0).toUpperCase()}
    </div>
  );
}
