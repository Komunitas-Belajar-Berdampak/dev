import { useCallback, useEffect, useState } from 'react';

type UseScrollJumpOptions = {
  offset?: number;
  watchValue?: unknown;
};

export function useScrollJump({ offset = 120, watchValue }: UseScrollJumpOptions = {}) {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollState = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    setCanScrollUp(scrollTop > offset);
    setCanScrollDown(scrollTop + viewportHeight < documentHeight - offset);
  }, [offset]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    updateScrollState();

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    updateScrollState();
  }, [watchValue, updateScrollState]);

  const scrollToTop = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToBottom = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  }, []);

  return {
    canScrollUp,
    canScrollDown,
    scrollToTop,
    scrollToBottom,
  };
}
