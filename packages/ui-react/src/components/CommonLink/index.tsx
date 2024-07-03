import React from 'react';
import { devices } from '@portkey/utils';

export default function CommonLink({ href, children }: { href: string; children?: React.ReactNode }) {
  const isMobile = devices.isMobileDevices();
  const target = isMobile ? '_self' : '_blank';

  return (
    <a target={target} href={href} rel="noreferrer">
      {children}
    </a>
  );
}
