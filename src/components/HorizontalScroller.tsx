'use client';

import { useRef } from 'react';

export default function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className="hscroll-wrap">
      <button className="hscroll-btn hscroll-btn--prev" onClick={() => scroll(-1)} aria-label="Scroll left">
        ‹
      </button>
      <div className="hscroll" ref={ref}>
        {children}
      </div>
      <button className="hscroll-btn hscroll-btn--next" onClick={() => scroll(1)} aria-label="Scroll right">
        ›
      </button>
    </div>
  );
}
