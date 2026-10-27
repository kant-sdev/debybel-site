import type { Handler } from '@netlify/functions';

interface TwitchTokenResponse {
  access_token?: string;
  expires_in?: number;
}

interface TwitchStreamsResponse {
  data?: Array<{
    title?: string;
    game_name?: string;
    viewer_count?: number;
  }>;
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

const responseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=30',
};

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

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
  if (
    typeof tokenData.access_token !== 'string'
    || typeof tokenData.expires_in !== 'number'
  ) {
    throw new Error('Twitch token response did not contain a valid access token');
  }

  cachedAccessToken = tokenData.access_token;
  tokenExpiresAt = Date.now() + Math.max(tokenData.expires_in - 60, 0) * 1000;
  return cachedAccessToken;
}

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...responseHeaders, Allow: 'GET' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be configured');
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ error: 'Unable to retrieve Twitch status' }),
    };
  }

  try {
    const accessToken = await getAccessToken(clientId, clientSecret);
    const streamResponse = await fetch(
      'https://api.twitch.tv/helix/streams?user_login=debybel',
      {
        headers: {
          'Client-Id': clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!streamResponse.ok) {
      throw new Error(`Twitch stream request failed with status ${streamResponse.status}`);
    }

    const streamData = await streamResponse.json() as TwitchStreamsResponse;
    const stream = streamData.data?.[0];

    if (!stream) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify({ isLive: false }),
      };
    }

    if (
      typeof stream.title !== 'string'
      || typeof stream.game_name !== 'string'
      || typeof stream.viewer_count !== 'number'
    ) {
      throw new Error('Twitch stream response did not contain the expected stream details');
    }

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({
        isLive: true,
        title: stream.title,
        game: stream.game_name,
        viewers: stream.viewer_count,
      }),
    };
  } catch (error) {
    console.error('Unable to retrieve Twitch status:', error);
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ error: 'Unable to retrieve Twitch status' }),
    };
  }
};
