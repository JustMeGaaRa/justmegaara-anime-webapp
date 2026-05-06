'use client';

import React from 'react';
import type { Anime } from '@/lib/types';
import { DropdownMenu } from '../ui/DropdownMenu';
import { LIST_LABELS, LIST_ORDER } from '@/lib/data';

interface CardMenuProps {
  anime: Anime;
  currentList: string | null;
  onSetList: (key: string) => void;
  onRemove: () => void;
}

export function CardMenu({ anime, currentList, onSetList, onRemove }: CardMenuProps) {
  return (
    <DropdownMenu className="ac-menu">
      <DropdownMenu.Trigger
        className="ac-menu-trigger"
        onClick={(e) => e.stopPropagation()}
        aria-label={`Manage ${anime.title}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="3" cy="8" r="1.4" fill="currentColor" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" />
          <circle cx="13" cy="8" r="1.4" fill="currentColor" />
        </svg>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Label>Move to list</DropdownMenu.Label>
        {LIST_ORDER.map((key) => (
          <DropdownMenu.Item
            key={key}
            className={currentList === key ? ' is-active' : ''}
            onClick={(e) => {
              e.stopPropagation();
              onSetList(key);
            }}
          >
            <span className={'ac-dot ac-dot--' + key}></span>
            {LIST_LABELS[key]}
            {currentList === key && <span className="ac-menu-check">✓</span>}
          </DropdownMenu.Item>
        ))}
        
        {currentList && (
          <>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              Remove from my list
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
