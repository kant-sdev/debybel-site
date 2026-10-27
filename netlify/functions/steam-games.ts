import type { Handler } from '@netlify/functions';

const APP_IDS = ['381210', '1086940', '2050650', '227300'];
const CACHE_DURATION_MS = 60 * 60 * 1000;

interface SteamAppDetailsResponse {
  [appid: string]: {
    success: boolean;
    data?: {
      name?: string;
      header_image?: string;
      short_description?: string;
    };
  };
}

interface SteamGame {
  appid: number;
  name: string;
  header_image: string;
  short_description: string;
  store_url: string;
}

let cachedGames: SteamGame[] | null = null;
let cacheExpiresAt = 0;

const responseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
};

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...responseHeaders, Allow: 'GET' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (cachedGames && Date.now() < cacheExpiresAt) {
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(cachedGames),
    };
  }

  try {
    const results = await Promise.all(APP_IDS.map(async (appid) => {
      const response = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=BR`,
      );

      if (!response.ok) {
        throw new Error(`Steam appdetails request failed with status ${response.status}`);
      }

      const result = await response.json() as SteamAppDetailsResponse;
      const details = result[appid];
      const data = details?.data;

      if (
        !details?.success
        || typeof data?.name !== 'string'
        || typeof data.header_image !== 'string'
        || typeof data.short_description !== 'string'
      ) {
        return null;
      }

      return {
        appid: Number(appid),
        name: data.name,
        header_image: data.header_image,
        short_description: data.short_description,
        store_url: `https://store.steampowered.com/app/${appid}/`,
      };
    }));
    const gamesArray = results.filter((game) => game !== null);

    cachedGames = gamesArray;
    cacheExpiresAt = Date.now() + CACHE_DURATION_MS;

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(gamesArray),
    };
  } catch (error) {
    console.error('Unable to retrieve Steam game details:', error);
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ error: 'Unable to retrieve Steam game details' }),
    };
  }
};
