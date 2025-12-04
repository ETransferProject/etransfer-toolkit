import { ReactNode } from 'react';

interface ILinkForBlankProps {
  href: string;
  className?: string;
  ariaLabel?: string;
  element?: ReactNode;
}
export default function LinkForBlank({ href, className, ariaLabel, element }: ILinkForBlankProps) {
  return (
    <a href={href} className={className} target="_blank" aria-label={ariaLabel} rel="noopener noreferrer">
      {element}
    </a>
  );
}
