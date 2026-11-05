'use client';

import { useEffect, useState, type RefObject } from 'react';

interface Options {
  pageKey: string;
  isDataReady: boolean;
  contentRef: RefObject<HTMLDivElement>;
}

/** Reveal the initial form together, without hiding it during later price updates. */
export function useBookingPageLoading({ pageKey, isDataReady, contentRef }: Options) {
  const [readyPageKey, setReadyPageKey] = useState<string | null>(null);
  const isInitialLoading = readyPageKey !== pageKey;

  useEffect(() => {
    if (!isInitialLoading || !isDataReady) return;

    let cancelled = false;
    const cleanups: (() => void)[] = [];
    const images = Array.from(contentRef.current?.querySelectorAll('img') ?? []);
    const imageLoads = images.map((image) => {
      // Offscreen lazy images must also finish before the whole page is revealed.
      image.loading = 'eager';
      if (image.complete) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const finish = () => {
          image.removeEventListener('load', finish);
          image.removeEventListener('error', finish);
          resolve();
        };
        image.addEventListener('load', finish);
        image.addEventListener('error', finish);
        cleanups.push(finish);
      });
    });

    Promise.all([...imageLoads, document.fonts.ready]).then(() => {
      if (!cancelled) setReadyPageKey(pageKey);
    });

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pageKey, isDataReady, isInitialLoading, contentRef]);

  return isInitialLoading;
}
