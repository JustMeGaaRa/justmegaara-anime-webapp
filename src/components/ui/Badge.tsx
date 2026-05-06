import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'airing' | 'upcoming';
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  let variantClass = '';
  if (variant === 'airing') variantClass = 'ac-pill--airing';
  else if (variant === 'upcoming') variantClass = 'ac-pill--upcoming';

  const combinedClass = `ac-pill ${variantClass} ${className}`.trim();

  return (
    <span className={combinedClass} {...props}>
      {children}
    </span>
  );
}
