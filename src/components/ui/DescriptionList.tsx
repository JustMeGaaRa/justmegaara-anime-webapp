import React from 'react';

interface DescriptionListProps {
  children: React.ReactNode;
  className?: string;
}

export function DescriptionList({ children, className = 'dt-attrs' }: DescriptionListProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

function DescriptionListItem({ children, className = 'dt-attr' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
DescriptionList.Item = DescriptionListItem;

function DescriptionListTerm({ children, className = 'dt-attr-label' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
DescriptionList.Term = DescriptionListTerm;

function DescriptionListDetails({ children, className = 'dt-attr-value' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
DescriptionList.Details = DescriptionListDetails;
