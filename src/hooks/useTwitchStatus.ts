import { useEffect, useState } from 'react';

export interface TwitchStreamInfo {
  title: string;
  game: string;
  viewers: number;
}

type TwitchStatusResponse =
  | { isLive: false }
  | { isLive: true; title: string; game: string; viewers: number };

const POLLING_INTERVAL = 60_000;

function isTwitchStatusResponse(value: unknown): value is TwitchStatusResponse {
  if (typeof value !== 'object' || value === null || !('isLive' in value)) {
    return false;
  }

  const status = value as Record<string, unknown>;
  return status.isLive === false || (
    status.isLive === true
    && typeof status.title === 'string'
    && typeof status.game === 'string'
    && typeof status.viewers === 'number'
  );
}

export function useTwitchStatus() {
  const [isLive, setIsLive] = useState(false);
  const [streamInfo, setStreamInfo] = useState<TwitchStreamInfo | null>(null);

  useEffect(() => {
    let active = true;
    let requestInProgress = false;
    const controller = new AbortController();

    const fetchStatus = async () => {
      if (requestInProgress) return;
      requestInProgress = true;

      try {
        const response = await fetch('/api/twitch-status', { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Twitch status request failed with status ${response.status}`);
        }

        const payload: unknown = await response.json();
        if (!isTwitchStatusResponse(payload)) {
          throw new Error('Twitch status API returned an invalid response');
        }

        if (!active) return;
        setIsLive(payload.isLive);
        setStreamInfo(payload.isLive
          ? {
            title: payload.title,
            game: payload.game,
            viewers: payload.viewers,
          }
          : null);
      } catch (error) {
        if (active && !(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Failed to fetch Twitch status:', error);
        }
      } finally {
        requestInProgress = false;
      }
    };

    void fetchStatus();
    const intervalId = window.setInterval(() => {
      void fetchStatus();
    }, POLLING_INTERVAL);

    return () => {
      active = false;
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  return { isLive, streamInfo };
}
