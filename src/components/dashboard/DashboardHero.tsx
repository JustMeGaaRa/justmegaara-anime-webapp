'use client';

import React from 'react';
import { Stat } from '../ui/Stat';
import type { MALProfileData } from '@/app/page';

interface DashboardHeroProps {
  malData?: MALProfileData | null;
  stats: {
    watching: number;
    planned: number;
    completed: number;
    total: number;
  };
}

export function DashboardHero({ malData, stats }: DashboardHeroProps) {
  return (
    <section className="hero">
      <div className="hero-greet">
        <div className="hero-eyebrow">Welcome back{malData?.user.name ? `, ${malData.user.name}` : ''}</div>
        <h1 className="hero-title">What are you watching tonight?</h1>
      </div>
      <div className="hero-stats">
        <Stat>
          <Stat.Value>{stats.watching}</Stat.Value>
          <Stat.Label>Watching</Stat.Label>
        </Stat>
        <Stat>
          <Stat.Value>{stats.planned}</Stat.Value>
          <Stat.Label>Planned</Stat.Label>
        </Stat>
        <Stat>
          <Stat.Value>{stats.completed}</Stat.Value>
          <Stat.Label>Completed</Stat.Label>
        </Stat>
        <Stat emphasis>
          <Stat.Value>{stats.total}</Stat.Value>
          <Stat.Label>On your list</Stat.Label>
        </Stat>
      </div>
    </section>
  );
}
