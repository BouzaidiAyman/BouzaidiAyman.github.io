import { ReactNode } from 'react';

interface LinkProps {
  page: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Link({ page, children, className, onClick }: LinkProps) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (onClick) onClick();
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  }
  return (
    <a href={`#${page}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
