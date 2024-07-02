import clsx from 'clsx';
import { ReactEventHandler } from 'react';

export type TCommonImageProps = {
  src: HTMLImageElement['src'];
  width: HTMLImageElement['width'];
  height: HTMLImageElement['height'];
  className?: HTMLImageElement['className'];
  alt?: HTMLImageElement['alt'];
  loading?: HTMLImageElement['loading'];
  decoding?: HTMLImageElement['decoding'];
  priority?: 'high' | 'low' | 'auto';
  objectFit?: 'fill' | 'contain' | 'cover' | 'scale-down' | 'none';
  onLoad?: ReactEventHandler<HTMLImageElement>;
  onError?: ReactEventHandler<HTMLImageElement>;
};
export default function CommonImage({
  src,
  width,
  height,
  className,
  alt,
  loading,
  decoding,
  priority,
  objectFit,
  onLoad,
  onError,
}: TCommonImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      decoding={decoding}
      fetchPriority={priority}
      loading={loading}
      className={clsx(
        'etransfer-ui-image',
        objectFit === 'fill' && 'etransfer-ui-object-fill',
        objectFit === 'contain' && 'etransfer-ui-object-contain',
        objectFit === 'cover' && 'etransfer-ui-object-cover',
        objectFit === 'scale-down' && 'etransfer-ui-object-scale',
        objectFit === 'none' && 'etransfer-ui-object-none',
        className,
      )}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
