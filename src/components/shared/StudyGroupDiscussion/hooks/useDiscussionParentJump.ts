import type { ThreadDetail } from '@/types/thread-post';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type UseDiscussionParentJumpOptions = {
  clearDiscussionFilters: () => void;
  watchValue: ThreadDetail[];
};

export function useDiscussionParentJump({ clearDiscussionFilters, watchValue }: UseDiscussionParentJumpOptions) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [pendingJumpParentId, setPendingJumpParentId] = useState<string | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToPostAndHighlight = useCallback((postId: string) => {
    if (typeof document === 'undefined') return false;

    const element = document.getElementById(`discussion-post-${postId}`);
    if (!element) return false;

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightedId(postId);

    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedId(null);
      highlightTimeoutRef.current = null;
    }, 1500);

    return true;
  }, []);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    };
  }, []);

  const jumpToParent = useCallback(
    (parentId: string) => {
      if (scrollToPostAndHighlight(parentId)) return;

      setPendingJumpParentId(parentId);
      clearDiscussionFilters();
    },
    [clearDiscussionFilters, scrollToPostAndHighlight],
  );

  useEffect(() => {
    if (!pendingJumpParentId || typeof window === 'undefined') return;

    const animationFrameId = window.requestAnimationFrame(() => {
      if (scrollToPostAndHighlight(pendingJumpParentId)) {
        setPendingJumpParentId(null);
        return;
      }

      toast.error('Pesan asli tidak ada di tampilan ini.', { toasterId: 'global' });
      setPendingJumpParentId(null);
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [pendingJumpParentId, scrollToPostAndHighlight, watchValue]);

  return {
    highlightedId,
    jumpToParent,
  };
}
