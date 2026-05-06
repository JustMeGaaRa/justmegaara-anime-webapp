'use client';

import React from 'react';
import { DropdownMenu } from '../ui/DropdownMenu';
import { LIST_LABELS, LIST_ORDER } from '@/lib/data';

interface ListSwitcherProps {
  current: string | null;
  onSetList: (k: string) => void;
  onRemove: () => void;
}

export function ListSwitcher({ current, onSetList, onRemove }: ListSwitcherProps) {
  const label = current ? LIST_LABELS[current] : 'Add to list';

  return (
    <DropdownMenu className="dt-listsw">
      <DropdownMenu.Trigger
        className={`dt-btn dt-btn--list${current ? ' is-set' : ''}`}
      >
        {current && <span className={'ac-dot ac-dot--' + current}></span>}
        {label}
        <span className="dt-listsw-caret">▾</span>
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Content className="ac-menu-pop dt-listsw-pop">
        <DropdownMenu.Label>Move to list</DropdownMenu.Label>
        
        {LIST_ORDER.map((key) => (
          <DropdownMenu.Item
            key={key}
            className={current === key ? ' is-active' : ''}
            onClick={() => onSetList(key)}
          >
            <span className={'ac-dot ac-dot--' + key}></span>
            {LIST_LABELS[key]}
            {current === key && <span className="ac-menu-check">✓</span>}
          </DropdownMenu.Item>
        ))}
        
        {current && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              variant="danger"
              onClick={() => onRemove()}
            >
              Remove from my list
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
