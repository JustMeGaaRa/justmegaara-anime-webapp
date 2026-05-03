'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { User } from '@/lib/mal';

interface TopBarProps {
  userInfo?: User | null;
}

export default function TopBar({ userInfo }: TopBarProps) {
  const pathname = usePathname();

  const initials = userInfo?.name
    ? userInfo.name.slice(0, 2).toUpperCase()
    : 'JM';

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="brand-name">
            JustMeGaaRa <span className="brand-x">/</span> Anime
          </div>
        </Link>
        <nav className="topnav">
          <Link href="/" className={'topnav-link' + (pathname === '/' ? ' is-active' : '')}>
            Dashboard
          </Link>
          <Link
            href="/trending"
            className={'topnav-link' + (pathname === '/trending' ? ' is-active' : '')}
          >
            Trending
          </Link>
        </nav>
        <div className="topbar-right">
          <div className="search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M11 11 L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input placeholder="Search 24,193 titles…" />
            <span className="search-kbd">⌘K</span>
          </div>
          {userInfo?.picture ? (
            <Image
              src={userInfo.picture}
              alt={userInfo.name}
              width={32}
              height={32}
              className="avatar"
              title={userInfo.name}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : userInfo ? (
            <div className="avatar" title={userInfo.name}>{initials}</div>
          ) : (
            <Link href="/auth/login" className="action-link" style={{ fontSize: '13px', padding: '6px 12px' }}>
              Sign in with MAL
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
