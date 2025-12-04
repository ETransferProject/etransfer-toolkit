import React from 'react';
import { devices } from '@portkey/utils';

export default function CommonLink({
  href,
  children,
  className,
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = devices.isMobileDevices();
  const target = isMobile ? '_self' : '_blank';

  return (
    <a target={target} href={href} rel="noreferrer" className={className}>
      {children}
    </a>
  );
}
