import { getThreadLatestUpdate } from '@/api/thread-post';
import type { ApiResponse } from '@/types/api';
import type { ThreadLatestUpdate } from '@/types/thread-post';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

const DISCUSSION_UPDATE_POLL_INTERVAL_MS = 5000;

type UseDiscussionLatestUpdatePollingParams = {
  threadId: string;
  enabled: boolean;
  onHasUpdate: () => void;
};

const getLatestUpdateFingerprint = (latestUpdate: ThreadLatestUpdate) => `${latestUpdate.latestUpdatedAt ?? 'empty'}:${latestUpdate.totalPosts}`;

const usePageVisibility = () => {
  const [isPageVisible, setIsPageVisible] = useState(() => typeof document === 'undefined' || document.visibilityState === 'visible');

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isPageVisible;
};

export const useDiscussionLatestUpdatePolling = ({ threadId, enabled, onHasUpdate }: UseDiscussionLatestUpdatePollingParams) => {
  const latestUpdateFingerprintRef = useRef<string | null>(null);
  const isPageVisible = usePageVisibility();
  const isPollingEnabled = enabled && isPageVisible;

  useEffect(() => {
    latestUpdateFingerprintRef.current = null;
  }, [threadId]);

  const { data: latestUpdateData } = useQuery<ApiResponse<ThreadLatestUpdate>, Error, ThreadLatestUpdate>({
    queryKey: ['thread-latest-update', threadId],
    queryFn: () => getThreadLatestUpdate(threadId),
    select: (res) => res.data,
    enabled: isPollingEnabled,
    refetchInterval: DISCUSSION_UPDATE_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (!latestUpdateData) return;

    const nextFingerprint = getLatestUpdateFingerprint(latestUpdateData);
    if (!latestUpdateFingerprintRef.current) {
      latestUpdateFingerprintRef.current = nextFingerprint;
      return;
    }

    if (latestUpdateFingerprintRef.current === nextFingerprint) return;

    latestUpdateFingerprintRef.current = nextFingerprint;
    onHasUpdate();
  }, [latestUpdateData, onHasUpdate]);
};
