import { site } from '../data/site';

export function getLiveStatus(): boolean {
  // Mock only. Live state must eventually come from a serverless /api/live endpoint:
  // Twitch requires a client secret, which must never be exposed in frontend code.
  return site.mockLiveStatus;
}
