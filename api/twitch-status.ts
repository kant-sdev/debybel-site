interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
}

interface TwitchTokenResponse {
  access_token?: string;
}

interface TwitchStreamsResponse {
  data?: Array<{
    title?: string;
    game_name?: string;
    viewer_count?: number;
  }>;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Unable to retrieve Twitch status' });
  }

  try {
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Twitch token request failed with status ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json() as TwitchTokenResponse;
    if (!tokenData.access_token) {
      throw new Error('Twitch token response did not contain an access token');
    }

    const streamResponse = await fetch(
      'https://api.twitch.tv/helix/streams?user_login=debybel',
      {
        headers: {
          'Client-Id': clientId,
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    if (!streamResponse.ok) {
      throw new Error(`Twitch stream request failed with status ${streamResponse.status}`);
    }

    const streamData = await streamResponse.json() as TwitchStreamsResponse;
    const stream = streamData.data?.[0];

    if (!stream) {
      return res.status(200).json({ isLive: false });
    }

    if (
      typeof stream.title !== 'string'
      || typeof stream.game_name !== 'string'
      || typeof stream.viewer_count !== 'number'
    ) {
      throw new Error('Twitch stream response did not contain the expected stream details');
    }

    return res.status(200).json({
      isLive: true,
      title: stream.title,
      game: stream.game_name,
      viewers: stream.viewer_count,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to retrieve Twitch status' });
  }
}
