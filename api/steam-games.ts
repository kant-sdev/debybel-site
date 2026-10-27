interface ApiRequest {
  method?: string;
  query?: {
    appids?: string | string[];
  };
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

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

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const appidValues = Array.isArray(req.query?.appids)
    ? req.query.appids.flatMap((value) => value.split(','))
    : req.query?.appids?.split(',');
  const appidStrings = appidValues?.map((value) => value.trim());

  if (
    !appidStrings?.length
    || appidStrings.some((appid) => (
      !/^\d+$/.test(appid)
      || !Number.isSafeInteger(Number(appid))
      || Number(appid) < 1
    ))
  ) {
    return res.status(400).json({ error: 'Provide one or more valid appids' });
  }

  try {
    const appids = [...new Set(appidStrings.map((appid) => String(Number(appid))))];
    const results = await Promise.all(appids.map(async (appid) => {
      try {
        const response = await fetch(
          `https://store.steampowered.com/api/appdetails?appids=${encodeURIComponent(appid)}&cc=BR`,
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
      } catch (error) {
        return null;
      }
    }));
    const gamesArray = results.filter((game) => game !== null);

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(gamesArray);
  } catch (error) {
    return res.status(502).json({ error: 'Unable to retrieve Steam game details' });
  }
}
