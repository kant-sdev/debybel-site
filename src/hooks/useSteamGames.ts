import { useEffect, useState } from 'react';

export interface SteamGame {
  appid: number;
  name: string;
  header_image: string;
  short_description: string;
  store_url: string;
}

function isSteamGame(value: unknown): value is SteamGame {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const game = value as Record<string, unknown>;
  return (
    typeof game.appid === 'number'
    && typeof game.name === 'string'
    && typeof game.header_image === 'string'
    && typeof game.short_description === 'string'
    && typeof game.store_url === 'string'
  );
}

export function useSteamGames() {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchGames = async () => {
      try {
        const response = await fetch('/.netlify/functions/steam-games', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Steam games request failed with status ${response.status}`);
        }

        const payload: unknown = await response.json();
        if (!Array.isArray(payload) || !payload.every(isSteamGame)) {
          throw new Error('Steam games API returned an invalid response');
        }

        if (active) {
          setGames(payload);
          setError(null);
        }
      } catch (fetchError) {
        if (active && !(fetchError instanceof DOMException && fetchError.name === 'AbortError')) {
          const failure = fetchError instanceof Error
            ? fetchError
            : new Error('Unable to retrieve Steam games');
          setError(failure);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchGames();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { games, loading, error };
}
