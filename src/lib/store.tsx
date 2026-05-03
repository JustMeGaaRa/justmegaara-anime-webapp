'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ANIME_BY_ID, INITIAL_LISTS, LIST_LABELS, WATCHED_EPS } from './data';
import type { Lists, WatchedEps } from './types';

interface StoreContextValue {
  lists: Lists;
  watchedEps: WatchedEps;
  toast: string | null;
  setListFor: (id: string, key: string) => void;
  removeFrom: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<Lists>({ ...INITIAL_LISTS });
  const [watchedEps] = useState<WatchedEps>({ ...WATCHED_EPS });
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const setListFor = useCallback(
    (id: string, key: string) => {
      setLists((prev) => ({ ...prev, [id]: key as Lists[string] }));
      showToast(`Added "${ANIME_BY_ID[id]?.title}" to ${LIST_LABELS[key]}`);
    },
    [showToast],
  );

  const removeFrom = useCallback(
    (id: string) => {
      setLists((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      showToast(`Removed "${ANIME_BY_ID[id]?.title}" from your list`);
    },
    [showToast],
  );

  const value = useMemo(
    () => ({ lists, watchedEps, toast, setListFor, removeFrom }),
    [lists, watchedEps, toast, setListFor, removeFrom],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
