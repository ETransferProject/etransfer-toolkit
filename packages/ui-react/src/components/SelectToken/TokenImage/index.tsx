import clsx from 'clsx';
import { useState, useEffect } from 'react';
import CommonImage from '../../CommonImage';
import './index.less';

export interface TokenImageProps {
  src: string;
  symbol: string;
  isShowImage?: boolean;
  size?: number;
}

export default function TokenImage({ src, isShowImage = true, symbol, size = 24 }: TokenImageProps) {
  const [showIcon, setShowIcon] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isShowImage && isSuccess) {
      setShowIcon(true);
    }
  }, [isSuccess, isShowImage]);

  return (
    <div className="etransfer-ui-token-image-wrapper">
      {showIcon && src && (
        <CommonImage
          src={src}
          width={size}
          height={size}
          alt="token"
          loading="eager"
          objectFit="cover"
          className={clsx('etransfer-ui-token-image')}
          onLoad={() => {
            setIsSuccess(true);
          }}
          onError={() => setIsSuccess(false)}
        />
      )}
      {!isSuccess && (
        <div
          className={clsx('etransfer-ui-row-center', 'etransfer-ui-token-image', 'etransfer-ui-token-image-default')}
          style={{ width: size, height: size, lineHeight: size + 'px' }}>
          {symbol.charAt(0)}
        </div>
      )}
    </div>
  );
}
