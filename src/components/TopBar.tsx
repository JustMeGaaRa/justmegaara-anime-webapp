'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { User } from '@/lib/mal';
import { logout } from '@/app/actions';

interface TopBarProps {
  userInfo?: User | null;
}

export default function TopBar({ userInfo }: TopBarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = userInfo?.name
    ? userInfo.name.slice(0, 2).toUpperCase()
    : 'JM';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

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
          {userInfo ? (
            <div className="ac-menu" ref={menuRef}>
              <button
                className="avatar-trigger"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                {userInfo.picture ? (
                  <Image
                    src={userInfo.picture}
                    alt={userInfo.name}
                    width={32}
                    height={32}
                    className="avatar"
                    title={userInfo.name}
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="avatar" title={userInfo.name}>
                    {initials}
                  </div>
                )}
              </button>

              {isMenuOpen && (
                <div className="ac-menu-pop profile-dropdown" style={{ minWidth: '180px' }}>
                  <div className="ac-menu-label">User</div>
                  <div className="ac-menu-item" style={{ cursor: 'default' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--fg)' }}>{userInfo.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--fg-3)' }}>MyAnimeList Profile</div>
                    </div>
                  </div>
                  <div className="ac-menu-sep" />
                  <button
                    className="ac-menu-item ac-menu-item--danger"
                    onClick={handleLogout}
                    style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: '8px' }}
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="action-link"
              style={{ fontSize: '13px', padding: '6px 12px' }}
            >
              Sign in with MAL
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
