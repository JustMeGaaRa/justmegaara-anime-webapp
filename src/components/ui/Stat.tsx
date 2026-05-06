import React from 'react';

interface StatProps {
  children: React.ReactNode;
  className?: string;
  emphasis?: boolean;
}

export function Stat({ children, className = 'hero-stat', emphasis }: StatProps) {
  const rootClass = `${className}${emphasis ? ' hero-stat--emph' : ''}`;
  return (
    <div className={rootClass}>
      {children}
    </div>
  );
}

function StatValue({ children, className = 'hero-stat-n' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
Stat.Value = StatValue;

function StatLabel({ children, className = 'hero-stat-label' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
Stat.Label = StatLabel;
